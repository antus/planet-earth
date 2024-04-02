// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tilesetClip

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.623553, lng: 117.322405, alt: 123536, heading: 359, pitch: -81 }
  },
  control: {
    baseLayerPicker: false
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

  queryTilesetData()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createLayer(layers) {
  return mars3d.LayerUtil.create(layers) // Create layers
}

//Add vector data layer
function addLayer(layer) {
  map.addLayer(layer)
  layer.flyTo()
}

// Uncheck remove layer
function removeLayer(layer) {
  map.removeLayer(layer)
}

// data collection
function queryTilesetData() {
  mars3d.Util.fetchJson({ url: "config/tileset.json" })
    .then(function (arr) {
      const modelData = arr.layers
      eventTarget.fire("loadTypeList", { modelData })
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}
