// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.77185, lng: 117.235049, alt: 18176, heading: 0, pitch: -69 }
  }
}
let mapSplit

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = "Amap Electronics"

  mapSplit = new mars3d.control.MapSplit({})
  map.addControl(mapSplit)

  addTileLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// overlaid layers
let tileLayer
function addTileLayer() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.GaodeLayer({
    layer: "vec",
    invertColor: true, // Invert color color.r = 1.0 - color.r
    filterColor: "#4e70a6", // Filter color color.r = color.r * filterColor.r
    brightness: 0.6,
    contrast: 1.8,
    gamma: 0.3,
    hue: 1,
    saturation: 0
  })
  map.addLayer(tileLayer)

  mapSplit.setLayerSplitDirection(tileLayer, Cesium.SplitDirection.RIGHT) // Split-screen rolling shutter for the model
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

function setFilterColor(color) {
  if (tileLayer) {
    tileLayer.layer.filterColor = Cesium.Color.fromCssColorString(color)
  }
}
