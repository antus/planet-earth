// import * as mars3d from "mars3d"

var map

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: {
      lat: 28.440864,
      lng: 119.486477,
      alt: 588.23,
      heading: 268.6,
      pitch: -37.8,
      roll: 359.8
    },
    fxaa: true,
    requestRenderMode: true // explicit rendering
  },
  control: {
    infoBox: false
  },
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  // Fixed lighting time
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2022-11-01 12:00:00"))
  // map.clock.shouldAnimate = false

  // Fixed lighting direction
  map.scene.light = new Cesium.DirectionalLight({
    direction: map.scene.camera.direction
  })
  map.camera.percentageChanged = 0.001
  map.on(mars3d.EventType.cameraChanged, function (event) {
    map.scene.light.direction = map.scene.camera.direction
  })

  //Debug panel
  map.viewer.extend(Cesium.viewerCesiumInspectorMixin)
  map.scene.globe.depthTestAgainstTerrain = false

  // Optimized configuration for different terminals
  if (isPCBroswer()) {
    // Cesium 1.61 and later will turn off anti-aliasing by default. For desktops, it is better to turn it on.
    map.scene.postProcessStages.fxaa.enabled = true

    // Step size parameter for mouse wheel magnification
    map.scene.screenSpaceCameraController._zoomFactor = 2.0

    // IE browser optimization
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
      map.viewer.targetFrameRate = 20 //Limit frame rate
      map.viewer.requestRenderMode = true // Cancel real-time rendering
    }
  } else {
    // Step size parameter for mouse wheel magnification
    map.scene.screenSpaceCameraController._zoomFactor = 5.0

    // Disable the following options on mobile devices, which can be relatively smoother
    map.viewer.requestRenderMode = true // Cancel real-time rendering
    map.scene.fog.enabled = false
    map.scene.skyAtmosphere.show = false
    map.scene.globe.showGroundAtmosphere = false
  }

  const type = mars3d.Util.getRequestByName("data")
  switch (type) {
    case "qx-shequ":
      showQxShequDemo()
      break
    case "qx-simiao":
      showQxSimiaoDemo()
      break
    case "jzw-hefei":
      showJzwHefeiDemo()
      break
    case "max-shihua":
      showMaxShihuaDemo()
      break
    case "bim-qiaoliang":
      showBimQiaoliangDemo()
      break
    case "bim-ditiezhan":
      showBimDitiezhanDemo()
      break
    case "pnts-ganta":
      showPntsGantaDemo()
      break
    default:
      showQxShequDemo()
      break
  }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Browser
 *
 * @returns {void}
 */
function isPCBroswer() {
  const sUserAgent = navigator.userAgent.toLowerCase()

  const bIsIpad = sUserAgent.match(/ipad/i) === "ipad"
  const bIsIphoneOs = sUserAgent.match(/iphone/i) === "iphone"
  const bIsMidp = sUserAgent.match(/midp/i) === "midp"
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4"
  const bIsUc = sUserAgent.match(/ucweb/i) === "ucweb"
  const bIsAndroid = sUserAgent.match(/android/i) === "android"
  const bIsCE = sUserAgent.match(/windows ce/i) === "windows ce"
  const bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile"
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    return false
  } else {
    return true
  }
}

//Bind event
function bindTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}
function bindWireframe(val) {
  // triangulation network
  tiles3dLayer.tileset.debugWireframe = val
}
function bindBoundbox(val) {
  // bounding box
  tiles3dLayer.tileset.debugShowBoundingVolume = val
}
function bindGfirstperson(val) {
  // keyboard roaming
  map.keyboardRoam.enabled = val
}

let tiles3dLayer
/**
 * Remove layer
 *
 * @returns {void}
 */
function removeLayer() {
  if (tiles3dLayer) {
    map.basemap = 2021 // Switch to the default image basemap

    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

/**
 * Oblique Photography County Community
 *
 * @showJzwHefeiDemo oblique photography
 * @returns {void}
 */
function showQxShequDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 28.439577, lng: 119.476925, alt: 229, heading: 57, pitch: -29 },

    queryParameters: {
      // Custom url parameters can be passed, such as token, etc.
      token: "mars3d"
    },
    enableDebugWireframe: true, // Whether it is possible to switch the display of the triangle network
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // map.on(mars3d.EventType.terrainChange, function (event) {
  //   if (map.hasTerrain) {
  //     tiles3dLayer.alt = 11.5
  //   } else {
  //     tiles3dLayer.alt = -118.5
  //   }
  // })

  tiles3dLayer.readyPromise.then(function (layer) {
    console.log("load completed", layer)

    // tiles3dLayer.tileset is a Cesium3DTileset that supports binding all Cesium native events
    //Reference API http://mars3d.cn/api/cesium/Cesium3DTileset.html
    tiles3dLayer.tileset.loadProgress.addEventListener(function (numberOfPendingRequests, numberOfTilesProcessing) {
      if (numberOfPendingRequests === 0 && numberOfTilesProcessing === 0) {
        console.log("Loading: Stop loading")
        return
      }
      console.log(`Loading: Number of pending requests: ${numberOfPendingRequests}, Number of processing: ${numberOfTilesProcessing}`)
    })
  })

  //The loaded event is only executed once
  tiles3dLayer.on(mars3d.EventType.initialTilesLoaded, function (event) {
    console.log("Trigger initialTilesLoaded event", event)
  })

  // Will be executed multiple times, and will be called back after reloading.
  tiles3dLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
    console.log("trigger allTilesLoaded event", event)
  })
}

/**
 * Oblique photography Scenic Confucian Temple
 *
 * @showJzwHefeiDemo oblique photography
 * @returns {void}
 */
function showQxSimiaoDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Confucian Temple",
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    // "skipLevelOfDetail": true,
    // "loadSiblings": true,
    // "cullRequestsWhileMoving": true,
    // "cullRequestsWhileMovingMultiplier": 10,
    // "preferLeaves": true,
    // "dynamicScreenSpaceError": true,
    // "preloadWhenHidden": true,
    // highlight: {
    // all: true, //All the overall highlighting, false is the component highlighting
    // type: mars3d.EventType.click, //The default is to highlight when the mouse moves in, you can also specify click to highlight
    //   color: "#00ffff",
    // },
    // distanceDisplayCondition_far: 3000,
    enableDebugWireframe: true, // Whether it is possible to switch the display of the triangle network
    center: {
      lat: 33.589536,
      lng: 119.032216,
      alt: 145.08,
      heading: 3.1,
      pitch: -22.9,
      roll: 0
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  //The loaded event is only executed once
  tiles3dLayer.on(mars3d.EventType.initialTilesLoaded, function (event) {
    console.log("Trigger initialTilesLoaded event", event)
  })
}

/**
 * Urban white film buildings Hefei urban area
 * @returns {void}
 */
function showJzwHefeiDemo() {
  removeLayer()

  map.basemap = 2017 // switch to blue basemap

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    // marsJzwStyle: true, // Turn on building special effects (built-in Shader code)
    marsJzwStyle: {
      baseHeight: 0.0, // The base height of the object needs to be modified to a suitable building base height.
      heightRange: 280.0, // Highlight range (baseHeight ~ baseHeight + heightRange)
      glowRange: 300.0 // The moving range of the halo
    },
    style: {
      color: {
        conditions: [["true", "rgba(16, 119, 209, 1)"]]
      }
    },
    popup: [
      { field: "objectid", name: "number" },
      { field: "name", name: "name" },
      { field: "height", name: "building height", unit: "meters" }
    ],
    center: { lat: 31.813812, lng: 117.223505, alt: 1047.7, heading: 0, pitch: -39 },
    highlight: {
      type: mars3d.EventType.click, // Click highlight
      outlineEffect: true, // Use OutlineEffect to highlight
      color: "#FFFF00",
      width: 4
    },
    flyTo: true,
    enableDebugWireframe: true // Whether it is possible to switch the display of the triangle network
  })
  map.addLayer(tiles3dLayer)

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })
}

// Example: point cloud data tower pole
function showPntsGantaDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "High voltage line tower pole",
    url: "//data.mars3d.cn/3dtiles/pnts-ganta/tileset.json",
    maximumScreenSpaceError: 1,
    position: { alt: 31 },
    style: {
      color: {
        conditions: [
          ["(${Classification} >= 4) && (${Classification} < 5) ", "color('#DC143C')"],
          ["(${Classification} >= 7) && (${Classification} < 8)  ", "color('#7B68EE')"],
          ["(${Classification} >= 16) && (${Classification} < 17)  ", "color('#00CED1')"],
          ["(${Classification} >= 17) && (${Classification} < 18)  ", "color('#3CB371')"],
          ["(${Classification} >= 18) && (${Classification} < 19)  ", "color('#FFFF00')"],
          ["(${Classification} >= 19) && (${Classification} < 20)  ", "color('#FFA500')"],
          ["(${Classification} >= 20) && (${Classification} < 21)  ", "color('#FF6347')"]
        ]
      }
    },
    popup: "all",
    flyTo: true,
    enableDebugWireframe: true // Whether it is possible to switch the display of the triangle network
  })
  map.addLayer(tiles3dLayer)

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })
}

/**
 * Manual modeling of petrochemical plants
 *
 * @showMaxShihuaDemo petrochemical plant model
 * @returns {void}
 */
function showMaxShihuaDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    // shadows: Cesium.ShadowMode.DISABLED,
    //The following parameters can be used as a reference for performance optimization when the total data of 3dtiles is large and the resolution is too high. This is not a universal solution, but it can be used as a reference.
    skipLevelOfDetail: true,
    loadSiblings: true,
    cullRequestsWhileMoving: true,
    cullRequestsWhileMovingMultiplier: 10,
    preferLeaves: true,
    preloadWhenHidden: true,
    enableDebugWireframe: true, // Whether it is possible to switch the display of the triangle network
    //The above are optimized parameters

    // popup: "all",
    highlight: {
      type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
      outlineEffect: true, // Use OutlineEffect to highlight
      color: "#00FF00",
      width: 6
    },
    center: { lat: 31.653047, lng: 117.084439, alt: 354, heading: 319, pitch: -23 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // You can bind the Popup window and handle it arbitrarily in the callback method.
  tiles3dLayer.bindPopup(function (event) {
    const attr = event.graphic.attr
    // attr["video"] = `<video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video>`;
    return mars3d.Util.getTemplateHtml({ title: "Petrochemical Plant", template: "all", attr })
  })

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })
}

/**
 * BIM bridge
 *
 * @showBimQiaoliangDemo bridge model
 * @returns {void}
 */
function showBimQiaoliangDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "bridge",
    url: "//data.mars3d.cn/3dtiles/bim-qiaoliang/tileset.json",

    //The following parameters can be used as a reference for performance optimization when the total data of 3dtiles is large and the resolution is too high. This is not a universal solution, but it can be used as a reference.
    maximumScreenSpaceError: 16, // [Important] Increasing the value can make the final image blurry

    skipLevelOfDetail: true, // is an optimization parameter introduced by Cesium in 1.5x. This parameter can skip some levels during pyramid data loading, so that the overall efficiency will be higher and the data usage will be smaller. However, the exceptions caused are: 1) It flickers during the loading process and looks like it is transparent. After the data is loaded, it is normal. 2. There are some abnormal patches. This is caused by the large data difference between the two levels of LOD. When this parameter is set to false, the changes between the two levels are smoother and will not jump through. However, clear data takes longer, and there is also a fatal problem. Once a certain tile data cannot be requested or fails, it will continue to be unavailable. clear. Therefore, we recommend that when the network conditions are good and the total amount of data is small, you can set false to improve the quality of data display.
    loadSiblings: true, // If true, the model will not be automatically super-cleared from the center after the model is loaded.
    cullRequestsWhileMoving: true,
    cullRequestsWhileMovingMultiplier: 10, // [Important] The smaller the value, the faster the culling will be.
    preferLeaves: true, // [Important] This parameter defaults to false. Under the same conditions, leaf nodes will be loaded first. However, Cesium's tile loading priority has many considerations, and this is just one of them. If skipLevelOfDetail=false, this parameter is almost meaningless. Therefore, it must be used with skipLevelOfDetail=true, and set preferLeaves=true at this time. In this way, we can see the blocks that meet the current visual accuracy as quickly as possible, which has a little improvement significance for improving big data and the network environment is not good.
    progressiveResolutionHeightFraction: 0.5, // [Important] Values ​​biased towards 0 can make the initial loading blurry
    dynamicScreenSpaceError: true, // When true, the model will not be clear until the real full screen is loaded.
    preloadWhenHidden: true, // When tileset.show is false, also preload data
    enableDebugWireframe: true, // Whether it is possible to switch the display of the triangle network
    //The above are optimized parameters

    position: { lng: 117.096906, lat: 31.851564, alt: 45 },
    rotation: { z: 17.5 },
    highlight: {
      type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
      // all: true,
      color: "#00FF00"
    },
    // popup: 'all',
    center: { lat: 31.8503, lng: 117.101008, alt: 307.73, heading: 291, pitch: -30, roll: 0 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // You can bind the Popup window and handle it arbitrarily in the callback method.
  tiles3dLayer.bindPopup(function (event) {
    const attr = event.graphic.attr
    return mars3d.Util.getTemplateHtml({ title: "bridge", template: "all", attr })
  })

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })

  //Display objects in the specified time range 0-10, 20-30, 40-max
  const now = map.clock.currentTime
  tiles3dLayer.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}

/**
 * BIM bridge
 *
 * @showBimDitiezhanDemo bridge model
 * @returns {void}
 */
function showBimDitiezhanDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Light Rail Metro Station",
    url: "//data.mars3d.cn/3dtiles/bim-ditiezhan/tileset.json",
    maximumScreenSpaceError: 16,
    position: { lng: 117.203994, lat: 31.857999, alt: 28.9 },
    rotation: { z: 168.1 },

    highlight: {
      type: "click",
      color: "#00FF00"
    },
    popup: "all",
    center: { lat: 31.856358, lng: 117.204451, alt: 148, heading: 350, pitch: -30 },
    flyTo: true,
    enableDebugWireframe: true // Whether it is possible to switch the display of the triangle network
  })
  map.addLayer(tiles3dLayer)

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })
}
