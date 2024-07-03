// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.874029, lng: 119.185316, alt: 197.9, heading: 6.1, pitch: -34.2 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { bottom: "380px", left: "5px" }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into components

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.toolbar.style.bottom = "55px" // Modify the toolbar control

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/uav-route.json" })
    .then(function (arr) {
      const arrNew = []
      for (let i = 0; i < arr.length; i++) {
        const point = arr[i]
        arrNew.push({
          lng: point.lng,
          lat: point.lat,
          alt: point.height,
          heading: point.aircraftYaw || 0,
          pitch: point.gimbalPitch || 0
        })
      }
      addGraphicLayer(arrNew)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

var fixedRoute

function addGraphicLayer(arr) {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arr.length; i++) {
    const graphic = new mars3d.graphic.LabelPrimitive({
      position: arr[i],
      style: {
        text: i,
        font_size: 14
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Airplane route",
    speed: 50,
    positions: arr,
    model: {
      url: "//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf",
      scale: 1,
      minimumPixelSize: 100,
      pitch: 0 // fixed angle
    },
    path: {
      color: "rgba(255,255,0,0.5)",
      width: 1,
      leadTime: 0
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  //Bind popup
  bindPopup(fixedRoute)

  //UI panel information display
  fixedRoute.on(mars3d.EventType.change, (event) => {
    // console.log("change", event)
    throttled(eventTarget.fire("roamLineChange", event), 500)
  })

  fixedRoute.start()

  //Modify the time corresponding to the control
  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(fixedRoute.startTime, fixedRoute.stopTime)
  }

  const video2D = new mars3d.graphic.Video2D({
    position: new Cesium.CallbackProperty((time) => {
      return fixedRoute.position
    }, false),
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      angle: 40,
      angle2: 20,
      heading: 0,
      pitch: 0,
      distance: 10,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  fixedRoute.on(mars3d.EventType.change, function (event) {
    // const hpr = mars3d.PointUtil.getHeadingPitchRollByOrientation(event.position, event.orientation)
    // video2D.style.heading = Cesium.Math.toDegrees(hpr.heading)
    // video2D.style.pitch = Cesium.Math.toDegrees(hpr.pitch)

    video2D.style.heading = fixedRoute.heading
    video2D.style.pitch = fixedRoute.pitch
  })
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
