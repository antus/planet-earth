// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.791477, lng: 116.348231, alt: 6351, heading: 10, pitch: -36 }
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

  globalNotify("Known Issue Tips", "(1) When deleting a single data, Cesium will occasionally delete 2 data internally")

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CloudPrimitive({
    position: [116.353072, 30.859836, 2000],
    style: {
      scale: new Cesium.Cartesian2(5500, 1000),
      maximumSize: new Cesium.Cartesian3(50, 15, 13),
      slice: 0.3,
      label: {
        text: "I am a cloud from Mars",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 90000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CloudPrimitive({
    position: [116.332891, 30.856537, 1500],
    style: {
      scale: new Cesium.Cartesian2(3500, 800),
      maximumSize: new Cesium.Cartesian3(50, 12, 15),
      slice: 0.36
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CloudPrimitive({
    position: [116.371649, 30.851072, 1389],
    style: {
      scale: new Cesium.Cartesian2(5000, 1000),
      maximumSize: new Cesium.Cartesian3(50, 12, 15),
      slice: 0.49
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CloudPrimitive({
    position: new mars3d.LngLatPoint(116.350075, 30.848636, 1500),
    style: {
      scale: new Cesium.Cartesian2(2300, 900),
      maximumSize: new Cesium.Cartesian3(13, 13, 13),
      slice: 0.2
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

// Generate test data in batches
function addRandomGraphicByCount(num) {
  graphicLayer.clear()

  for (let j = 0; j < num; ++j) {
    const position = randomPoint()
    const scaleX = getRandomNumberInRange(500, 2000)
    const scaleY = scaleX / 2.0 - getRandomNumberInRange(0, scaleX / 4.0)
    const depth = getRandomNumberInRange(30, 50)
    const aspectRatio = getRandomNumberInRange(1.5, 2.1)
    const cloudHeight = getRandomNumberInRange(5, 20)

    const graphic = new mars3d.graphic.CloudPrimitive({
      position,
      style: {
        scale: new Cesium.Cartesian2(scaleX, scaleY),
        maximumSize: new Cesium.Cartesian3(aspectRatio * cloudHeight, cloudHeight, depth),
        slice: getRandomNumberInRange(0.2, 0.6)
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}

// Get random points in the area
function randomPoint() {
  const jd = getRandomNumberInRange(116.29 * 1000, 116.39 * 1000) / 1000
  const wd = getRandomNumberInRange(30.8 * 1000, 30.88 * 1000) / 1000
  const height = getRandomNumberInRange(2000, 4000)
  return new mars3d.LngLatPoint(jd, wd, height)
}

function getRandomNumberInRange(minValue, maxValue) {
  return minValue + Cesium.Math.nextRandomNumber() * (maxValue - minValue)
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "cloud",
    style: {
      scale: new Cesium.Cartesian2(2300, 900),
      maximumSize: new Cesium.Cartesian3(13, 13, 13),
      slice: 0.2
    }
  })
}
