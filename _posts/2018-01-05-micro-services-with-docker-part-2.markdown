---
layout: post
title: "Docking micro Services (Part-2)"
img: Docker+MS5.jpg
tags: [Micro Services, Docker, http4s, Scala, REST, Quill, Cassandra]
author: Avinash RE
---

### Lets build an app that lets you track down users connected to a bluetooth beacon.

### Interfaces

1. `BeaconService` - Responsible for Bluetooth Beacons related info.
2. `TrackingService` -  Responsible for tracking the location of users
3. `AggregationService` - Acts as front controller for the two services, providing a way for clients to retrieve data with out constant polling.

### Building docker Images

Lets create and build the docker images,
we will leverage [sbt-docker](https://github.com/marcuslonnberg/sbt-docker) and [sbt-assembly](https://github.com/sbt/sbt-assembly) plugins.

You can checkout the working version of the project here [find-peers-microservices](https://github.com/avinasherupaka/find-peers-microservices)

Lets look at some configuration in detail.

## lets take the example of beacon-service

### `plugins.sbt`

```scala
resolvers += "Typesafe repository" at "https://repo.typesafe.com/typesafe/releases/"

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.6")

addSbtPlugin("se.marcuslonnberg" % "sbt-docker" % "1.5.0")

```

This above config adds sbt-assembly and sbt-docker plugins to the module.

### `build.sbt`

```scala

mainClass in assembly := Some("com.avinash.blog.Bootstrap")

assemblyMergeStrategy in assembly := {
  case PathList(xs @ _*) if xs.last == "io.netty.versions.properties" => MergeStrategy.rename
  case other => (assemblyMergeStrategy in assembly).value(other)
}

publishArtifact in(Compile, packageDoc) := false

publishTo := Some(Resolver.file("file", new File("artifacts")))

cleanFiles <+= baseDirectory { base => base / "artifacts" }

```

Most of the variables here are self explanatory like `name`, `version`  and `libraryDependencies` it adds appropriate plugins. The `assemblyMergeStrategy` resolves duplicates for Sbt Assembly and creates a fat jar of your project/module with all of its dependencies. Then we publish to artifacts directory

### sbt-docker configuration

```scala
enablePlugins(sbtdocker.DockerPlugin)

dockerfile in docker := {
val baseDir = baseDirectory.value
val artifact: File = assembly.value

val imageAppBaseDir = "/app"
val artifactTargetPath = s"$imageAppBaseDir/${artifact.name}"
val artifactTargetPath_ln = s"$imageAppBaseDir/${name.value}.jar"

val dockerResourcesDir = baseDir / "docker-resources"
val dockerResourcesTargetPath = s"$imageAppBaseDir/"

val appConfTarget = s"$imageAppBaseDir/conf/application"
val logConfTarget = s"$imageAppBaseDir/conf/logging"

```

Above we enable the plugin and define the source and target paths of files to be added to our image. Add resources which includes the entrypoint script. . We also define `boot-configuration - app.conf` bootstrapping the app along with logback.xml load for logging.

```scala

new Dockerfile {
    from("openjdk:8-jre")
    maintainer("avinasherupaka")
    expose(80, 8080)
    env("APP_BASE", s"$imageAppBaseDir")
    env("APP_CONF", s"$appConfTarget")
    env("LOG_CONF", s"$logConfTarget")
    copy(artifact, artifactTargetPath)
    copy(dockerResourcesDir, dockerResourcesTargetPath)
    copy(baseDir / "src" / "main" / "resources" / "logback.xml", logConfTarget) //Copy the default logback.xml
    //Symlink the service jar to a non version specific name
    run("ln", "-sf", s"$artifactTargetPath", s"$artifactTargetPath_ln")
    entryPoint(s"${dockerResourcesTargetPath}docker-entrypoint.sh")
  }
}
buildOptions in docker := BuildOptions(cache = false)

```
This is a lot, lets break it down..

1. Every Docker container inherits from a base container that has a Linux distro, and for Scala apps, some flavor of the JVM. We are using from [("openjdk:8-jre")](https://hub.docker.com/_/openjdk/) here.
2. Ports to be exposed for our service.
3. Environment variables are defined for configuration paths, we can then access these at runtime and in the entrypoint scripts.
4. We copy the resources, configs and the jar to our image. The sbt docker task depends upon the assembly task, so this jar has been automatically created for us by this point.
5. `RUN` executes shell commands while building the container. It is typically used to install packages. The sbt-docker syntax offers at least two variants: runRaw which you saw above to execute any text as a shell command (including env var substitution), and run() which allows you to input each arg separately. Here we define a [symlink](https://kb.iu.edu/d/abbe) to our versioned jar.
6. We define an entrypoint which describes the script or command to start  app.

### Customizing your image tag
```scala

imageNames in docker := Seq(
  ImageName(
    repository = name.value,
    tag = Some(sys.props.getOrElse("IMAGE_TAG", default = version.value))
  )
)
```

By default sbt-docker will tag the image with the version defined in our build.sbt. Sometimes though, this isn’t what we want - In case of custom deployment we parse the IMAGE_TAG env var which allows us to override the tag at build time. You would use this as follows: sbt clean -DIMAGE_TAG=someTag docker

### docker-resources

Images will need some additional external resources and we get them as follows.

[scripts/wait-for-it.sh](https://github.com/vishnubob/wait-for-it) - Gives us a reliable way to wait for resources to become available on specific ports.
Services often need to be spun up in a specific order for discovery purposes, and backend resources. We use `wait-for-it.sh` to control the startup order of our services. In our case specifically we’re waiting for Cassandra to become available. While Docker compose allows us to control the startup order of containers, it doesn’t wait until the application within the container has completely started.

> A reliable service should be able to automatically retry and restart should a connection be unavailable, rather than simply dying. This is essential for a resilient microservice (which these are not!).

### docker-entrypoint.sh

This is Docker Entrypoint as stated above in sbt-docker `run` description. It handles the startup procedure i.e, invoking the docker-entrypoint.sh script.

```bash

#!/bin/bash

set -e
set -x

/app/scripts/wait-for-it.sh -t 0 cassandra-node1:9042 -- echo "CASSANDRA Node1 started"
/app/scripts/wait-for-it.sh -t 0 cassandra-node2:9042 -- echo "CASSANDRA Node2 started"
/app/scripts/wait-for-it.sh -t 0 cassandra-node3:9042 -- echo "CASSANDRA Node3 started"

APP_OPTS="-d64 \
          -server \
          -XX:MaxGCPauseMillis=500 \
          -XX:+UseStringDeduplication \
          -Xmx1024m \
          -XX:+UseG1GC \
          -XX:ConcGCThreads=4 -XX:ParallelGCThreads=4 \
          -Dcom.sun.management.jmxremote.port=9999 -Dcom.sun.management.jmxremote.ssl=false \
          -Dcom.sun.management.jmxremote.authenticate=false \
          -Dcom.sun.management.jmxremote.local.only=false \
          -Dcom.sun.management.jmxremote.rmi.port=9999 \
          -Dcom.sun.management.jmxremote=true \
          -Dlogger.url=file:///${LOG_CONF}/logback.xml
         "

java ${APP_OPTS} -cp ${APP_BASE}/conf -jar ${APP_BASE}/beacon-service.jar

```
As you can see the start up waits on all Cassandra nodes. Such tight coupling of service startups is not good practice, it’s much better to wait for one node to become available and handle any retries or restarts properly within your resilient service.

Set our jvm arguments and start the service, notice that we make use of the LOG_CONF and APP_BASE environment variables which we defined in our build.sbt image..

### Where is Cassandra defined?

We are using [official Cassandra image from dockerhub](https://hub.docker.com/_/cassandra/) for Cassandra cluster. However we need to configure our app to connect to it, we do this in the application.conf of each service. This is not a production ready configuration

```conf
cassandra {
   keyspace = "beacon_service"
   preparedStatementCacheSize = 1000
   session.contactPoint = cassandra
   session.credentials.0 = cassandra //Username
   session.credentials.1 = cassandra //Password
   session.queryOptions.consistencyLevel = LOCAL_QUORUM
   session.withoutMetrics = true
   session.withoutJMXReporting = false
   session.maxSchemaAgreementWaitSeconds = 1
   //session.addressTranslater = com.datastax.driver.core.policies.IdentityTranslater
}
```
### Runtime Configuration

First we define the `APP_CONF` environment variable in the build.sbt. We then read this at runtime when bootstrapping the application in `Bootstrap.scala`

```scala

package com.avinash.blog

object Bootstrap extends ServerApp with Cassandra {
  implicit val executionContext = ExecutionContext.global

  lazy val config = ConfigFactory
    .parseFile(new File(s"${sys.env.getOrElse("APP_CONF", ".")}/boot-configuration.conf"))
    .withFallback(ConfigFactory.load())

  override def server(args: List[String]) = BlazeBuilder.bindHttp(80, "0.0.0.0")
    .mountService(BeaconService.routes(new BeaconRepo[CassandraAsyncContext[SnakeCase]]()), "/")
    .start
}

```
ConfigFactory looks for an optional `boot-configuration.conf` first, then falls back to `application.conf` for any values not found. The idea is we can easily define an env specific config at runtime using volume mounts at $APP_CONF.

### Repository

```scala

object BeaconRepo {

  case class BeaconsByLocation(locationId: UUID, beaconId: UUID, beaconName: String)

}

class BeaconRepo[Repo <: CassandraAsyncContext[SnakeCase]]()(implicit dbContext: Repo, ec: ExecutionContext) {

  import dbContext._

  private implicit val decodeUUID = mappedEncoding[String, UUID](UUID.fromString)
  private implicit val encodeUUID = mappedEncoding[UUID, String](_.toString)

  def findBeaconByLocation(locationId: UUID): Future[List[BeaconsByLocation]] = {
    dbContext.run(
      quote {
        query[BeaconsByLocation].filter(_.locationId == lift(locationId))
      })
  }
}

```

### Controller/ service - handles REST calls

```scala
object BeaconService extends LazyLogging {


  val client = PooledHttp1Client()

  implicit def circeJsonDecoder[A](implicit decoder: Decoder[A]) = org.http4s.circe.jsonOf[A]

  implicit def circeJsonEncoder[A](implicit encoder: Encoder[A]) = org.http4s.circe.jsonEncoderOf[A]

  def routes(beaconRepo: BeaconRepo[CassandraAsyncContext[SnakeCase]])(implicit ec: ExecutionContext) = HttpService {

    case request@GET -> Root / "beacons" / "locations" / locationId =>
      logger.debug(s"****Querying for locationId:$locationId")
      Ok(beaconRepo.findBeaconByLocation(UUID.fromString(locationId)))
  }
}
```
Configuration across all services is same. Most of the code can be refactored into reusable code, but for practice purposes it works well.

### In the [part 3]({{ site.baseurl }}{% post_url 2018-01-10-micro-services-with-docker-part-3 %}) of this series lets looks at docker configuration for microservices, cassandra, nginx, images, spinning up our architecture etc.

I want to give a shout out to [Mark Harrison](https://github.com/markglh) for motivating me to implement this and write a blog with my learnings, findings and additions...

Cheers and Happy Coding 🤘
