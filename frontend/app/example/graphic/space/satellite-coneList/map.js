// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let weixin

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 12.845055, lng: 112.931363, alt: 24286797, heading: 3, pitch: -90 },
    globe: { enableLighting: true },
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
  },
  terrain: false,
  layers: [
    {
      name: "Night Picture",
      icon: "img/basemaps/blackMarble.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/night2.jpg",
      dayAlpha: 0.0,
      nightAlpha: 1.0,
      brightness: 3.5,
      show: true
    }
  ]
}
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // Record map map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  map.clock.shouldAnimate = true
  map.clock.multiplier = 1 // speed
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
    name: "BEIDOU M6",
    tle1: "1 38775U 12050B   19233.58396017  .00000002  00000-0  00000+0 0  9996",
    tle2: "2 38775  54.9682 146.4459 0022572 250.3518 274.6095  1.86232229 47268",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf"
    },
    path: {
      color: "#36d9ec"
    },
    cone: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      rayEllipsoid: true,
      list: [
        {
          name: "High Score Camera A",
          angle1: 4.03, // Field of view angle 1 (degree)
          angle2: 4.03, // Field of view angle 2 (degrees)
          pitchOffset: 3.7, // Installation deflection angle (degrees)
          color: "#ff0000",
          opacity: 0.5,
          show: true
        },
        {
          name: "High Score Camera B",
          angle1: 3.1, // Field of view angle 1 (degree)
          angle2: 3.1, // Field of view angle 2 (degrees)
          pitchOffset: -3.7, // Installation deflection angle (degrees)
          color: "#0000ff",
          opacity: 0.5,
          show: true
        },
        {
          name: "Multispectral Camera A",
          angle1: 4.5, // Field of view angle 1 (degree)
          angle2: 4.5, // Field of view angle 2 (degrees)
          pitchOffset: 4.35, // Installation deflection angle (degrees)
          color: "#ffff00",
          opacity: 0.5,
          show: true
        },
        {
          name: "Multispectral Camera B",
          angle1: 4.5, // Field of view angle 1 (degree)
          angle2: 4.5, // Field of view angle 2 (degrees)
          pitchOffset: -4.35, // Installation deflection angle (degrees)
          color: "#00ffff",
          opacity: 0.5,
          show: true
        }
      ]
    }
  })
  graphicLayer.addGraphic(weixin)

  const weixinData = {}
  weixinData.name = weixin.name
  weixinData.tle1 = weixin.options.tle1
  weixinData.tle2 = weixin.options.tle2

  //Display real-time coordinates and time
  weixin.on(mars3d.EventType.change, function (event) {
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

  //Dynamic scanning frustum
  const saomiaoSensor = new mars3d.graphic.SatelliteSensor({
    position: weixin.property,
    orientation: weixin.orientation,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 4.5,
      angle2: 0.01,
      pitch: 0,
      color: "rgba(255,0,0,0.4)"
    }
  })
  graphicLayer.addGraphic(saomiaoSensor)

  //Dynamic pitch angle
  const maxHeight = 9
  const step = 0.1
  let currPitch = maxHeight
  let isUp = -1

  const update_old = saomiaoSensor.update
  saomiaoSensor.update = function (frameState) {
    if (currPitch <= -maxHeight && isUp !== 1) {
      isUp = 1
    } else if (currPitch >= maxHeight && isUp !== -1) {
      isUp = -1
    }
    currPitch += step * isUp
    saomiaoSensor.pitch = currPitch

    return update_old.bind(this)(frameState)
  }
}

// Position to satellite
function locate() {
  weixin.flyTo()
}

// Display and hide reference axis system
function chkShowModelMatrix(val) {
  weixin.debugAxis = val
}
