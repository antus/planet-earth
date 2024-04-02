// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.820398, lng: 116.218603, alt: 6483, heading: 22, pitch: -40 }
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

  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.ModelEntity({
    name: "airplane",
    position: [116.239918, 30.879709, 1208],
    style: {
      url: "//data.mars3d.cn/gltf/mars/feiji.glb",
      scale: 2
    }
  })
  graphicLayer.addGraphic(graphic)

  // Start the self-rotation effect
  graphic.rotateStart({
    direction: false, // Control direction, true counterclockwise, false clockwise
    time: 20 // time: given the time required for one flight (in seconds), control the speed
  })

  // setTimeout(() => {
  //   graphic.rotateStop()
  // }, 3000)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.ModelEntity({
    name: "Four Ling Cone",
    position: [116.257665, 30.869372, 1500],
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhui.glb",
      scale: 200,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphic)

  // Start the self-rotation effect
  graphic.rotateStart({
    direction: true, // Control direction, true counterclockwise, false clockwise
    time: 6 // time: given the time required for one flight (in seconds), control the speed
  })
}

function addDemoGraphic3(graphicLayer) {
  const graphicCar = new mars3d.graphic.ModelEntity({
    name: "car",
    position: [116.210938, 30.87518, 613.1],
    style: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      heading: 90,
      minimumPixelSize: 100
    }
  })
  graphicLayer.addGraphic(graphicCar)

  //Move model
  graphicCar.moveTo({
    position: [116.259138, 30.855247, 562],
    orientation: true,
    time: 8 // Duration of movement (unit seconds)
  })
}
