// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    // The parameters here will overwrite the corresponding configuration in config.json
    center: { lat: 5.459746, lng: 68.238291, alt: 36261079, heading: 143, pitch: -89 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true // Whether to display the timeline control
  }
}

var weixin

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // Record map map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  // specified time
  // map.clock.currentTime = Cesium.JulianDate.fromDate(new Date('2020-11-27 10:48:28'))
  map.clock.shouldAnimate = true
  map.clock.multiplier = 1 // speed

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

  weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",

    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90,
      silhouette: false
    },
    label: {
      text: "High Score No. 1",
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
    cone: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 10,
      angle2: 5,
      color: "rgba(0,255,255,0.5)"
    },
    path: {
      color: "#00ff00",
      opacity: 0.5,
      width: 1
    },
    highlight: {
      type: mars3d.EventType.click,
      model: {
        silhouette: true,
        silhouetteColor: "#ffff00",
        silhouetteSize: 3
      },
      path: {
        color: "#ffff00",
        width: 2
      }
    },
    attr: { name: "High Score No. 1" }
  })
  graphicLayer.addGraphic(weixin)

  const weixinData = {}
  weixinData.name = weixin.name
  weixinData.tle1 = weixin.options.tle1
  weixinData.tle2 = weixin.options.tle2

  //Display real-time coordinates and time
  weixin.on(mars3d.EventType.change, (e) => {
    const date = Cesium.JulianDate.toDate(map.clock.currentTime)
    weixinData.time = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")
    if (weixin.position) {
      const point = mars3d.LngLatPoint.fromCartesian(weixin.position)
      weixinData.td_jd = point.lng
      weixinData.td_wd = point.lat
      weixinData.td_gd = mars3d.MeasureUtil.formatDistance(point.alt)
      eventTarget.fire("satelliteChange", { weixinData })
    }
  })
}

// Position to satellite
function locate() {
  weixin.flyTo()
}

// Display and hide reference axis system
function chkShowModelMatrix(val) {
  weixin.debugAxis = val
}
// gaze target
function selPoint() {
  if (weixin.cone.lookAt) {
    weixin.cone.lookAt = null
  } else {
    map.graphicLayer.startDraw({
      type: "point",
      style: {
        pixelSize: 12,
        color: "#ffff00"
      },
      success: function (graphic) {
        const position = graphic.positionShow
        map.graphicLayer.clear()

        weixin.cone.lookAt = position
      }
    })
  }
}

// type selection
function chkSensorType(value) {
  if (value === "1") {
    weixin.setOptions({
      cone: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Conic
      }
    })
  } else {
    weixin.setOptions({
      cone: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect
      }
    })
  }
}

// Pitch angle
function pitchChange(value) {
  weixin.model.pitch = value
}

// left and right corners
function rollChange(value) {
  weixin.model.roll = value
}

// included angle 1
function angle1(value) {
  weixin.cone.angle1 = value
}

// included angle 2
function angle2(value) {
  weixin.cone.angle2 = value
}
