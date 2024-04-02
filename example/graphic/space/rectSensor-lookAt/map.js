// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 12.845055, lng: 112.931363, alt: 24286797, heading: 3, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  map.clock.shouldAnimate = true
  map.clock.multiplier = 60 // speed

  addGraphicLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Satellite clicked", event)
  })
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Satellite Layer", template: "all", attr })
  })

  const weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    },
    label: {
      text: "GAOFEN 1",
      color: "#ffffff",
      opacity: 1,
      font_family: "楷体",
      font_size: 30,
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      font_weight: "normal",
      font_style: "normal",
      pixelOffsetX: 0,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    },
    path: {
      color: "#00ff00",
      opacity: 0.5,
      width: 1
    }
  })
  graphicLayer.addGraphic(weixin)

  // target satellite
  const winxinMB = new mars3d.graphic.Satellite({
    name: "COSMOS 2251 DEB",
    tle1: "1 33916U 93036DV  21197.38574736  .00000034  00000-0  48020-4 0  9991",
    tle2: "2 33916  74.0517 160.4563 0330253 328.4241 153.7022 13.66391564618811",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    },
    label: {
      text: "COSMOS 2251 DEB",
      color: "#ffffff",
      opacity: 1,
      font_family: "楷体",
      font_size: 30,
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      font_weight: "normal",
      font_style: "normal",
      pixelOffsetX: 0,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    },
    path: {
      color: "#00ff00",
      opacity: 0.5,
      width: 1
    }
  })
  graphicLayer.addGraphic(winxinMB)

  // Four-sided pyramid
  const rectSensor = new mars3d.graphic.RectSensor({
    position: new Cesium.CallbackProperty(function (time) {
      return weixin.position
    }, false),
    style: {
      angle1: 10,
      angle2: 10,
      color: "rgba(0,255,0,0.4)",
      outline: true,
      topShow: true,
      topSteps: 2,
      rayEllipsoid: true // Intersect with the Earth
    },
    reverse: true
  })
  graphicLayer.addGraphic(rectSensor)

  // Track target
  rectSensor.lookAt = new Cesium.CallbackProperty(function (time) {
    return winxinMB.position
  }, false)
}
