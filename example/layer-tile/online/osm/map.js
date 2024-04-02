// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 },
    highDynamicRange: false
  }
  // Method 1: Configure in the parameters before creating the earth
  // basemaps: [
  //   {
  // name: "OSM Open Source Map",
  //     icon: "img/basemaps/osm.png",
  //     type: "osm",
  //     show: true
  //   }
  // ]
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

  // OSM official website: http://openstreetmap.org/
  globalNotify(
    "Known Issue Tips",
    `For example, if the layer is not displayed or the service URL access times out, it is because the national surveying and mapping authorities currently block foreign map services that have not been reviewed and approved.
     You can use it if you need to circumvent the firewall or refer to the sample code to replace the local service address. `
  )
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
  tileLayer = new mars3d.layer.OsmLayer({
    layer: "OSM open source map",
    type: "osm"
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
