---
layout: post
title: "Rest API's with AKKA-HTTP(Part-2)"
img: akka-http-2.jpg
tags: [Akka, Micro Services, Rest, http, Scala]
author: Avinash R. E
---
### In the [part 1]({{ site.baseurl }}{% post_url 2018-04-15-building-rest-apis-with-akka-http %}) we discussed about some core concepts of Akka Http. Towards the end we were looking for better ways to eliminate boilerplate declaration from service methods.

## Route from Routing DSL
> Akka HTTP provides a very flexible “Routing DSL” for elegantly defining RESTful web services. It picks up where the low-level API leaves off and offers much of the higher-level functionality of typical web servers or frameworks, like deconstruction of URIs, content negotiation or static content serving.

> The “Route” is the central concept of Akka HTTP’s Routing DSL. All the structures we build with the DSL, no matter whether they consists of a single line or span several hundred lines, are type turning a RequestContext into a Future[RouteResult]

```scala
object RoutingDSL {
  def main(args: Array[String]) {
    implicit val sys = ActorSystem("IntroductionToAkkaHttp")
    implicit val mat:Materializer = ActorMaterializer()
    val route =
      path("hello"){
        get{
          complete {
            "world"
          }
        }
      } ~
      path("ping"){
        get{
          complete {
            "pong"
          }
        }
      }
    Http().bindAndHandle(route, "localhost", 8090)
  }
}
```

`path`, `get`, `complete` are called [directives](https://doc.akka.io/docs/akka-http/current/routing-dsl/directives/index.html).

> A “Directive” is a small building block used for creating arbitrarily complex route structures. Akka HTTP already pre-defines a large number of [directives](https://doc.akka.io/docs/akka-http/current/routing-dsl/directives/index.html) and we can easily construct wer own.

### Rejections

>When a filtering directive, like the get directive, cannot let the request pass through to its inner route because the filter condition is not satisfied (e.g. because the incoming request is not a GET request) the directive doesn’t immediately complete the request with an error response. Doing so would make it impossible for other routes chained in after the failing filter to get a chance to handle the request. Rather, failing filters “reject” the request in the same way as by explicitly calling requestContext.reject(...).

```scala
import akka.http.scaladsl.coding.Gzip

val route =
  path("order") {
    get {
      complete("Received GET")
    } ~
    post {
      decodeRequestWith(Gzip) {
        complete("Received compressed POST")
      }
    }
  }
```
Operator `~` fuses two routes in a way that allows a second route to get checked if the first route "rejected". Think of it like `pattern matching`

If we observe the above example, it only handles happy path scenario, what happens if an error occurs or we hit a scenario that is not being served ?

These scenarios are handled by something called ***Rejections***.

### How to respond with valid business rejection.

```scala
trait UserRegionService {
def deleteUserFromRegion =  delete {

  override lazy val userRegionDAO = new UserRegionDAO(database) // Ignore, just consider this is some data access object
  override lazy val regionDAO = new RegionDAO(database)// Ignore, just consider this is some data access object

      path("v1" / "regions" / Segment / "users" / Segment) { (regionCode, userIdToDelete) =>
                  if (region.isDefined) {
                      val userRegion = Await.result(userRegionDAO.getByUserIdAndRegionCode(userIdToDelete, region.get.regionCode), 5.seconds)

                      if (userRegion.isDefined) {
                          complete(userRegionDAO.deleteById(userRegion.get.id.get).map(_ => {(StatusCodes.NoContent, s"User Deleted")}))
                      } else {
                          complete(StatusCodes.NotFound, s"$userIdToDelete does not exist in region ${region.get.regionCode}.")
                      }
                  } else {
                      complete(StatusCodes.NotFound, s"Region $regionCode does not exist.")
                  }
      }
  }

  val userRegionServiceRoutes = {deleteUserFromRegion}
}
```
The above route is called to Delete User From Region.
If the requested region and user are defined in the database, we `complete` the request by deleting user. If not, we `complete` the request by responding with  `StatusCodes.NotFound` and appropriate message. This is how we can handling varying business cases.

Notice that in the path we used something called `Segment`, it is a Path Directive used for `PathMatcher`

>Segment matches if the unmatched path starts with a path segment (i.e. not a slash). If so the path segment is extracted as a String instance.

### Handling failures

1. We need to handle failures or exceptions raised during normal processing.
2. Exceptions occurred at any point of execution are propagated up and are handled by `handleExceptions` directive or top level ExceptionHandler
3. This way separates exception handling logic from normal business logic.

```scala

implicit def exceptionHandler: ExceptionHandler =
    ExceptionHandler {
      case e: SQLIntegrityConstraintViolationException =>
                    complete(StatusCodes.NotFound,
                    ServiceErrorMessage(StatusCodes.NotFound.intValue,
                    e.getMessage))
      case t: Throwable =>
                      complete(StatusCodes.InternalServerError, ServiceErrorMessage(StatusCodes.InternalServerError.intValue,
                      t.getMessage))
      case noResults: NoResultsException =>
                      val exceptionMessage = noResults.getMessage
                      Log.error(exceptionMessage)
                      complete(HttpResponse(NoContent))
      case runtime: RuntimeException =>
                      val exceptionMessage = runtime.getMessage
                      Log.error(exceptionMessage)
                      complete(HttpResponse(InternalServerError,
                      entity = exceptionMessage))
    }

def updateUser = put {
    path("v1" / "user") {
      handleExceptions(exceptionHandler) {
        entity(as[User]) { User =>
                    val foundUser = Await.result(UserDAO.getByCode(User.UserCode), 5.seconds)
                    val foundUserCode = foundUser.get.UserCode

                    if (foundUser.isDefined) {
                        val regions = foundUser.get.regionCodes.map(regionCode => Await.result(regionDAO.getByCode(regionCode), 5.seconds)).filter(_.isDefined).map(_.get)
                        val userIsAuthorized = regions.exists(region => isAuthorized(user, region, AllRoles.roles))

                    if (userIsAuthorized) {
                        val updatedUser = Await.result(UserDAO.update(User), 10.seconds)
                        complete(updatedUser)
                        } else {
                            complete(StatusCodes.Forbidden, s"You do not have access to User info $foundUserCode.")
                        }

                    } else {
                        complete(StatusCodes.NotFound, s"$foundUserCode does not exist.")
                    }
        }
    }
  }
}
```

### Query Parameters
```scala
def parameters(param: <ParamDef[T]>): Directive1[T]
```
### Marshaling and Unmarshaling
Marshaling - high level → low (wire) level
Unmarshaling - low (wire) level → high level

Following is an example that demonstrates query parameters and (un)marshaling

```scala

object CustomEntityWithJsonModels {
  case class User(id:String, firstName:String, lastName:Option[String], age:Int, department:Option[String])
  case class UserList(users:Array[User])

  object ServiceJsonProtocol extends DefaultJsonProtocol {
    implicit val userFormat = jsonFormat5(User)
    implicit val userListFormat = jsonFormat1(UserList)
  }
}

object UserService {

  def main(args: Array[String]) {

    import com.utils.CustomEntityWithJsonModels.ServiceJsonProtocol._
    val userBuffer = scala.collection.mutable.ArrayBuffer.empty[User]

    val route =
      path("user/api1") {
        get{
          //Optional parameter
          parameters('firstName, 'lastName) { (firstName, lastName) =>
            complete(s"The firstName is '$firstName' and the lastName is '$lastName'")
          }    
        }
      } ~
      path("user/api2") {
        get{
          //Optional parameter with default value
          parameters('firstName, 'lastName.?) { (firstName, lastName) =>
            val lastNameStr = lastName.getOrElse("no-lastName")
            complete(s"The firstName is '$firstName' and the lastName is '$lastNameStr'")
          }  
        }
      } ~
      path("user/api3") {
        get{
          //Parameter with required value to be same(Kind of filtering)
          parameters('firstName, 'action ! "true") { firstName =>
            complete(s"The firstName is '$firstName'.")
          }  
        }
      } ~
      path("user/api4") {
        get{
          //Deserialized parameter
          parameters('firstName, 'count.as[Int]) { (firstName, count) =>
            complete(s"The firstName is '$firstName' and we have $count of it.")
          }  
        }
      } ~
      path("user/api5") {
        get{
          //Repeated parameter are converted into list
          parameters('firstName, 'city.*) { (firstName, cities) =>
            cities.toList match {
              case Nil         => complete(s"The firstName is '$firstName' and there are no cities.")
              case city :: Nil => complete(s"The firstName is '$firstName' and the city is $city.")
              case multiple    => complete(s"The firstName is '$firstName' and the cities are ${multiple.mkString(", ")}.")
            }
          }
        }
      } ~
      path("user/api6") {
        get{
          //Deserialized parameter into case class
          parameters('firstName, 'lastName.?).as(User) { firstName =>
            complete(s"The firstName information abstracted into firstName info case class is $firstName")
          }
        }
      }

    // (Un)Marshaling example
    path("user"){
        post{
          entity(as[User]){ user =>
            complete {
              if(userBuffer.exists(_.id == user.id))
                require(false, s"${user.id} already exists")
              userBuffer += user
              user // Here I am returning a User and spray-json takes care of all the conversions
            }
          }
        } ~
        get{
          complete {
            UserList(userBuffer.toArray) // Here I am returning a UserList and spray-json takes care of all the conversions
            }
          }
    }
  }
}
```

Lets break down the code..

1. You define custom entities(User, UserList) with corresponding JSON models from DefaultJsonProtocol.
2. User and UserList are case classes(Immutable).
3. In `ServiceJsonProtocol` we are defining how to marshal scala case into Json String.
4. `jsonFormat5` and `jsonFormat1` are util methods part of `spray-json` for (un)marshaling.
5. Then we are defining bunch of routes(ex:_user/api*_) each with different type of query parameters
6. In (Un)Marshaling example, we are defining a route _/user_ that has both post and get methods defined.
7. **POST** _/user_ is posting users and part of the logic we are adding all the users to a buffer and returning list of users when **GET** _/user_.
8. `complete { UserList(userBuffer.toArray) }` returns list of Users in JSON format. If we notice we dint have to specify any (un)marshaling logic, `spray-json` doest it for we.

### In the [part 3]({{ site.baseurl }}{% post_url 2018-04-29-building-rest-apis-with-akka-http-part-3 %}) of this series we will look at some more advanced Akka Http concepts.

Cheers and Happy Coding 🤘
