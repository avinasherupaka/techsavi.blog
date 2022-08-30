---
layout: post
title: "Digital Manufacturing Cloud - Part 2"
subtitle: "A multi tenant cloud blueprint Industry 4.0(aka Smart Factory)"
img: cloud-industry-4-0.jpeg
tags: [Cloud, Industry-4.0, Smart Factory, IIoT, Multi Tenant, Multi Region]
author: Avinash R. E
---

In [part-1]({{ site.baseurl }}{% post_url 2021-06-12-Cloud-For-Industry-4-0 %}) We talked about the fundamentals of manufacturing digital transformation, smart factories, Industry 4.0, and how the cloud is facilitating that journey. In this part we shall look at detailed architecture implementation and deployment schemes.

## 1X Zoom
![detailed]({{site.baseurl}}/assets/img/dmc/DMC-BP.png)

1. __Digital Manufacturing cloud platform__ will house isolated compartments of smart factory tenants powered by applications, data, integration pipelines, and AI/ML capabilities while adhering to data residency, regulation, and governance laws through the use of AWS managed services such as IAM, Config, Cloud Train, AWS Regions, and other #2 foundational services.
2. AWS managed services that meet the requirements for governance, GxP, and cloud native best practices.
3. AWS Region is intended to be isolated from other AWS Regions by adhering to residency laws that apply to a variety of data elements. This design achieves isolation, fault tolerance, and stability, making it compliant with local data privacy laws.
4. __AWS VPC__ allows you to create a logically isolated network construct within AWS Cloud from which you can launch AWS resources in a virtual network of your choosing. You (Consumers) have complete control over your virtual networking environment, including the ability to choose your own IP address range, create subnets, and configure route tables and network gateways. In your VPC, you can use both IPv4 and IPv6 for secure and convenient access to resources and applications.We will also leverage __VPC endpoints__ enabling data transfer between your VPC and AWS services. The benefit here is that the traffic between your VPC and other AWS service never leaves the Amazon network(not Internet). This adds a further layer of isolation and security.
5. __AWS IoT__ service enables connected devices to interact with cloud applications and other devices in a simple and secure manner. It has many features such as security management, data routing, rules execution, device shadows, and acts as a control plane. (This service can be accessed based on the use-case.)
6. __AWS Kinesis__ stream management module, makes it simple to collect, process, and analyze real-time, streaming data, allowing you to gain timely insights and respond quickly to new information. Firehose makes it simple to route data to other services such as Kinesis Analytics (for stream analytics) and S3(which is our data lake).
7. AWS S3 is a Data Lake Storage service that holds various data containers for raw, conformed, and curated data.
8. AWS Data Lake ETL is the process of extracting, loading, and transforming data in order to create data catalogs/frames for analysis. If necessary, this layer also includes some BI capabilities. If you need to run cross-site analytics, Amazon Redshift is used in a more futuristic sense.
9. This is our predictive workloads plane, where sites or analysts can run ML usecases using AWS Sagemaker or any other advanced data science platform as they see fit. This will be linked to various downstream and upstream planes, for example if to AWS greengrass our edge compute unit for any intelligent decision making.
10. This is the integration plane, which serves as access gateway for any incoming or outgoing data integrations. For Rest-based access, we will use API Gateway, and for event-based integration, we will use Kafka or other AWS-native message broker services. This layer exposed cataloged data objects from our datalake ETL, as shown in 11 and 12, and it serves as an integration layer for internal and external business applications.
13. This is the SF command center in a nutshell, it is a pre-configured suite of cloud-based Internet of Things (IoT) applications built on AWS designed to accelerate smart factory transformations across the enterprise, and it is customizable to meet your specific requirements.
14. Showcases an integration between our cloud data science models pushing intelligent outcomes to edge component(AWS Green Grass).
15. This plane consolidated the shopfloors/manufacturing network and its systems. 
  - Here we will be using AWS Green Grass with Streams manager capability to stream tags data from kepServer(niche protocols) to AWS IoT plane via MQTT or OPC-UA.
  - We leverage gateway/integration component like ignition(IIoT hub), kafka for extracting tags via standard OPC-UA/MQTT, batch information from siloed databases(ex: MES, CMMS) and stream to cloud.

The deployment shown above is for a single manufacturing site; however, the reality for major corporations with manufacturing operations is that they have sites spread across the globe with varying compliance and regulation requirements. For example, in the pharmaceutical industry, a manufacturing site's processes must comply with the US FDA's 21 CFR Part 11 regulation, while a site in the EU must comply with Annex 11 requirements, as some data objects are subject to GDPR.

This necessitates a multi-tenant, multi-region deployment model that provides sites with the isolation and autonomy they need to execute and achieve their digital transformation goals.

## Multi Tenant, Multi Region deployment

![multi-detail]({{site.baseurl}}/assets/img/dmc/dmc-multi-tenant.png)

If you haven't noticed, there is a lot of similarity/redundancy in the above architecture. `Container/tenant 4` appears to be the same for all manufacturing sites A, B, C, and D scattered across different geographies. That is precisely the point! 

## Platform highlights:
1. Isolation for site specific work loads
2. Site data scientists/analysts have autonomy to run site-specific use-cases.
3. It employs the build once, reuse many times methodology (achieved through IaC (Infrastructure as code)).
4. Globally consistent architecture that allows for scaling
5. Operational holy grail
6. Data Residency by design
7. Security by design
8. Compliance-as-Code and by design.(Using AWS config etc.)
9. Standardization of technology stack.
10. Alleviation of cross cutting infrastructure concerns for sites.
11. Greater reusability and availability.
12. Agility for use-case roll out and benefit realization.

## Guiding Principles
1. Avoid Point to Point connections
2. Target Holy grails of Manufacturing by leveraging AI/ML
3. Closed loop integration between cloud and manufacturing network.
4. Report by exception
5. Lightweight (protocols and systems)
6. Edge Driven
7. Open Architectures
8. Operational simplicity (Unless there are data segregation rules )
9. Low TCO and high ROI

## Infrastructure  Principles
1. Security by design, indepth
2. IaC(Infrastructure as code) for immutability
3. "Golden" templates and images
4. Approve and version control all aspects of SDLC and it's components
5. GAMP 5 framework based automated deployment
6. CMDB(Component Management Database) process for every change and deployment(Requirement logging and traceability)
7. Continuous validation, backups and recovery
8. Infrastructure audits, logs and reports
9. System assurance strategy
10. Config Driven dynamic deployment.

Cheers and Happy Coding 🤘