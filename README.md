 
<p align="center"> 
<img src="//mars3d.cn/logo.png" width="300px" /> 
</p> 

<p align="center">Planet Earth 🌎 is based on traditional JS technology stack Functional example</p> 

<p align="center"> 
  <a target="_black" href="https://www.npmjs.com/package/mars3d"> 
    <img alt="Npm version" src=" https://img.shields.io/npm/v/mars3d.svg?style=flat&logo=npm&label=version number" /> 
  </a> 
  <a target="_black" href="https://www.npmjs .com/package/mars3d"> 
    <img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars3d?style=flat&logo=npm&label=Downloads" /> 
  </a> 
  <a target="_black" href="https://github.com/marsgis/mars3d"> 
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/ mars3d?style=flat&logo=github" /> 
  </a> 
  <a target="_black" href="https://gitee.com/marsgis/mars3d"> 
    <img src="https://gitee.com/ marsgis/mars3d/badge/star.svg?theme=dark" alt="star" /> 
  </a> 
</p> 


Functional sample project is based on [Mars3D platform](http://mars3d.cn) A system that displays a single page for each individual function and supports the modification and editing of code for real-time operation. 
It is mainly used for developers to learn and understand the use of each function of Mars3D, and for business personnel to understand and experience the function points of Mars3D. 

First of all, it is recommended that you study and browse the source code of our functional examples (there will be a lot of comments in the source code). When reading the source code, you can combine it with the API documentation to understand the functions and parameter descriptions of classes and methods. 


## Project Introduction 
 
 This is a function sample demonstration project developed based on `native JS`. 



## Project features 
- **Independent page**: Each page is a separate example with few dependencies and runs independently. 
- **Suitable for different technology stacks**: Native JS development, suitable for users of different technology stacks to understand 


## 
It is recommended to watch the video explanation first and then practice it. You can [view the high-definition video on the new page](https://www .bilibili.com/video/BV1Hg411o7Js/) 



## Download and run the project 
 
### Download code- 
[Github](https://github.com/antus/planet-earth) 

``` 
git clone git@github.com:antus/planet-earth.git 
``` 

- If there is no git software locally, you can enter [https://github.com/antus/planet-earth] in the browser ](https://github.com/antus/planet-earth) address and download the zip package as shown below. 

 ![image](http://mars3d.cn/dev/img/guide/start-example-down.jpg) 

  
### 
Before running the operating environment, it is recommended to start from [http://mars3d.cn/download.html]( http://mars3d.cn/download.html) Download the latest mars3d class library and cover it to the `lib/` directory, and update mars3d to the latest version. 

### Running method 1: Use vscode and its plug-ins to 
 
directly run and browse `index under any development editor (such as vscode, etc.) or http server (such as node, nginx, tomcat, IIS, etc.).html` or corresponding example pages in the example directory. 

It is recommended to use the VScode tool to open the code directory (please refer to the [Development Environment Setup Tutorial] (/guide/start/env.html) to install the VScode and Live Server plug-ins) and run the index.html page. 
 
If you only want to browse a single example, you can also refer to the figure below to access the page of the corresponding example through Live Server 
 ! [image](http://mars3d.cn/dev/img/guide/start-example-run.jpg) 

### Running method 2: use docker compose 
 
It is recommended to use docker script in docker folder

#### Set hest file 
To make Keycloak work, you need to add the following line to your hosts file (/etc/hosts on Mac/Linux, c:\Windows\System32\Drivers\etc\hosts on Windows).
``` 
127.0.0.1	keycloak.gda.it
``` 

#### run docker compose
``` 
cd docker 
docker-compose up -d
```  

#### stop/remove docker containers
``` 
cd docker 
docker-compose down
```  
 
### Running mode 3: Run npm command 

#### Install dependencies before running for the first time
``` 
npm install 

//or use proxy 
npm i --registry=http://registry.taobao.org 
``` 

#### Start the development environment 
``` 
npm run serve 
``` 

#### Compile and build 
``` npm run build //After compilation, 
it 
is generated in the dist directory, copy it and publish it 
npm run serve:dist //Test the dist running status 

// Or publish the dist folder on your own service data``` 
## 

 # Running effect   
 [online experience](http://mars3d.cn/example.html?type=es5) 

 ![image](http://mars3d.cn/dev/img/guide/start-example-es5.jpg ) 
 


## How to report a problem? 
- Discover the problems you find in the project or areas that need optimization; 
- If you have some newly written examples, you hope to open source them and share them with everyone. 

Submission method: 
- Welcome to [Submit PR] on github or gitee (https://www.baidu.com/s?wd= Submit PR on GitHub) 
- If you are not familiar with git, you can also organize the sample code and send it to wh@marsgis.cn We will organize and integrate it. 


## Project structure 


### Main directory description 
``` 
mars3d-es5-example 
│───config list configuration information and screenshots 
│───example sample code, each example page can be run independently [Important] 
│─── css Public CSS style file 
│───img Public image file 
│───js Public JS file 
│───lib Class library that the example depends on 
│ └─include-lib.js lib class library unified configuration file 
│───widgets Basic project module resources to facilitate demonstration of some examples└───index.html 
list page (access entrance) 
`` 

The two main directories related to examples are: `example` and `lib`. 


#### The include-lib.js file describes 

our current native JS version `Function Example` page, third-party libraries and our sdk class libraries are stored in the lib directory, and each directory has a `README.md` file Describe the github address, official website and purpose of the library. 

 ![image](http://mars3d.cn/dev/img/guide/start-includeLib-ml.jpg) 

In order to facilitate switching and introducing third-party lib, we wrote an independent js file [include-lib. js](https://gitee.com/marsgis/mars3d-es5-example/blob/master/lib/include-lib.js) to uniformly call and use the third-party lib, and introduce the lib on the required page as follows: 
```html 
<!--Third-party lib--> 
<script type="text/javascript" src="/lib/include-lib.js" libpath="/lib/" 
    include="font-awesome,mars3d "></script> 
``` 
This method is equivalent to (if you are not used to include-lib.js, you can also change to the direct introduction method demonstrated below): 

```html 
<!--corresponds to font-awesome-- > 
<link rel="stylesheet" href="/lib/fonts/font-awesome/css/font-awesome.min.css"> 

<!--corresponds to turf--> 
<script type="text/javascript" src ="/lib/turf/turf.min.js"></script> 

<!--corresponds to mars3d--> 
<link rel="stylesheet" href="/lib/Cesium/Widgets/widgets.css"> 
< script type="text/javascript" src="/lib/Cesium/Cesium.js"></script> 
<link rel="stylesheet" href="/lib/mars3d/mars3d.css"> 
<script type=" text/javascript" src="/lib/mars3d/mars3d.js"></script> ` 
`` 
 
 
## Add new example 
Copy `example\00_model.html` file and then rename it and modify the code. 



## Read the sample source code and debug and learn. 
 The purpose of the sample is to demonstrate each function point of the platform. You can study each sample according to your needs or interests. 
- (1) You can query the API documents of related classes during learning 
- (2) Try to modify Parameters, methods, etc. in the source code to experience different rendering effects. 


## Frequently asked questions during development 


### 1. Things to note when using LAN offline
 All code levels of the platform support offline operation and use, but you need to pay attention to the related processing of map services when offline. 
 
 If there are relevant terrain and satellite base map services in the local area network, you can replace the default terrain and base map in `config.json` or `code for constructing Map` according to the intranet service type and URL address. 

 If there are no related services in the LAN, you can proceed as follows: 
- Modify the `terrain` configuration in config.json and change the existing `"show": true` configuration to `"show": false` 
- Modify the config. In the `basemaps` array configuration in json, change the existing `"show": true` layer to `"show": false`, and add `"show to the single picture or offline map ": true`, and modify the relevant URL address. 
- You can also refer to the tutorial [Publish 3D Data Service] (/guide/data/server.html) to deploy offline map services, which also contains some sample offline data. 



## What is Mars3D 
> `Mars3D Platform` is a 3D client development platform based on WebGL technology developed by [Mars Technology](http://marsgis.cn/), based on [Cesium](https://cesium .com/cesiumjs/) optimization and B/S architecture design, a lightweight and high-performance GIS development platform that supports multi-industry expansion, can run efficiently in the browser without installation and plug-ins, and can be quickly accessed and used. A variety of GIS data and three-dimensional models present the visualization of three-dimensional space, completing the flexible application of the platform in different industries. 

 > The Mars3D platform can be used to build plug-in-free, cross-operating system, and cross-browser 3D GIS applications. The platform uses WebGL for hardware-accelerated graphics, cross-platform and cross-browser to achieve truly dynamic big data three-dimensional visualization. Mars3D products can quickly realize beautiful and smooth 3D map presentation and spatial analysis on browsers and mobile terminals. 

### Related websites 
- Mars3D official website: [http://mars3d.cn](http://mars3d.cn)   

- Mars3D open source project list: [https://github.com/marsgis/mars3d](https:/ /github.com/marsgis/mars3d) 


## Copyright statement 
1. The Mars3D platform is independently developed by [Mars Technology] (http://marsgis.cn/) and owns all rights. 
2. Any individual or organization can use it for free and without restriction, subject to complying with relevant requirements.