// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.842449, lng: 117.251173, alt: 144, heading: 4, pitch: -35 }
  },
  mouse: {
    pickLimit: 99 //The maximum number of components picked by mouse penetration
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

  // Model
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Teaching Building",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    highlight: {
      type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
      color: "#00FF00"
      // uniqueKey: "id"
    },
    // Whether to allow mouse penetration picking
    allowDrillPick: function (event) {
      const alpha = event?.pickedObject?.color?.alpha
      if (Cesium.defined(alpha) && alpha !== 1) {
        return true // The mouse does not pick up transparent components blocked in front, but penetrates and picks up opaque components behind them.
      }
      return false
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)
  showCengByStyle("F5")
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Display the entire building
function showAll() {
  tiles3dLayer.style = undefined
}
// Negative layer
function minusOne() {
  showCengByStyle("B1")
}

//Layer 1~5
function show(num) {
  const floor = "F" + num
  showCengByStyle(floor)
}

// API: http://mars3d.cn/api/TilesetLayer.html#style
// Description: https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling

function showCengByStyle(ceng) {
  tiles3dLayer.closeHighlight()
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${elevation} ==='" + ceng + "' || ${bottom constraint} ==='" + ceng + "'", "rgb(255, 255, 255)"],
        ["true", "rgba(255, 255, 255,0.03)"]
      ]
    }
  })
}
