// import * as mars3d from "mars3d"
// import FloorGraphic from "./FloorGraphic"

var map // mars3d.Map three-dimensional map object
let floorGraphic

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.832215, lng: 117.219965, alt: 195, heading: 31, pitch: -36 }
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

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //The object code is defined in: js/FloorGraphic.js

  floorGraphic = new FloorGraphic({
    position: [117.220897, 31.833569, 41.1], // Building location
    style: {
      url: "//data.mars3d.cn/gltf/mars/floor/floor.glb",
      heading: 100,

      topUrl: "//data.mars3d.cn/gltf/mars/floor/top.glb", // Roof model
      count: 9, //Total number of floors (excluding roof)
      spacing: 3 //Height of each floor, unit: meters
    }
  })
  graphicLayer.addGraphic(floorGraphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// expand
function openFloorModel() {
  const height = 5 // Height of each expanded layer, unit: meters
  floorGraphic.openAll(height)
}

// merge
function mergeFloorModel() {
  floorGraphic.mergeAll()
}

// restore
function resetModel() {
  floorGraphic.reset()
}

//Floor display
function showFloorModel(floorNum) {
  floorGraphic.showFloor(floorNum)
}
