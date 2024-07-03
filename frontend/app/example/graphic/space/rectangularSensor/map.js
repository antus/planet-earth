// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 30.834006, lng: 118.779512, alt: 306743, heading: 313, pitch: -58 },
    cameraController: {
      constrainedAxis: false
    }
  },
  control: {
    sceneModePicker: false
  }
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  globalNotify("Known problem prompt", `This vector object does not support picking`)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add demo data
  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const rectangularSensor = new mars3d.graphic.RectangularSensor({
    position: [117.218875, 31.817812, 138],
    style: {
      heading: 30,
      pitch: 0,
      roll: 0,

      radius: 100000, // Radius of the sensor
      xHalfAngleDegree: 50, // Sensor horizontal half angle
      yHalfAngleDegree: 50, // Sensor vertical half angle

      color: "rgba(0,255,255,0.4)",
      lineColor: "#ffffff", // line color

      showScanPlane: true, // Whether to display the scan plane
      scanPlaneColor: "rgba(0,255,255,0.9)",
      scanPlaneMode: "vertical", //Scan plane mode vertical/horizontal
      scanPlaneRate: 3, //Scan rate,
      depthTest: true
    }
  })
  graphicLayer.addGraphic(rectangularSensor)

  //Add a model
  const model = new mars3d.graphic.ModelPrimitive({
    name: "Ground station model",
    position: [117.218875, 31.817812, 138],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 50,
      heading: 30,
      pitch: 0,
      roll: 0,
      minimumPixelSize: 40
    },
    fixedFrameTransform: rectangularSensor.fixedFrameTransform
  })
  graphicLayer.addGraphic(model)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.RectangularSensor({
      position,
      style: {
        radius: result.radius, // Radius of the sensor
        xHalfAngleDegree: 50, // Sensor horizontal half angle
        yHalfAngleDegree: 50, // Sensor vertical half angle
        color: "#00ffff",
        opacity: 0.4,
        lineColor: "#ffffff", // line color
        showScanPlane: false, // Whether to display the scan plane
        depthTest: true
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
  graphicLayer.startDraw({
    type: "rectangularSensor",
    style: {
      heading: 0,
      pitch: 0,
      roll: 0,

      radius: 10000, // Radius of the sensor
      xHalfAngleDegree: 50, // Sensor horizontal half angle
      yHalfAngleDegree: 50, // Sensor vertical half angle

      color: "rgba(0,255,255,0.4)",
      lineColor: "#ffffff", // line color

      showScanPlane: true, // Whether to display the scan plane
      scanPlaneColor: "rgba(0,255,255,0.9)",
      scanPlaneMode: "vertical", //Scan plane mode vertical/horizontal
      scanPlaneRate: 3, //Scan rate,
      depthTest: true
    }
  })
}
