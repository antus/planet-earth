// import * as mars3d from "mars3d"

var map

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 50.096737, lng: 8.670794, alt: 1148.6, heading: 28.9, pitch: -44.9 }
  },
  terrain: false
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.
  // map.basemap = "ArcGIS Imagery"

  globalNotify(
    "Known Issue Tips",
    `For example, if the layer is not displayed or the service URL access times out, it is because the national surveying and mapping authorities currently block foreign map services that have not been reviewed and approved.
     You can use it if you need to circumvent the firewall or refer to the sample code to replace the local service address. `
  )

  showNewYorkDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  removeLayer()
  map = null
}
let i3sLayer

function removeLayer() {
  if (i3sLayer) {
    map.removeLayer(i3sLayer, true)
    i3sLayer = null
  }
}

// Example:
function showNewYorkDemo() {
  removeLayer()

  i3sLayer = new mars3d.layer.I3SLayer({
    name: "New York",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/NYC_Attributed_v17/SceneServer",
    geoidTiledTerrainProvider: {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/EGM2008/ImageServer"
    },
    traceFetches: false, // for tracing I3S fetches
    skipLevelOfDetail: false,
    debugShowBoundingVolume: false,
    center: { lat: 40.710975, lng: -74.023923, alt: 768.9, heading: 93.3, pitch: -23.3 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(i3sLayer)

  i3sLayer.on(mars3d.EventType.load, function (event) {
    console.log("I3S layer loading completed", event)
  })

  // click event
  i3sLayer.on(mars3d.EventType.click, function (event) {
    console.log("I3S layer clicked", event)
  })
}

function showSanFranciscoDemo() {
  removeLayer()

  i3sLayer = new mars3d.layer.I3SLayer({
    name: "San Francisco",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
    // geoidTiledTerrainProvider: {
    //   url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/EGM2008/ImageServer"
    // },
    skipLevelOfDetail: false,
    debugShowBoundingVolume: false,
    flyTo: true
  })
  map.addLayer(i3sLayer)
}

function showFrankfurtDemo() {
  removeLayer()

  i3sLayer = new mars3d.layer.I3SLayer({
    name: "Frankfurt",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Frankfurt2017_vi3s_18/SceneServer/layers/0",
    skipLevelOfDetail: false,
    debugShowBoundingVolume: false,
    flyTo: true
  })
  map.addLayer(i3sLayer)
}
