// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let terrainPlanClip

var mapOptions = {
  scene: {
    center: { lat: 31.840043, lng: 117.21586, alt: 554, heading: 0, pitch: -59 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  globalNotify("Known problem tips", `Because the clippingPlanes interface is used, when drawing polygons, there will be incorrect effects when partially enclosing angles`)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addLayer(height) {
  // Pipe network model layer
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Underground Pipe Network",
    url: "//data.mars3d.cn/3dtiles/max-piping/tileset.json",
    position: { lng: 117.215457, lat: 31.843363, alt: -3.6 },
    rotation: { z: 336.7 },
    maximumScreenSpaceError: 2,
    highlight: { type: "click", color: "#00FFFF" },
    popup: "all",
    center: { lat: 31.840525, lng: 117.217024, alt: 495.12, heading: 0, pitch: -59.3, roll: 0 }
  })
  map.addLayer(tilesetLayer)

  terrainPlanClip = new mars3d.thing.TerrainPlanClip({
    positions: [
      [117.214491, 31.841736, 42.83],
      [117.21764, 31.841736, 42.83],
      [117.21764, 31.843807, 42.83],
      [117.214491, 31.843807, 42.83]
    ],
    diffHeight: height, //The depth of the well
    image: "img/textures/poly-stone.jpg", // Boundary wall material
    imageBottom: "img/textures/poly-soil.jpg", // Bottom area material
    splitNum: 50 // Well boundary interpolation number
  })
  map.addThing(terrainPlanClip)
}

// Whether to dig the ground
function chkClippingPlanes(val) {
  terrainPlanClip.enabled = val
}

// Whether to cut outside
function chkUnionClippingRegions(val) {
  terrainPlanClip.clipOutSide = val
}

// Whether to detect depth
function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}

//Change the depth of the cut
function changeClipHeight(val) {
  terrainPlanClip.diffHeight = val
}

// add rectangle
function btnDrawExtent() {
  terrainPlanClip.clear() // Clear the excavation area

  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      // Digging area
      terrainPlanClip.positions = positions
    }
  })
}

//Add polygon
function btnDraw() {
  terrainPlanClip.clear() // Clear the excavation area

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      // Digging area
      terrainPlanClip.positions = positions
    }
  })
}
// clear
function removeAll() {
  terrainPlanClip.clear() // Clear the excavation area
}
