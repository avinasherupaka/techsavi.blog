---
layout: post
title: "Digital Manufacturing Cloud - Part 3"
subtitle: "A multi tenant cloud blueprint Industry 4.0(aka Smart Factory)"
img: cloud-industry-4-0.jpeg
tags: [Cloud, Industry-4.0, Smart Factory, IIoT, Multi Tenant, Multi Region]
author: Avinash Reddy Erupaka
---

In [part-1]({{ site.baseurl }}{% post_url 2021-06-12-Cloud-For-Industry-4-0 %}), [part-2]({{ site.baseurl }}{% post_url 2021-06-21-Cloud-For-Industry-4-0-2 %}) We talked about the fundamentals of manufacturing digital transformation, smart factories, Industry 4.0, and how the cloud is facilitating that journey and detailed architecture implementation and deployment schemes. In this part we will look at some more internals and the future of the ecosystem.

## Authentication and Authorization:
![authnz]({{site.baseurl}}/assets/img/dmc/authnz.png)

The above architecture represents the role-based access control (RBAC) model, which uses Cloud AD/LDAP, MFA, and AWS-IAM-based roles and policies to provide granular, secure access points.

__Site Specific Admin role(`SiteA_Admin`)__: This role has `ONLY` control over the infrastructure context specific to the site/container. They will be able to de/provision any site-specific infrastructure components that are not centrally provisioned in order to facilitate rapid prototyping and experimentation. This role should be limited in scope.

__Site Specific Non-Admin role(`SiteA_Non_Admin`)__: This role has `ONLY` access controls to elements within a site/container infrastructure context. There could be different fine-grained implementations of this role, such as a data role (`SiteA_BI` vs `SiteA_Data_Scientist`) that allows them to fiddle with specific components. For example, a `SiteA_BI` might be able to provision dashboards in AWS Quicksight, whereas a `SiteA_Data_Scientist` might be able to build and apply machine learning models in AWS Sage Maker. This approach based on the principle of least privilege provides greater security while maintaining concern segregation and autonomy.

__DevSecOpsRole__: This is a global role responsible for provisioning and maintenance of overall infrastructure of the the platform and site specific containers. 


## Putting it all together 

__What…__ It is a cloud data platform built on AWS for democratizing CH PS Shop-floor and enterprise data

__Why…__ Enabling rapid experimentation, prototyping and value recognition via use cases, without worrying about crosscutting infrastructure concerns by re-inventing the wheel. 

__Who…__ It is enabling data scientists/analysts by providing isolated, secured, self service data objects for building data analytics, data science workloads and operators, other functional colleagues with purpose driven dashboards under one umbrella.  reusable, secured, scalable and compliant cloud platform for site to ingest shopfloor data, store, aggregate and build data driven use cases.​

__When…__ Sites can be onboard anytime with very low lead time, maximum value realization is possible when shopfloor data is ready to be streamed via integration components.

## Future of DMC for I4.0 or I5.0

Integrating Digital Manufacturing Cloud with other ecosystem components such as suppliers, CMOs, Machine vendors, transportation providers, and warehouses helps us achieve the holy grail of `I4.0` and sets us up for `I5.0.`

![future]({{site.baseurl}}/assets/img/dmc/future.png)


Cheers and Happy Coding 🤘