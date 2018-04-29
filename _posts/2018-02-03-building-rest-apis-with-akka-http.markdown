---
layout: post
title: "Rest API's with AKKA-HTTP(Part-1)"
img: akka-http.jpg
tags: [Akka, Micro Services, Rest, http, Scala]
author: Avinash Reddy Erupaka
---
## Why do you need another HTTP framework and why should that be Akka-Http?

In todays world it is more than a requirement to build highly concurrent and distributed applications, i.e, we want our applications to be

1. Across threads and cores.
2. Across machines and data centers
3. Across organizations/domains

Thats exactly what akka promises to do.

> Build powerful concurrent and distributed applications more easily - source: http://akka.io

## We want this distribution at macro and micro level

What do I mean by that ?

![macro-micro-level]({{site.baseurl}}/assets/img/macro-micro-level.png)

> The Akka HTTP modules implement a full server- and client-side HTTP stack on top of akka-actor and akka-stream. It's not a web-framework but rather a more general toolkit for providing and consuming HTTP-based services. While interaction with a browser is of course also in scope it is not the primary focus of Akka HTTP.

### What gaps does Akka-http bridge ?

1. Max throughput with acceptable latency
2. Scale to 'unlimited' number of connections, distributing  them across machine cores.
This means library should never limit you from utilizing hardware.
3. Open compassable API(not a framework style)
4. Making HTTP integration layers seamless.

### How does Akka-Http bridge these gaps?

1. Akka- Http is fully async and non blocking.
2. Actor friendly, but centered around non-actor API's
3. Lightweight, modular, testable
4. Can be fully decoupled from underlying TCP interfaces
5. Built from the learnings of [spray.io](http://spray.io/)

### Akka streams

1. Akka implementation of reactive streams
2. DSL for building a complete stream
3. Higher level abstraction over the actor model
4. Stream inputs and outputs are typesafe
5. Internally uses Actor to implement reactive stream properties.

Quick Example of a stream..

![akka-streams]({{site.baseurl}}/assets/img/akka-streams.jpg)
```scala
object SimpleStream {

  def main(args: Array[String]) {

    implicit val sys = ActorSystem("SimpleStream")
    implicit val mat:Materializer = ActorMaterializer()

    val source = Source(List(1, 2, 3))

    val flow = Flow[Int].map(_.toString)

    val sink = Sink.foreach(println)

    val runnableGraph = source via flow to sink // Beauty of scala's syntactic sugar
    runnableGraph.run()
    sys.terminate()
  }

=> 1, 2, 3
```
The main topic is ***Akka-http*** why are we discussing about ***Akka-streams*** ?
Akka-Http is implemented on the idea of Akka-stream.

![Akka-Http]({{site.baseurl}}/assets/img/akka-http-flow.jpg)

lets look at a simple examples..

#### Example 1: Akka Http leveraging Akka-Streams

```scala

object SimpleAkkaHttp {

  def main(args: Array[String]) {

    implicit val sys = ActorSystem("SimpleAkkaHttp")
    implicit val mat:Materializer = ActorMaterializer()

    val businessLogicFlow = Flow.fromFunction[HttpRequest, HttpResponse](request =>
      println(request.toString)
      HttpResponse(StatusCodes.OK, entity="Hello World !")
      )

      Http().bindAndHandle(businessLogicFlow, 'localhost', 8080)
  }

```
#### Example 2: Akka Http leveraging functional Scala and Synchronous Http processing(This way is not encouraged)

```scala

object SynchronousAkkaHttp {

  def main(args: Array[String]) {

    implicit val sys = ActorSystem("SynchronousAkkaHttp")
    implicit val mat:Materializer = ActorMaterializer()

    val handler:(HttpRequest => HttpResponse) = {

      case HttpRequest(HttpMethods.GET, Uri.Path('/hello'),_,_,_) =>
           HttpResponse(status = StatusCodes.OK, entity = 'world')

      case _ => HttpResponse(status = StatusCodes.BadRequest)
    }

      Http().bindAndHandleSync(handler, 'localhost', 8080)
  }

```
Lets break down whats going on..

1. We define our `SimpleAkkaHttp` actor
2. `ActorMaterializer()` initializes ActorMaterializer which provided actor context to Akka http implementation.
3. From `scaladsl` library we import `Flow` and define our implementation.
4. As part of the implementation we are just printing out the request and responding with a status `OK` and a string entity.
5. We also import `Http()` from `scaladsl` which will be serving http requests with our implemented logic, on specific host here`localhost` and specific port, here `8080`.
6. `bindAndHandle` and `bindAndHandleSync` are 2 methods on `Http()`, with a difference of handling asynchronous and synchronous respectively.

Boom ! That all now you have a basic Http rest service.

6. You must be wondering how is this possible, as there is no container defined, right ?
Akka runs this as a simple JVM process taking away all the unnecessary boilerplate logic and lets us focus on Flow(business logic)

### Akka Http Stack

![Akka-Http-Stack]({{site.baseurl}}/assets/img/akka-http-stack.jpg)

### Akka Http Internals
1. akka-http-core - low-level server & client side HTTP implementation
2. akka-http - high-level API : DSL, (un)marshalling, (de)compression
3. akka-http-testkit - Utilities for testing server-side implementation
4. akka-http-spray-json - (de)serialization from/to JSON with spray-json
5. akka-http-xml - (de)serialization from/to XML with scala-xml

### Akka Http interfaces

```scala
case class HttpRequest(method: HttpMethod = HttpMethods.GET,
    uri: Uri = Uri./,
    headers: immutable.Seq[HttpHeader] = Nil,
    entity: RequestEntity = HttpEntity.Empty,
    protocol: HttpProtocol = HttpProtocols.`HTTP/1.1`)

case class HttpResponse(status: StatusCode = StatusCodes.OK,
    headers: immutable.Seq[HttpHeader] = Nil,
    entity: ResponseEntity = HttpEntity.Empty,
    protocol: HttpProtocol = HttpProtocols.`HTTP/1.1`)

case class Uri(scheme: String,
    authority: Authority,
    path: Path,
    rawQueryString: Option[String],
    fragment: Option[String])

object ContentTypes {
    val `application/json` = ContentType(MediaTypes.`application/json`)
    val `application/octet-stream` = ContentType(MediaTypes.`application/octet-stream`)
    val `text/plain(UTF-8)` = MediaTypes.`text/plain` withCharset HttpCharsets.`UTF-8`
    val `text/html(UTF-8)` = MediaTypes.`text/html` withCharset HttpCharsets.`UTF-8`
    val `text/xml(UTF-8)` = MediaTypes.`text/xml` withCharset HttpCharsets.`UTF-8`
    val `text/csv(UTF-8)` = MediaTypes.`text/csv` withCharset HttpCharsets.`UTF-8`
    val NoContentType = ContentType(MediaTypes.NoMediaType)
}

// Encodings
val `US-ASCII` = register("US-ASCII")("iso-ir-6", "ANSI_X3.4-1968", "ANSI_X3.4-1986", "ISO_646.irv:1991", "ASCII", "ISO646-US",
"us", "IBM367", "cp367", "csASCII")
val `ISO-8859-1` = register("ISO-8859-1")("iso-ir-100", "ISO_8859-1", "latin1", "l1", "IBM819", "CP819", "csISOLatin1")
val `UTF-8` = register("UTF-8")("UTF8")
val `UTF-16` = register("UTF-16")("UTF16")
val `UTF-16BE` = register("UTF-16BE")()
val `UTF-16LE` = register("UTF-16LE")()
```
Above are some examples of akka http interfaces, from them lets extract some characteristics akka provides us.

1. The interfaces are case classes, that means they are immutable.
2. Most of the Http methods have abstraction implementation with best practices.
3. Common boilerplate types are out of the box, like `StatusCodes`, `HttpEntity`, `MediaTypes`, `encodings` etc.
4. Appropriate parsing of payload using `akka-http-spray-json`.
5. Enforcing right Http standards for efficient and robust communication.

Let's look at the power of high-level Akka-http.

Above Example-1 and Example-2 are some ways you can define Http endpoints, but if you see the handler methods logic gets redundant and uneasy with params like `Uri` etc. These problems are elegantly handled by high-level Akka-http api's.

### In the [part 2]({{ site.baseurl }}{% post_url 2018-02-07-building-rest-apis-with-akka-http-part-2 %}) of this series we will look at some more advanced Akka Http concepts.

Cheers and Happy Coding 🤘
