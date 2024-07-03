// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.588405, lng: 119.031988, alt: 336, heading: 359, pitch: -37 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  },
  layers: [
    {
      name: "Confucian Temple",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 120 },
      maximumScreenSpaceError: 2,
      flyTo: true,
      show: true
    }
  ]
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

  map.on("load", function () {
    addRoamLine()
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addRoamLine() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // This data can be saved as JSON of a single route after operating the basic project flight roaming function interface.
  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Roaming on the model surface",
    speed: 60,
    positions: [
      [119.030216, 33.59167, 50.9],
      [119.032637, 33.590768, 50.8],
      [119.033624, 33.592647, 53.4],
      [119.033814, 33.59293, 53.3],
      [119.033013, 33.593351, 53.1],
      [119.032066, 33.593706, 52.9],
      [119.031406, 33.593802, 53]
    ],
    camera: {
      type: "gs",
      heading: 0,
      radius: 500
    },
    model: {
      show: true,
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.1,
      minimumPixelSize: 20
    },
    polyline: {
      color: "#ffff00",
      width: 3,
      clampToGround: true,
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  //Bind popup
  bindPopup(fixedRoute)

  //UI panel information display
  fixedRoute.on(mars3d.EventType.change, (event) => {
    throttled(eventTarget.fire("roamLineChange", event), 500)
  })

  // When not touching the ground, start directly
  // startFly(fixedRoute)

  // When it is necessary to calculate the placement location, the asynchronous calculation will be started after the placement is completed.
  showLoading()
  fixedRoute.autoSurfaceHeight({ has3dtiles: true, splitNum: 10 }).then(function (e) {
    hideLoading()
    startFly(fixedRoute)
  })
}

function startFly(fixedRoute) {
  fixedRoute.start()
  fixedRoute.openPopup() // Display popup
}

function bindPopup(fixedRoute) {
  fixedRoute.bindPopup(
    `<div style="width: 200px">
      <div>Total distance: <span id="lblAllLen"> </span></div>
      <div>Total time: <span id="lblAllTime"> </span></div>
      <div>Start time: <span id="lblStartTime"> </span></div>
      <div>Remaining time: <span id="lblRemainTime"> </span></div>
      <div>Remaining distance: <span id="lblRemainLen"> </span></div>
    </div>`,
    { closeOnClick: false }
  )

  // Refresh the local DOM without affecting the operations of other controls in the popup panel.
  fixedRoute.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // DOM corresponding to popup

    const params = fixedRoute?.info
    if (!params) {
      return
    }

    const lblAllLen = container.querySelector("#lblAllLen")
    if (lblAllLen) {
      lblAllLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all)
    }

    const lblAllTime = container.querySelector("#lblAllTime")
    if (lblAllTime) {
      lblAllTime.innerHTML = mars3d.Util.formatTime(params.second_all / map.clock.multiplier)
    }

    const lblStartTime = container.querySelector("#lblStartTime")
    if (lblStartTime) {
      lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(fixedRoute.startTime), "yyyy-M-d HH:mm:ss")
    }

    const lblRemainTime = container.querySelector("#lblRemainTime")
    if (lblRemainTime) {
      lblRemainTime.innerHTML = mars3d.Util.formatTime((params.second_all - params.second) / map.clock.multiplier)
    }

    const lblRemainLen = container.querySelector("#lblRemainLen")
    if (lblRemainLen) {
      lblRemainLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all - params.distance) || "Complete"
    }
  })
}

//Used by ui layer
var formatDistance = mars3d.MeasureUtil.formatDistance
var formatTime = mars3d.Util.formatTime

// Throttle
function throttled(fn, delay) {
  let timer = null
  let starttime = Date.now()
  return function () {
    const curTime = Date.now() // current time
    const remaining = delay - (curTime - starttime)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    clearTimeout(timer)
    if (remaining <= 0) {
      fn.apply(context, args)
      starttime = Date.now()
    } else {
      timer = setTimeout(fn, remaining)
    }
  }
}
