// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let underground
let terrainPlanClip

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.839437, lng: 117.216104, alt: 554, heading: 359, pitch: -55 },
    baseColor: "rgba(0,0,0.0,0.5)",
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

  //Add a model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Underground Pipe Network",
    url: "//data.mars3d.cn/3dtiles/max-piping/tileset.json",
    position: { lng: 117.215457, lat: 31.843363, alt: -3.6 },
    rotation: { z: 336.7 },
    maximumScreenSpaceError: 2,
    highlight: { type: "click", outlineEffect: true, width: 8, color: "#FFFF00" },
    popup: "all",
    center: { lat: 31.838081, lng: 117.216584, alt: 406, heading: 1, pitch: -34 }
  })
  map.addLayer(tiles3dLayer)

  terrainClips(30)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function centerAtDX1() {
  map.setCameraView({
    lat: 31.840106,
    lng: 117.216768,
    alt: 554.36,
    heading: 0,
    pitch: -59.3,
    roll: 0
  })
}

function centerAtDX2() {
  map.setCameraView({
    lat: 31.841263,
    lng: 117.21538,
    alt: -13.35,
    heading: 40.6,
    pitch: 15.7,
    roll: 0.1
  })
}

// Whether to enable underground mode
function chkUnderground(val, alphaVal) {
  // underground mode
  if (!underground) {
    underground = new mars3d.thing.Underground({
      alpha: alphaVal,
      enabled: val
    })
    map.addThing(underground)
  }

  underground.enabled = val
}

//Transparency changes
function alphaChange(value) {
  if (underground) {
    underground.alpha = value
  }
}
// Whether to excavate
function chkClippingPlanes(val) {
  terrainPlanClip.enabled = val
}

function terrainClips(heightVal) {
  // Digging area
  terrainPlanClip = new mars3d.thing.TerrainClip({
    diffHeight: heightVal, // height
    exact: true,
    image: "./img/textures/poly-stone.jpg",
    imageBottom: "./img/textures/poly-soil.jpg",
    splitNum: 50 // Well boundary interpolation number
  })
  map.addThing(terrainPlanClip)

  terrainPlanClip.addArea([
    [117.214769, 31.842048, 42.63],
    [117.217764, 31.842048, 42.63],
    [117.217764, 31.843312, 42.63],
    [117.214769, 31.843312, 42.63]
  ])
}

function heightChange(num) {
  terrainPlanClip.diffHeight = num
}

// draw rectangle
function drawExtent() {
  terrainPlanClip.clear()

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
      terrainPlanClip.addArea(positions)
    }
  })
}

// draw polygon
function drawPolygon() {
  terrainPlanClip.clear()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      // Digging area
      terrainPlanClip.addArea(positions)
    }
  })
}

function clearWJ() {
  terrainPlanClip.clear() // Clear the excavation area
}

function distanceChange(value) {
  terrainPlanClip.distance = value
}
