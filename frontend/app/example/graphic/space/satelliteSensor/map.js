// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 0.072832, lng: 151.409367, alt: 29330818, heading: 10, pitch: -90 }
  },
  cameraController: {
    maximumZoomDistance: 9000000000,
    constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
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

  globalNotify("Known problem tips", `(1) The performance of SatelliteSensor is relatively poor, and we will try to optimize it later. It is recommended to use conicSensor or rectSensor when there are non-projection requirements`)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let modelGraphic

//Initialize and create a satellite frustum
function addDemoGraphic1(sensorParams) {
  const position = Cesium.Cartesian3.fromDegrees(sensorParams.model_x, sensorParams.model_y, sensorParams.model_z)
  //Add a model
  modelGraphic = new mars3d.graphic.ModelPrimitive({
    name: "Satellite Model",
    position: position,
    forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    backwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 150,
      heading: sensorParams.headingValue,
      pitch: sensorParams.pitchValue,
      roll: sensorParams.rollValue
    }
  })
  graphicLayer.addGraphic(modelGraphic)

  //Open 3 axes for display and comparison
  modelGraphic.debugAxis = true

  // frustum
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: position,
    forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    backwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: sensorParams.angleValue1,
      angle2: sensorParams.angleValue2,
      heading: sensorParams.headingValue,
      pitch: sensorParams.pitchValue,
      roll: sensorParams.rollValue,
      color: "rgba(0,255,255,0.7)",
      flat: true
    }
  })
  graphicLayer.addGraphic(satelliteSensor)

  eventTarget.fire("addTableData", { graphicLayer })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 5000)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.SatelliteSensor({
      position,
      style: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
        angle1: 10,
        angle2: 20,
        color: "rgba(0,255,255,0.7)"
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing phased array radar
function startDrawGraphic() {
  graphicLayer
    .startDraw({
      type: "satelliteSensor",
      style: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
        angle1: 20,
        angle2: 10,
        color: "rgba(0,255,255,0.7)"
      }
    })
    .then((graphic) => {
      graphic.height = 5000
    })
}

let satelliteSensor
function getGraphic(graphicId) {
  satelliteSensor = graphicLayer.getGraphicById(graphicId)
  return satelliteSensor
}

function updatePosition(x, y, z) {
  const position = Cesium.Cartesian3.fromDegrees(x, y, z)
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.position = position
  }
  if (satelliteSensor) {
    satelliteSensor.position = position
  }
}

function locate() {
  satelliteSensor.flyTo({ radius: satelliteSensor.alt * 2 })
}

// Direction angle change
function headingChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.heading = value
  }
  if (satelliteSensor) {
    satelliteSensor.heading = value
  }
}

// Pitch angle
function pitchChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.pitch = value
  }
  if (satelliteSensor) {
    satelliteSensor.pitch = value
  }
}

// left and right corners
function rollChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.roll = value
  }
  if (satelliteSensor) {
    satelliteSensor.roll = value
  }
}

// included angle 1
function angle1(value) {
  if (satelliteSensor) {
    satelliteSensor.angle1 = value
  }
}

// included angle 2
function angle2(value) {
  if (satelliteSensor) {
    satelliteSensor.angle2 = value
  }
}

// Display and hide reference axis system
function chkShowModelMatrix(val) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.debugAxis = val
  }
}

// Optic frustum status
function sensorShowHide(val) {
  if (satelliteSensor) {
    satelliteSensor.show = val
  }
}
// Whether it intersects with the earth
function chkUnderground(val) {
  if (satelliteSensor) {
    satelliteSensor.rayEllipsoid = val
  }
}

// type selection
function chkSensorType(value) {
  if (satelliteSensor) {
    if (value === "1") {
      satelliteSensor.sensorType = mars3d.graphic.SatelliteSensor.Type.Conic
    } else {
      satelliteSensor.sensorType = mars3d.graphic.SatelliteSensor.Type.Rect
    }
  }
}

function lengthChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.debugAxisLength = value * 1000
  }
}

function updateColor(value) {
  if (satelliteSensor) {
    satelliteSensor.color = value
  }
}

// Get the boundary value
function getRegion() {
  map.graphicLayer.clear()
  if (!satelliteSensor) {
    return
  }

  const coords = satelliteSensor.getAreaCoords() // Export imaging area boundary coordinates
  if (!coords || coords.length === 0) {
    globalMsg("There is currently no imaging area with the Earth")
    return
  }
  //Display boundary points, test

  coords.forEach((position) => {
    const graphic = new mars3d.graphic.PointPrimitive({
      position,
      style: {
        color: "#ff0000",
        pixelSize: 8,
        outline: true,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        clampToGround: true
      }
    })
    map.graphicLayer.addGraphic(graphic)
  })
}

function getCenter() {
  map.graphicLayer.clear()

  if (!satelliteSensor) {
    return
  }

  const groundPosition = satelliteSensor.groundPosition
  if (!groundPosition) {
    globalMsg("There is currently no intersection with the earth")
    return
  }

  const graphic = new mars3d.graphic.PointPrimitive({
    position: groundPosition,
    style: {
      color: "#ff0000",
      pixelSize: 8,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      clampToGround: true
    }
  })
  map.graphicLayer.addGraphic(graphic)

  const point = mars3d.LngLatPoint.fromCartesian(groundPosition)
  globalMsg(point.toString())
}

function clearAll() {
  map.graphicLayer.clear()
}
