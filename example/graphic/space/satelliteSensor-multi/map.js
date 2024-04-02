// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer

let satelliteSensor
let satelliteSensor2
let modelGraphic

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 0.072832, lng: 151.409367, alt: 29330818, heading: 10, pitch: -90 },
    globe: { enableLighting: true },
    cameraController: {
      maximumZoomDistance: 9000000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
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
  map = mapInstance // record map

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

//Initialize and create a satellite frustum

function addModelGraphic(sensorParams) {
  const position = Cesium.Cartesian3.fromDegrees(sensorParams.model_x, sensorParams.model_y, sensorParams.model_z)

  //Add a model
  modelGraphic = new mars3d.graphic.ModelEntity({
    name: "Satellite Model",
    position,
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
  satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: sensorParams.angleValue1,
      angle2: sensorParams.angleValue2,
      heading: sensorParams.headingValue,
      pitch: sensorParams.pitchValue,
      roll: sensorParams.rollValue,
      color: "rgba(0,255,255,0.7)"
    }
    // lookAt: Cesium.Cartesian3.fromDegrees(28.54, -26.45, 0)
  })
  graphicLayer.addGraphic(satelliteSensor)

  // frustum
  satelliteSensor2 = new mars3d.graphic.SatelliteSensor({
    position,
    style: {
      angle1: sensorParams.angleValue1,
      angle2: sensorParams.angleValue2,
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      heading: sensorParams.headingValue,
      pitch: -sensorParams.pitchValue,
      roll: sensorParams.rollValue,
      color: "rgba(255,255,0,0.7)"
    }
  })
  graphicLayer.addGraphic(satelliteSensor2)
}

/**
 *
 * @export
 * @param {*} x longitude
 * @param {*} y latitude
 * @param {*} z height
 * @returns {void}
 */
function updatePosition(x, y, z) {
  const position = Cesium.Cartesian3.fromDegrees(x, y, z)
  modelGraphic.position = position
  satelliteSensor.position = position
  satelliteSensor2.position = position
}

function locate() {
  map.flyToGraphic(modelGraphic, { radius: modelGraphic.height * 2 })
}

// Direction angle change
function headingChange(value) {
  modelGraphic.heading = value
  satelliteSensor.heading = value
  satelliteSensor2.heading = satelliteSensor.heading
}

// Pitch angle
function pitchChange(value) {
  modelGraphic.pitch = value
  satelliteSensor.pitch = value
  satelliteSensor2.pitch = -satelliteSensor.pitch
}
// left and right corners

function rollChange(value) {
  modelGraphic.roll = value
  satelliteSensor.roll = value
  satelliteSensor2.roll = satelliteSensor.roll
}

// included angle 1
function angle1(value) {
  satelliteSensor.angle1 = value
  satelliteSensor2.angle1 = value
}

// included angle 2
function angle2(value) {
  satelliteSensor.angle2 = value
  satelliteSensor2.angle2 = value
}

// Display and hide reference axis system
function chkShowModelMatrix(val) {
  modelGraphic.debugAxis = val
}

// Optic frustum status
function sensorShowHide(val) {
  satelliteSensor.show = val
  satelliteSensor2.show = val
}
// Whether it intersects with the earth
function chkUnderground(val) {
  satelliteSensor.rayEllipsoid = val
  satelliteSensor2.rayEllipsoid = val
}

// type selection
function chkSensorType(value) {
  let sensorType
  if (value === "1") {
    sensorType = mars3d.graphic.SatelliteSensor.Type.Conic
  } else {
    sensorType = mars3d.graphic.SatelliteSensor.Type.Rect
  }
  satelliteSensor.sensorType = sensorType
  satelliteSensor2.sensorType = sensorType
}

function lengthChange(value) {
  modelGraphic.debugAxisLength = value * 1000
}

function clearAll() {
  map.graphicLayer.clear()
}

// Get the boundary value
function getRegion() {
  map.graphicLayer.clear()

  const coords = satelliteSensor.getAreaCoords() // Export imaging area boundary coordinates
  if (!coords || coords.length === 0) {
    globalMsg("There is currently no imaging area with the Earth")
    return
  }

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
