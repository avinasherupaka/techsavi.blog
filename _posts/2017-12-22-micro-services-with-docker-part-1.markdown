---
layout: post
title: "Docking micro Services (Part-1)"
img: Docker+MS6.png
tags: [Micro Services, Docker, http4s, Scala, REST, Quill, Cassandra]
author: Avinash Reddy Erupaka
---
In this series I will cover on how to use docker/docker-compose to manage micro-services and their dependencies. This will enable you to create a reproducible environment that can be used for spawning any number of services really easily.

## Lets start with a breif history on Microservice Architectures:

> Microservices - also known as the microservice architecture - is an architectural style that structures set of applications as a collection of loosely coupled services, which implement business capabilities.

## What are some the characteristics of a Micro service architecture ?

1. Set of collaborating (micro)services, each of which implements a limited set of related functionality
2. Microservices communicate with each other asynchronously over the network using language agnostic APIs (e.g. REST)
3. Microservices are developed, deployed and maintained independently of each other
4. Microservices use their own persistent storage area (DB/ReplicaSets/Shards) with data consistency maintained using data replication
5. Microservices architecture enables the continuous delivery/deployment of large, complex applications.
6. Microservices encourages application/usage of wide variety technology stack to to provide tailored solution to a business problem.(Gateways, Cloud Computing, Distributed computing etc)

## Where does Docker fit in here ?

> Docker is an open source tool designed to ease creation, deployment, and running of applications by using  virtualization/containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package. This makes applications 'Portable and Scalable'.

Contrary to monolithic applications, micro-services have variable number of individual services which all need to communicate with each other, either directly or via an event stream. Building, maintaining and scaling this architecture is not trivial. That is where docker comes into rescue.

![Docker]({{site.baseurl}}/assets/img/docker-ms-bg.png)


### In the [next]({{ site.baseurl }}{% post_url 2018-01-05-micro-services-with-docker-part-2 %}) tutorial lets dive into action by building micro services.
