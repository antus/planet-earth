// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.344715, lng: 115.783073, alt: 10056, heading: 158, pitch: -55 },
    globe: {
      // depthTestAgainstTerrain: true,
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true // Whether to display the timeline control
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
  map.hasTerrain = false

  globalNotify("Known Issue Tips", `Does not support terrain intersection, currently only projects ellipsoids. `)

  addGraphicLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let fixedRoute

function addGraphicLayer() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Airplane route",
    speed: 200,
    positions: [
      [115.833866, 31.311451, 4000],
      [115.785116, 31.293944, 4000],
      [115.748115, 31.266263, 4000],
      [115.711031, 31.216472, 4000]
    ],
    clockLoop: true, // Whether to loop playback
    camera: {
      type: "zy",
      followedX: 50,
      followedZ: 10
    },
    label: {
      text: "Mars",
      color: "#0081c2",
      font_size: 20,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      pixelOffsetX: 0,
      pixelOffsetY: -20
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 100
    },
    path: {
      color: "rgba(255,255,0,0.5)",
      width: 1,
      leadTime: 0
    }
    // wall: {
    //   color: "rgba(0,255,255,0.5)",
    //   surface: true
    // }
  })
  graphicLayer.addGraphic(fixedRoute)

  //Bind popup
  bindPopup(fixedRoute)

  //UI panel information display
  fixedRoute.on(mars3d.EventType.change, (event) => {
    throttled(eventTarget.fire("roamLineChange", event), 500)
  })

  // Start roaming
  fixedRoute.start()

  testShading()

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(fixedRoute.startTime, fixedRoute.stopTime)
  }
}

function setMoelStyle(style) {
  fixedRoute.model.setStyle(style)
}

function clearMoelPitchRoll () {
  fixedRoute.model.style.pitch = undefined
  fixedRoute.model.style.roll = undefined
}


function clearGroundLayer() {
  groundLayer.clear()
}

let groundLayer // Ground projection layer

function testShading() {
  // Centerline ground point of satellite orientation
  const line1 = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const pt1 = fixedRoute.position
      const pt2 = centerPosion
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
  map.graphicLayer.addGraphic(line1)

  // Satellite edge 2 points
  const graphicTriangle = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const positions = getFourShadingPosition({
        angle: 2.4,
        angle2: 1.4
      })
      return positions
    }, false),
    style: {
      width: 2,
      color: "#0000ff",
      clampToGround: true
    }
  })
  map.graphicLayer.addGraphic(graphicTriangle)

  //Create vector data layer
  groundLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(groundLayer)

  setInterval(function () {
    if (!map.clock.shouldAnimate || !thisPositions) {
      return
    }
    addPolygon()
  }, 1500)
}

// Get the four-sided pyramid projection surface of the ground
let thisPositions
let centerPosion
let lastPositions

function getFourShadingPosition(opts) {
  // Location
  const pt1 = fixedRoute.position
  if (!pt1) {
    return
  }

  const ellipsoid = map.scene.globe.ellipsoid

  // Zhang Jiao
  const angle1 = Cesium.Math.toRadians(opts.angle) / 2

  const heading = Cesium.Math.toRadians(Cesium.defaultValue(opts.heading, fixedRoute.model.heading))
  const pitch = Cesium.Math.toRadians(Cesium.defaultValue(opts.pitch, fixedRoute.model.pitch))
  const roll = Cesium.Math.toRadians(Cesium.defaultValue(opts.heading, fixedRoute.model.roll))

  // Zhang Jiao
  const angle2 = Cesium.Math.toRadians(opts.angle2) / 2

  const ptLeft1 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch + angle2, roll + angle1), true, ellipsoid)
  if (!ptLeft1) {
    return
  }

  const ptRight1 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch + angle2, roll - angle1), true, ellipsoid)
  if (!ptRight1) {
    return
  }

  const ptRight2 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch - angle2, roll - angle1), true, ellipsoid)
  if (!ptRight2) {
    return
  }

  const ptLeft2 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch - angle2, roll + angle1), true, ellipsoid)
  if (!ptLeft2) {
    return
  }

  const ptLeft = Cesium.Cartesian3.midpoint(ptLeft1, ptLeft2, new Cesium.Cartesian3())
  const ptRight = Cesium.Cartesian3.midpoint(ptRight1, ptRight2, new Cesium.Cartesian3())
  thisPositions = [ptLeft, ptRight]

  centerPosion = Cesium.Cartesian3.midpoint(ptLeft, ptRight, new Cesium.Cartesian3())

  return [ptLeft1, ptRight1, ptRight2, ptLeft2, ptLeft1]
}

function addPolygon() {
  if (lastPositions == null) {
    lastPositions = thisPositions
    return
  }
  const positions = [lastPositions[0], lastPositions[1], thisPositions[1], thisPositions[0]]
  lastPositions = thisPositions

  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions,
    style: {
      color: "#ff0000",
      opacity: 0.3
    }
  })
  groundLayer.addGraphic(graphic)

  if (groundLayer.length > 2000) {
    groundLayer.clear()
  }
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
