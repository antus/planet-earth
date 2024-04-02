// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    // The parameters here will overwrite the corresponding configuration in config.json
    center: { lat: 6.148021, lng: 58.982029, alt: 42278441, heading: 220, pitch: -85 },
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
  graphicLayer.bindPopup(function (event) {
    const points = event.graphic.attr?.points
    if (!points) {
      return
    }
    // After clicking a point on the trajectory connection, find the time corresponding to the point
    const positionDM = event.cartesian
    const val1 = points[0]
    const val2 = points[points.length - 1]

    const startTime = Cesium.JulianDate.toDate(val1.time)
    const endTime = Cesium.JulianDate.toDate(val2.time)

    const len1 = Math.abs(Cesium.Cartesian3.distance(positionDM, val1.position))
    const len2 = Math.abs(Cesium.Cartesian3.distance(positionDM, val2.position))

    const adds = (len1 / (len1 + len2)) * (endTime.getTime() - startTime.getTime()) // Find the time increase value in proportion to distance
    const currentTime = new Date(startTime.getTime() + adds)

    const inthtml = "Click time:" + mars3d.Util.formatDate(currentTime, "yyyy-MM-dd HH:mm:ss")
    return inthtml
  })

  const weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    referenceFrame: Cesium.ReferenceFrame.FIXED, // Cesium.ReferenceFrame.INERTIAL,
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
    cone: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 10,
      angle2: 5,
      color: "#6ef500",
      opacity: 0.5
    },
    path: {
      color: "#00ff00",
      opacity: 0.5,
      width: 1
    }
  })
  map.graphicLayer.addGraphic(weixin)

  setTimeout(() => {
    weixin.flyTo({
      radius: 900000, // distance from the target point
      pitch: -60 // camera direction
    })
  }, 1000)

  const now = Cesium.JulianDate.toDate(map.clock.currentTime)
  const startTime = mars3d.Util.formatDate(now, "yyyy-MM-dd HH:mm:ss")

  now.setMinutes(now.getMinutes() + 60)
  const endTime = mars3d.Util.formatDate(now, "yyyy-MM-dd HH:mm:ss")

  eventTarget.fire("loadStatellite", { startTime, endTime })
}

function btnAdd(data) {
  const weixin = map.graphicLayer.getGraphicByAttr("GAOFEN 1", "name")
  const startTime = data.startTime
  const endTime = data.endTime
  const areaColor = data.areaColor
  const slideOpacity = data.slideOpacity
  const slideAngle = data.slideAngle

  addTimeShading(weixin, {
    startTime,
    endTime,
    color: areaColor,
    opacity: slideOpacity,
    angle: slideAngle
  })
}
function btnRemoveAll() {
  graphicLayer.clear()
}

function changeColorOpacity(data) {
  graphicLayer.eachGraphic(function (graphic) {
    graphic.setColorStyle({ color: data.areaColor, opacity: data.slideOpacity })
  })
}

function changeAngle(val) {
  const weixin = map.graphicLayer.getGraphicByAttr("GAOFEN 1", "name")
  if (val) {
    weixin.angle1 = val
  }
}

function changeGuidaoS(valS) {
  updateVisibleForFaceNouth(true, valS)
}

function changeGuidaoJ(valJ) {
  updateVisibleForFaceNouth(false, valJ)
}

// options parameters include: startTime start time, endTime end time, angle opening angle, color color, opacity transparency
function addTimeShading(weixin, options) {
  graphicLayer.clear()

  const bt = new Date(options.startTime).getTime()
  const et = new Date(options.endTime).getTime()
  if (bt >= et) {
    globalMsg("The start time needs to be less than the end time.")
    return
  }

  const step = 2 * 60000

  const points = []
  const positions = []

  let temp_t = bt
  while (temp_t <= et) {
    const point = weixin.tle.getPoint(temp_t)
    if (!point) {
      break
    }

    const ground_pos = Cesium.Cartesian3.fromDegrees(point.lng, point.lat)
    positions.push(ground_pos)

    const time = Cesium.JulianDate.fromDate(new Date(temp_t))
    points.push({
      position: ground_pos,
      time,
      height: point.alt
    })

    temp_t += step
  }

  if (positions.length < 2) {
    globalMsg("There is no trajectory data for this time period.")
    return
  }

  let clr = Cesium.Color.fromCssColorString(options.color || "#ff0000").withAlpha(Number(options.opacity || 1.0))
  clr = Cesium.ColorGeometryInstanceAttribute.fromColor(clr)

  const geometryInstancesSG = [] // Orbit raising
  const geometryInstancesJG = [] // Lower orbit
  for (let i = 1; i < positions.length; i++) {
    const position1 = positions[i - 1]
    const position2 = positions[i]

    const height = points[i].height // You can also take the height of position2
    const shadingWidth = height * Math.tan(Cesium.Math.toRadians(options.angle)) * 2 // Find the band width based on the satellite angle

    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.CorridorGeometry({
        vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
        positions: [position1, position2],
        width: shadingWidth,
        cornerType: Cesium.CornerType.MITERED // Specify the corner style
      }),
      attributes: {
        color: clr
      }
    })
    // Important: Bind related properties
    instance.attr = {
      points: [points[i - 1], points[i]]
    }

    const hp = mars3d.PointUtil.getHeadingPitchRollForLine(position1, position2)

    if (hp.heading > 0) {
      geometryInstancesSG.push(instance)
    } else {
      geometryInstancesJG.push(instance)
    }
  }

  // Raise orbit
  if (geometryInstancesSG.length > 0) {
    const primitiveSG = new mars3d.graphic.BaseCombine({
      instances: geometryInstancesSG
    })
    primitiveSG.isFaceNouth = true
    graphicLayer.addGraphic(primitiveSG)
  }

  // Lower orbit
  if (geometryInstancesJG.length > 0) {
    const primitiveJG = new mars3d.graphic.BaseCombine({
      instances: geometryInstancesJG
    })
    primitiveJG.isFaceNouth = false
    graphicLayer.addGraphic(primitiveJG)
  }
}

//Lift rail type filtering
function updateVisibleForFaceNouth(isFaceNouth, show) {
  graphicLayer.eachGraphic(function (graphic) {
    if (isFaceNouth && graphic.isFaceNouth) {
      graphic.show = show
    }
    if (!isFaceNouth && !graphic.isFaceNouth) {
      graphic.show = show
    }
  })
}
