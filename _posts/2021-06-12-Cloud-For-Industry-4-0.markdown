---
layout: post
title: "Digital Manufacturing Cloud - Part 1"
subtitle: "A multi tenant cloud blueprint Industry 4.0(aka Smart Factory)"
img: cloud-industry-4-0.jpeg
tags: [Cloud, Industry-4.0, Smart Factory, IIoT, Multi Tenant, Multi Region]
author: Avinash R. E
---

Manufacturing has changed dramatically in the previous ten years because to digital technology. Businesses have been able to attain unprecedented levels of efficiency and output because to the Cloud and the Internet of Things (IoT). However, the revolution is far from over. Implementing a cloud backbone for smart factory operations is critical for companies with complex manufacturing operations and must remain competitive. In this 2 part serise I will cover basics of manufacturing digital transformation and how cloud computing capabilitites enable that journey.

Smart Factory, IIoT, Industry 4.0, are often used interchangeably, althought there is strong relation between the 3 each their nuances. Lets look at some definitions to start with.

> __Smart Factory__ is the future of the manufacturing industry through smart manufacturing, in which data and analytics come together to provide seamless, low-cost, and efficient production execution, operations, and improve bottom line growth.


> __Industrial Internet of Things(IIoT)__ despite the fact that the underlying concept is the same, represents the incorporation of smart __"things"__ into the manufacturing ecosystem, distinguishing them from consumer. Wireless connections link IIoT devices to internal networks as well as the global Internet. These devices usher in a new era of automation by collecting an unprecedented amount of data from all aspects of a process and transmitting it to a central server.

> __Industry 4.0__ includes IIoT, smart manufacturing among other facets, combines physical production and operations with smart digital technology, cloud, computing, machine learning, and big data to create a more holistic and better connected ecosystem for manufacturing and supply chain management companies.

## Facets of Industry 4.0:
1.	Autonomous Machines 
2.	Cloud, Fog and Edge Computing
3.	Smart Things (IoT)
4.	Cybersecurity
5.	Data, AI/Machine learning
6.	Seamless Integration
7.	Robotics
8.	Digital Simulation (Digital Twin)
9.	Additive Manufacturing
10.	AR/VR
11. Cyber-physical systems

## Cloud 4 Industry 4.0
The impending need for IT and OT system convergence to enable Industry 4.0 activities has increased data availability at an unprecedented rate. I don't need to explain the value of data, but data democratization and value realization require strong computing capabilities at the cloud and edge. Cloud computing has become an important aspect of I-4.0 due to its capabilities and architectural possibilities.

![runtime]({{site.baseurl}}/assets/img/dmc/cloudpros.png)

## Vision for Digital Manufacturing Cloud

1. Democratization of data
2. Transform data into knowledge to gain actionable insights. (AI/ML)
3. Data integrated and reasoned between vendors, suppliers, partners, supply chain, sales and post sales to get that grand view of your business.
4. Closed Loop Manufacturing, enabling data driven decision making.
5. With a blend of digital transformation turn paper based workflows into digital fuel.
6. Have a realtime view of data rather than historic view and build predictive modeling.
7. Proactive playbook for supply chain disruptions
8. Liberate siloed knowledge and turn into digital assets.

## Cloud-to-Thing Continuum 

![runtime]({{site.baseurl}}/assets/img/dmc/layers.png)

1. First, the OT layer we have systems like HMI(Human Machine Interface) and SCADA, manufacturing execution systems (MES), programmable logic controllers (PLC), sensors and actuators, MEMS and transducers (sensors again), Firewalls, gateways and data brokers.
2. Second, still behind the manufacturing network, we have the edge computing infrastructure to push data analysis, AI/ML, storage and compute power at the edge of networks. This is necessary for time critical closed loop execution.
3. Third, the cloud provides higher-order data storage, ETL/ELT, data analytics, AI/ML, visualization, and control center application action on the collected data.

## Cloud Capabilities Blueprint

![runtime]({{site.baseurl}}/assets/img/dmc/cloud-layer.png)

This outlines the various compartmental capabilities that the cloud provides to support smart factory operations.
Now we will zoom into the individual compartment implementation on AWS(Amazon Web Services).

### In the [next]({{ site.baseurl }}{% post_url 2021-06-21-Cloud-For-Industry-4-0-2 %}) part lets dive into the details of above blueprint implementation.


Cheers and Happy Coding 🤘
