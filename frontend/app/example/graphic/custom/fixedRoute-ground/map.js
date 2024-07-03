// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel
let graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.836861, lng: 116.044673, alt: 1395, heading: 14, pitch: -42 }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Load the car after loading is complete, otherwise the terrain has not been loaded and the car will be underground
  map.on(mars3d.EventType.load, function (event) {
    addGraphicLayer()
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Roaming on the surface of the earth",
    speed: 160,
    positions: [
      [116.043233, 30.845286, 392.48],
      [116.046833, 30.846863, 411.33],
      [116.052137, 30.848801, 439.45],
      [116.060838, 30.850918, 442.91],
      [116.069013, 30.852035, 435.14],
      [116.18739, 30.854441, 244.53],
      [116.205214, 30.859332, 300.96]
    ],
    clockLoop: false, // Whether to loop playback
    camera: {
      type: "gs",
      pitch: -30,
      radius: 500
    },
    // model: {
    //   show: true,
    //   url: '//data.mars3d.cn/gltf/mars/qiche.gltf',
    //   scale: 0.2,
    //   minimumPixelSize: 50,
    // },
    model: {
      url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      heading: 90,
      mergeOrientation: true, // Used to set the correction process when the model is not in a standard orientation. Add the setting to the orientation-based mode value to be the heading value.
      minimumPixelSize: 50
    },
    polyline: {
      color: "#ffff00",
      width: 3
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  //Bind popup
  bindPopup(fixedRoute)

  fixedRoute.on(mars3d.EventType.start, function (event) {
    console.log("Roaming starts")
  })
  fixedRoute.on(mars3d.EventType.end, function (event) {
    console.log("Roaming ends")
  })
  //UI panel information display
  fixedRoute.on(mars3d.EventType.change, (event) => {
    // const popup = event.graphic.getPopup()
    // const container = popup?.container // DOM corresponding to popup

    // console.log("Roaming change", event)
    throttled(eventTarget.fire("roamLineChange", event), 500)
  })

  map.on(mars3d.EventType.keydown, function (event) {
    // Space switches pause/continue
    if (event.keyCode === 32) {
      if (fixedRoute.isPause) {
        fixedRoute.proceed()
      } else {
        fixedRoute.pause()
      }
    }
  })

  // When not touching the ground, start directly
  // startFly(fixedRoute)

  // When it is necessary to calculate the placement location, the asynchronous calculation will be started after the placement is completed.
  showLoading()
  fixedRoute.autoSurfaceHeight().then(function (e) {
    hideLoading()
    startFly(fixedRoute)
  })
}

function startFly(fixedRoute) {
  fixedRoute.start()
  fixedRoute.openPopup() // Display popup

  addParticleSystem(fixedRoute.property)
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

//Add exhaust particle effect
function addParticleSystem(property) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: property,
    style: {
      image: "./img/particle/smoke.png",
      particleSize: 12, // particle size (unit: pixel)
      emissionRate: 20.0, // Emission rate (unit: times/second)
      pitch: 40, // pitch angle
      maxHeight: 1000, // No particle effect will be displayed after exceeding this height

      startColor: Cesium.Color.GREY.withAlpha(0.7), // start color
      endColor: Cesium.Color.WHITE.withAlpha(0.0), //End color
      startScale: 1.0, //Start scale (unit: multiple of imageSize size)
      endScale: 5.0, // End scale (unit: multiple of imageSize size)
      minimumSpeed: 1.0, // minimum speed (m/s)
      maximumSpeed: 4.0 // Maximum speed (m/s)
    },
    attr: { remark: "Vehicle exhaust" }
  })
  graphicLayer.addGraphic(particleSystem)
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
