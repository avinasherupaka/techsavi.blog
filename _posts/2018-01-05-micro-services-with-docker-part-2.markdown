---
layout: post
title: "Docking micro Services (Part-2)"
img: Docker+MS5.jpg
tags: [Micro Services, Docker, http4s, Scala, REST, Quill, Cassandra]
author: Avinash Reddy Erupaka
---

### Lets build an app that lets you track down users connected to a bluetooth beacon.

### Interfaces

1. `BeaconService` - Responsible for Bluetooth Beacons related info.
2. `TrackingService` -  Responsible for tracking the location of users
3. `AggregationService` - Acts as front controller for the two services, providing a way for clients to retrieve data with out constant polling.

### Lets build some images

lets create and build the docker images, we'll leverage [sbt-docker](https://github.com/marcuslonnberg/sbt-docker).

# Under Construction
