---
layout: post
title: "Rest API's with AKKA-HTTP(Part-3)"
img: akka-http-3.jpg
tags: [Akka, Micro Services, Rest, http, Scala]
author: Avinash RE
---

### In the [part 1]({{ site.baseurl }}{% post_url 2018-04-15-building-rest-apis-with-akka-http %}) and [part 2]({{ site.baseurl }}{% post_url 2018-04-22-building-rest-apis-with-akka-http-part-2 %}) we discussed about some core concepts of Akka Http. In this final part lets looks at some customizations we can utilize to make wer code more powerful and how to test Akka Http services.

### Custom directives

In previous parts we utilized lot of cool directives provided by Akka Http and supporting libraries like spray-json. Now lets look ways to customize these.

This gives us power to inject our custom requirement at the same time utilizing the toolkit features.

Lets take the same UserService example from previous part and build on it.
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

    val decodeJWTToEntity: Directive1[User] =
    optionalHeaderValueByName("token").map[User]({
          case Some(bearer) =>
            JWTUtils.decodeJWTToEntity(bearer).getOrElse(User("invalid-token", false))
          case None =>
            User("missing-token", false)
        })

    val authenticate: Directive0 = {
      decodeJWTToEntity.flatMap(user => {
        user.name match {
          case "invalid-token" => reject(MalformedHeaderRejection("token", "invalid jwt token"))
          case "missing-token" => reject(MissingHeaderRejection("token"))
          case _ => pass
        }
      })
    }


    val authorize:Directive0 = {
      decodeJWTToEntity.flatMap(user => {
        if(user.admin) pass
        else extractMethod.flatMap({
          case HttpMethods.POST => reject(AuthorizationFailedRejection)
          case _ => pass
        })
      })
    }

    val putOrPost = put | post

    val route =
    authenticate {
        path("user") {
          putOrPost {
            authorize{
              entity(as[User]) { user =>
                complete {
                  if (userBuffer.exists(_.id == user.id))
                    require(false, s"${user.id} already exists")
                  userBuffer += user
                  user
                }
              }
            }
          } ~
          get {
            complete {
              UserList(userBuffer.toArray)
            }
          }
        }
      }
}
}
```
Lets break down the code..

1. Here we are building 3 custom directives, `decodeJWTToEntity`, `authenticate` and `authorize` and utilizing them as part of our route definition.
2. In `decodeJWTToEntity` we are using another inbuilt directive `optionalHeaderValueByName` that extracts a value(in this case _user_ object) from headers passed in, matching it with the name passed in this case `token`.
3. Then mapping over it and saying we will return a type os `User` type of valid or invalid.
4. Notice how we can chain directives, to make what we want.
5. In `authenticate` we are again utilizing above defined `decodeJWTToEntity` directive to decide if we need to throw any error or continue(case _ => pass)
6. In `authorize` utilizing the same `decodeJWTToEntity` directive we decide whether to continue processing based on authorization status of the user.(Note: You can utilize any out of the box JWTUtils libraries)
7. We build a small utility/custom directive that lets are request flow through if it is put or post
8. In `route` we tie all these together. The method should be pretty self explanatory, that utilizing all the above custom directives we are `authenticate`, `authorizing` and `filtering(putOrPost)` the incoming Http request.
9. You should embrace the power of high-level akka http libraries.

### Testing Akka Http

1. Testing in Akka Http is made easy by providing some really neat testing libraries.
2. These libraries includes almost all the unit testing patterns making our tests look tight and to the point.
3. If necessary you can also utilize other popular libraries like `Mockito`, [scalatest](http://www.scalatest.org/) etc.

Lets write simple tests for `UserService` example we discussed above and [part 2]({{ site.baseurl }}{% post_url 2018-04-22-building-rest-apis-with-akka-http-part-2 %})

```scala

object UserService extends BaseSpec {

  Get("/api1?firstName=John&lastName=Doe") ~> route ~> check {
      responseAs[String] shouldEqual "The firstName is 'John' and the lastName is 'Doe'"
    }

    Get("/api1?firstName=John") ~> route ~> check {
      rejection shouldEqual MissingQueryParamRejection("lastName")
    }

    Get("/api2?firstName=John&lastName=Doe") ~> route ~> check {
      responseAs[String] shouldEqual "The firstName is 'John' and the lastName is 'Doe'"
    }

    Get("/api2?firstName=John") ~> route ~> check {
      responseAs[String] shouldEqual "The firstName is 'John' and the lastName is 'no-lastName'"
    }


    Get("/api3?firstName=John&action=true") ~> route ~> check {
      responseAs[String] shouldEqual "The firstName is 'John'."
    }

    Get("/api4?firstName=John&count=42") ~> route ~> check {
      responseAs[String] shouldEqual "The firstName is 'John' and you have 42 of it."
    }

    Get("/api4?firstName=John&count=blub") ~> route ~> check {
      rejection.isInstanceOf[MalformedQueryParamRejection] shouldEqual true
      val malformedQueryParamRejection = rejection.asInstanceOf[MalformedQueryParamRejection]
      malformedQueryParamRejection.parameterName shouldEqual "count"
      malformedQueryParamRejection.errorMsg shouldEqual "'blub' is not a valid 32-bit signed integer value"
    }

    Get("/api5?firstName=John") ~> route ~> check {
      responseAs[String] === "The firstName is 'John' and there are no cities."
    }

    Get("/api5?firstName=John&city=Chicago&city=Boston") ~> route ~> check {
      responseAs[String] === "The firstName is 'John' and the cities are Chicago, Boston."
    }

    Get("/api6?firstName=John&lastName=Doe") ~> route ~> check {
      responseAs[String] shouldEqual "The firstName information abstracted into firstName info case class is ColorInfo(John,Some(Doe))"
    }

// Tests for above custom directives
  HttpRequest(
        HttpMethods.POST,
        "/user",
        immutable.Seq(RawHeader("token", JWTUtils.adminToken)),
        HttpEntity(MediaTypes.`application/json`, ByteString("""{"id":"1", "name":"John", "age":30}"""))) ~> route ~> check {
        status shouldEqual StatusCodes.OK
      }

      HttpRequest(
        HttpMethods.POST,
        "/user",
        immutable.Seq(RawHeader("token",JWTUtils.myToken)),
        HttpEntity(MediaTypes.`application/json`, ByteString("""{"id":"1", "name":"John", "age":30}"""))) ~> route ~> check {
        rejection shouldEqual AuthorizationFailedRejection
      }

      HttpRequest(
        HttpMethods.POST,
        "/user",
        immutable.Seq(RawHeader("token","some_senseless_token")),
        HttpEntity(MediaTypes.`application/json`, ByteString("""{"id":"1", "name":"John", "age":30}"""))) ~> route ~> check {
        rejection shouldEqual MalformedHeaderRejection("token", "invalid jwt token")
      }

      HttpRequest(
        HttpMethods.GET,
        "/user") ~> route ~> check {
        rejection shouldEqual MissingHeaderRejection("token")
      }

      HttpRequest(
        HttpMethods.GET,
        "/user",
        immutable.Seq(RawHeader("token","eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiU2hhc2hhbmsiLCJhZG1pbiI6ZmFsc2V9.smlXLOZFZ14fozEwULbiSvzDEStlVjnLWSmg6MiaDDXUirCJjPpkNrzpKI31MxID0ZUV-H3tEcPmB9jJjGl9qA"))) ~> route ~> check {
        status shouldEqual StatusCodes.OK
        entityAs[String].parseJson.compactPrint shouldEqual """{"users":[{"id":"1","name":"John","age":30}]}""".parseJson.compactPrint
      }

      system.terminate()
    }

```

Cheers and Happy Coding 🤘
