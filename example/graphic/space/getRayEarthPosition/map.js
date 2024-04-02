// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let weixin
let graphicLayer
let graphicTriangle

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
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  }
}
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addSatellite()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addSatellite() {
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
      minimumPixelSize: 90
    },
    cone: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 10,
      angle2: 0.01,
      color: "rgba(0,255,255,0.5)",
      opacity: 0.5,
      show: false
    },
    path: {
      color: "#00ff00",
      opacity: 0.5,
      width: 1,
      show: true
    }
  })
  graphicLayer.addGraphic(weixin)

  // Centerline ground point of satellite orientation
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(() => {
      const pt1 = weixin.position
      const pt2 = weixin.groundPosition
      if (!pt1 || !pt2) {
        return []
      }
      return [pt1, pt2]
    }, false),
    style: {
      width: 2,
      color: "#ff0000",
      arcType: Cesium.ArcType.NONE
    }
  })
  graphicLayer.addGraphic(graphic)

  setTimeout(() => {
    weixin.flyTo({
      radius: 900000, // distance from the target point
      pitch: -60 // camera direction
    })
  }, 3000)

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

function centerPoint(angle1) {
  if (graphicTriangle) {
    graphicTriangle.show = false
  }
  graphicTriangle = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const pt1 = weixin.position

      const hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(weixin.heading),
        Cesium.Math.toRadians(weixin.pitch),
        Cesium.Math.toRadians(weixin.roll + angle1)
      )
      const ptLeft = mars3d.PointUtil.getRayEarthPosition(pt1, hpr, true)

      const hdr2 = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(weixin.heading),
        Cesium.Math.toRadians(weixin.pitch),
        Cesium.Math.toRadians(weixin.roll - angle1)
      )
      const ptRight = mars3d.PointUtil.getRayEarthPosition(pt1, hdr2, true)

      if (!ptRight || !ptLeft) {
        return []
      }

      return [ptLeft, pt1, ptRight, ptLeft]
    }, false),
    style: {
      width: 2,
      color: "#0000ff",
      arcType: Cesium.ArcType.NONE
    }
  })
  graphicLayer.addGraphic(graphicTriangle)
}

// Pitch angle
function pitchChange(value) {
  weixin.model.pitch = value
}

// left and right corners
function rollChange(value) {
  weixin.model.roll = value
}

function angle(value) {
  weixin.cone.angle1 = value
  centerPoint(weixin.cone.angle1)
}

function chkShowModelMatrix(val) {
  weixin.coneShow = val //Show closed viewing cone
}

function locate() {
  weixin.flyTo()
}
