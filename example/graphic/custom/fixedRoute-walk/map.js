// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel
var fixedRoute

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.824853, lng: 117.221414, alt: 1452, heading: 355, pitch: -54 }
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

  map.clock.multiplier = 1

  //Modify text
  map.setLangText({
    _meter: "m",
    _km: "km",
    _seconds: "s ",
    _minutes: "m ",
    _hour: "h "
  })

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

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Walking Route",
    frameRate: 1,
    speed: 40,
    // autoStop: true, // Automatically stop when reaching the end point
    clockLoop: true, // loop playback
    positions: [
      [117.220356, 31.833959, 43.67],
      [117.220361, 31.835111, 44.36],
      [117.213242, 31.835863, 42.31],
      [117.211926, 31.835738, 42.14],
      [117.183103, 31.833906, 47.17],
      [117.183136, 31.833586, 47.39],
      [117.183968, 31.833637, 47.05],
      [117.184038, 31.833134, 47.39],
      [117.184364, 31.833142, 47.26],
      [117.184519, 31.833375, 47.04]
    ],
    pauseTime: 0.5,
    camera: {
      type: "gs",
      radius: 300
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50,
      clampToGround: true
    },
    circle: {
      radius: 10,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ffff00",
        opacity: 0.3,
        speed: 10,
        count: 3,
        gradient: 0.1
      },
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  //Bind popup
  bindPopup(fixedRoute)

  // show popup
  fixedRoute.openPopup()

  //UI panel information display
  fixedRoute.on(mars3d.EventType.change, (event) => {
    throttled(eventTarget.fire("roamLineChange", event), 500)
  })

  fixedRoute.on(mars3d.EventType.endItem, function (event) {
    console.log("Roamed through: " + event.index, event)
  })
  fixedRoute.on(mars3d.EventType.end, function (event) {
    console.log("Roaming ended", event)
    eventTarget.fire("endRoam")
  })

  // When not touching the ground, start directly
  // fixedRoute.start()

  // When sticking to the ground, start after the asynchronous calculation is completed
  // fixedRoute.clampToGround({ has3dtiles: true }).then(function () {//Asynchronous calculation will be started after the grounding is completed
  // //The route value after sticking to the ground is flyLine.positions
  //    fixedRoute.start()
  // });
}

function bindPopup(fixedRoute) {
  fixedRoute.bindPopup(
    () => {
      const html = `<div id="popupContent"  class="marsBlackPanel animation-spaceInDown">
    <div class="marsBlackPanel-text">
      <div style="width: 200px;text-align:left;">
        <div>Total distance: <span id="lblAllLen"> </span></div>
        <div>Total time: <span id="lblAllTime"> </span></div>
        <div>Start time: <span id="lblStartTime"> </span></div>
        <div>Remaining time: <span id="lblRemainTime"> </span></div>
        <div>Remaining distance: <span id="lblRemainLen"> </span></div>
      </div>
    </div>
    <span class="mars3d-popup-close-button closeButton" >×</span>
    </div>`
      return html
    },
    { offsetY: -40, template: false }
  )

  // Refresh the local DOM without affecting the operations of other controls in the popup panel.
  fixedRoute.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // DOM corresponding to popup

    const params = fixedRoute.info
    if (!params) {
      return
    }

    const lblAllLen = container.querySelector("#lblAllLen")
    if (lblAllLen) {
      lblAllLen.innerHTML = formatDistance(params.distance_all)
    }

    const lblAllTime = container.querySelector("#lblAllTime")
    if (lblAllTime) {
      lblAllTime.innerHTML = formatTime(params.second_all / map.clock.multiplier)
    }

    const lblStartTime = container.querySelector("#lblStartTime")
    if (lblStartTime) {
      lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(fixedRoute.startTime), "yyyy-M-d HH:mm:ss")
    }

    const lblRemainTime = container.querySelector("#lblRemainTime")
    if (lblRemainTime) {
      lblRemainTime.innerHTML = formatTime((params.second_all - params.second) / map.clock.multiplier)
    }

    const lblRemainLen = container.querySelector("#lblRemainLen")
    if (lblRemainLen) {
      lblRemainLen.innerHTML = formatDistance(params.distance_all - params.distance)
    }
  })
}

//Used by ui layer
function formatDistance(val) {
  return mars3d.MeasureUtil.formatDistance(val, { getLangText })
}
function formatTime(val) {
  return mars3d.Util.formatTime(val, { getLangText })
}

function getLangText(text) {
  return map.getLangText(text)
}

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
