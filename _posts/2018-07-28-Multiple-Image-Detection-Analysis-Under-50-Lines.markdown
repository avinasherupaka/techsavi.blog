---
layout: post
title: "Object Detection - Image Analysis"
img: Image-Detection-Cover.jpg
tags: [Computer Vision, Image Recognition, Object Detection, Image Analysis, Python, tensorflow, numpy, SciPy, OpenCV, ImageAI, AI, Machine Learning, Deep learning.]
author: Avinash Reddy Erupaka
---

Everything around us today is getting Artificially Intelligent. Whether it is a social media website that can detect your friends from a picture or a self driving car. Such great inventions are happening because of advancements in AI and its eco-system. Computer vision is one such important fields in Artificial Intelligence.

>Computer vision is an interdisciplinary field that deals with how computers can be made for gaining high-level understanding from digital images or videos. -Wikipedia

Object detection is one of the most profound aspect of computer vision due the number practical use cases. For example Face detection, People Counting, Vehicle detection, Aerial image analysis, security, etc. With recent advancements in deep learning based computer vision models , object detection applications are easier to develop than ever before. In this tutorial, I will briefly introduce the concept of object detection and a live abstract demonstration of its application.

> Object detection is a computer technology related to computer vision and image processing that deals with detecting instances of semantic objects of a certain class (such as humans, buildings, or cars) in digital images and videos. -Wikipedia

From a developer standpoint building modern object detection application and models is not a straight forward task. However companies like Google, Facebook, NVIDIA, Honeywell etc ([more companies](http://www.lengrand.fr/computer-vision-companies/)) are doing extensive research and open sourcing their findings in the form of datasets and algorithms. Of course there is also a great pool open-source community contributions like, [OpenCV](https://github.com/opencv/opencv) on of the popular computer vision library. Other most popular object detection algorithms/methods are R-CNN, Fast-RCNN, Faster-RCNN, RetinaNet, SSD and YOLO. However, these classical algorithms could not achieve enough performance in all cases, for variety of reasons:

1. Varying conditions
2. Variable number of objects
3. Sizing
4. Modeling

Alright enough of theory, lets build an image predictions application !

# Setup:

### Download and Install python: [python](https://www.python.org/downloads/)
### Download and Install python: [pip](https://pip.pypa.io/en/stable/installing/)
### Tensorflow 1.4.0 (and later versions) Install or install via pip
```bash
pip3 install --upgrade tensorflow
```
### Numpy 1.13.1 (and later versions) Install or install via pip
 ```bash
 pip3 install numpy
 ```
### SciPy 0.19.1 (and later versions) Install or install via pip
 ```bash
 pip3 install scipy
 ```
### OpenCV Install or install via pip
```bash
pip3 install opencv-python
```
### Pillow Install or install via pip
 ```bash
 pip3 install pillow
 ```
### Matplotlib Install or install via pip
 ```bash
 pip3 install matplotlib
 ```
### h5py Install or install via pip
 ```bash
 pip3 install h5py
 ```
### Keras 2.x Install or install via pip
 ```bash
 pip3 install keras
 ```
### ImageAI
```bash
pip3 install https://github.com/OlafenwaMoses/ImageAI/releases/download/2.0.2/imageai-2.0.2-py3-none-any.whl
```
### RetinaNet model: Download [RetinaNet](https://github.com/OlafenwaMoses/ImageAI/releases/download/1.0/resnet50_coco_best_v2.0.1.h5) and save it in your Image detection working directory

Now are are set to write our object detection models and draw insights from it.

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jul 28 15:39:18 2018

@author: aerup
"""

from imageai.Prediction import ImagePrediction
import os
import array

current_dir = os.getcwd()
image_predictions = ImagePrediction()
image_predictions.setModelTypeAsResNet()
image_predictions.setModelPath(os.path.join(current_dir, "resnet50_weights_tf_dim_ordering_tf_kernels.h5"))
image_predictions.loadModel()

images_array = []

array_of_files = os.listdir(current_dir)
for each_file in array_of_files:
    if(each_file.endswith("cat.jpeg") or each_file.endswith(".png")):
        images_array.append(each_file)

results_array = image_predictions.predictMultipleImages(images_array, result_count_per_image=10)

list_of_prediction = []

for each_result in results_array:
    predictions, percentage_probabilities = each_result["predictions"], each_result["percentage_probabilities"]
    list_of_prediction.append(predictions)
    for index in range(len(predictions)):
        print(predictions[index] , " : " , percentage_probabilities[index])
    print("-----------------------")
print('set_of_prediction:',set([item for items in list_of_prediction for item in items]))
```

### Test Images:

![animals]({{site.baseurl}}/assets/img/car-leapord.jpg)

### Result:

```python
cheetah  :  94.0053403378
leopard  :  1.18889305741
llama  :  0.692976033315
hyena  :  0.613261619583
jaguar  :  0.468546384946
trailer_truck  :  0.27624249924
Arabian_camel  :  0.211876211688
dalmatian  :  0.164259644225
yurt  :  0.148427509703
tow_truck  :  0.125058658887
-----------------------
```

![vehicles]({{site.baseurl}}/assets/img/car-moter-bike.jpg)
### Result:

```python
motor_scooter  :  41.4442330599
sports_car  :  35.464990139
crash_helmet  :  9.53662842512
racer  :  6.1446454376
go-kart  :  1.31217772141
moped  :  1.12367495894
car_wheel  :  0.590410782024
convertible  :  0.586880231276
backpack  :  0.563116045669
car_mirror  :  0.377902877517
-----------------------
```

### set_of_prediction
```python
set_of_prediction: {'sports_car', 'motor_scooter', 'Arabian_camel', 'hyena', 'llama', 'racer', 'car_wheel', 'leopard', 'moped', 'convertible', 'jaguar', 'dalmatian', 'yurt', 'tow_truck', 'trailer_truck', 'backpack', 'cheetah', 'go-kart', 'car_mirror', 'crash_helmet'}
```

Above is the aggregate set of predictions by which you can develop interested analytical and decision models. Data of this kind has endless application.

We can then further analyze or process these images to pin point distinct attributes. For example:

![child-dog]({{site.baseurl}}/assets/img/child-dog.jpg)

### Result of object Detection:
![child-dog]({{site.baseurl}}/assets/img/child-dog-result.jpg)

## My vision:
One real time application, I can associate with my field of work (ag-tech/ag-science) is, a drone flying over a farm, capturing real-time crop pictures(corn for exmaple), running through a model to detect anomalies and alert the farmer keeping him informed and ahead of the game. In addition to that we will be capturing myriad of data which can then be utilized for R&D purposes.

## Conclusion
The applications of computer vision, object detection , image predictions are numerous. I am anticipating more research and applications in these field, shaping variety of domains like security, agriculture, manufacturing, terrain analysis, rescue drones etc !  

Cheers and Happy Coding 🤘
