// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.648141, lng: 117.07114, alt: 943.1, heading: 27.6, pitch: -34.7 }
  }
}

let bloomTargetEffect

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Add model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("Model clicked", event)
  })

  // vector layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add gltf model
  const graphicModel = new mars3d.graphic.ModelPrimitive({
    name: "car",
    position: Cesium.Cartesian3.fromDegrees(117.074035, 31.660459, 40),
    style: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 1,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphicModel)

  //Add vector data
  const graphicBox1 = new mars3d.graphic.BoxPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.071033, 31.663258, 31.3),
    style: {
      dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
      color: "#ff0000"
    }
  })
  graphicLayer.addGraphic(graphicBox1)

  const graphic1 = new mars3d.graphic.EllipsoidPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.071423, 31.664305, 30.8),
    style: {
      radii: new Cesium.Cartesian3(50.0, 50.0, 50.0),
      color: "#ff0000"
    }
  })
  graphicLayer.addGraphic(graphic1)

  const graphicBox2 = new mars3d.graphic.BoxPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.074033, 31.663258, 31.3),
    style: {
      dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
      color: Cesium.Color.GREY
    }
  })
  graphicLayer.addGraphic(graphicBox2)

  const graphic2 = new mars3d.graphic.EllipsoidPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.074423, 31.664305, 30.8),
    style: {
      radii: new Cesium.Cartesian3(50.0, 50.0, 50.0),
      color: Cesium.Color.GREY
    }
  })
  graphicLayer.addGraphic(graphic2)

  const graphicBox3 = new mars3d.graphic.BoxPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.076033, 31.663258, 31.3),
    style: {
      dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
      color: "#3388ff"
    }
  })
  graphicLayer.addGraphic(graphicBox3)

  const graphic3 = new mars3d.graphic.EllipsoidPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.076423, 31.664305, 30.8),
    style: {
      radii: new Cesium.Cartesian3(50.0, 50.0, 50.0),
      color: "#3388ff"
    }
  })
  graphicLayer.addGraphic(graphic3)

  const graphicBox4 = new mars3d.graphic.BoxPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.078033, 31.663258, 31.3),
    style: {
      dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
      color: "#00ffff"
    }
  })
  graphicLayer.addGraphic(graphicBox4)

  const graphic4 = new mars3d.graphic.EllipsoidPrimitive({
    position: Cesium.Cartesian3.fromDegrees(117.078423, 31.664305, 30.8),
    style: {
      radii: new Cesium.Cartesian3(50.0, 50.0, 50.0),
      color: "#00ffff"
    }
  })
  graphicLayer.addGraphic(graphic4)

  //Add special effects
  bloomTargetEffect = new mars3d.effect.BloomTargetEffect({
    // objectsToExclude: [tiles3dLayer, graphicModel], // Exclude objects that are not picked up
    eventType: mars3d.EventType.click, // Pick up when clicked
    color: Cesium.Color.YELLOW,
    contrast: 119,
    brightness: 0.05,
    delta: 0.9,
    sigma: 3.78,
    stepSize: 5
  })
  map.addEffect(bloomTargetEffect)

  setTimeout(() => {
    //Specify highlighting Primitive
    bloomTargetEffect.selected = [graphicBox4, graphic4]
  }, 1000)

  //Read the specified component from the model and add it to the special effect
  // tiles3dLayer.readyPromise.then(function (e) {
  //   addTileToTargetEffect(tiles3dLayer, bloomTargetEffect)
  // })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Read the specified component from the model and add it to the special effect
function addTileToTargetEffect(tiles3dLayer, effect) {
  const loadFeatureList = new mars3d.MarsArray()
  tiles3dLayer.tileset.tileLoad.addEventListener(function (tile) {
    processTileFeatures(tile, function (feature) {
      const attr = mars3d.Util.get3DTileFeatureAttr(feature) // Get attributes

      // Based on conditional judgment, record the feature
      if (attr.id === "4734ba6f3de83d861c3176a6273cac6d") {
        loadFeatureList.set(feature.featureId, feature.pickId)
        effect.selected = loadFeatureList.values
      }
    })
  })

  tiles3dLayer.tileset.tileUnload.addEventListener(function (tile) {
    processTileFeatures(tile, function (feature) {
      if (loadFeatureList.contains(feature.featureId)) {
        loadFeatureList.remove(feature.featureId)
        effect.selected = loadFeatureList.values
      }
    })
  })
}

function processTileFeatures(tile, callback) {
  const content = tile.content
  const innerContents = content.innerContents
  if (Cesium.defined(innerContents)) {
    const length = innerContents.length
    for (let i = 0; i < length; ++i) {
      processContentFeatures(innerContents[i], callback)
    }
  } else {
    processContentFeatures(content, callback)
  }
}
function processContentFeatures(content, callback) {
  const featuresLength = content.featuresLength
  for (let i = 0; i < featuresLength; ++i) {
    const feature = content.getFeature(i)
    callback(feature)
  }
}

function setBloomTargetEffect(val) {
  bloomTargetEffect.enabled = val
}

function setBrightness(val) {
  bloomTargetEffect.brightness = val
}

function setDelta(val) {
  bloomTargetEffect.delta = val
}

function setStep(val) {
  bloomTargetEffect.stepSize = val
}

function setSigma(val) {
  bloomTargetEffect.sigma = val
}

function setContrast(val) {
  bloomTargetEffect.contrast = val
}

function setBlurSamples(val) {
  bloomTargetEffect.blurSamples = val
}

function setThreshole(val) {
  bloomTargetEffect.threshole = val
}

function setRatio(val) {
  bloomTargetEffect.ratio = val
}

function setSmoothWidth(val) {
  bloomTargetEffect.smoothWidth = val
}

function setColor(val) {
  bloomTargetEffect.color = val
}
