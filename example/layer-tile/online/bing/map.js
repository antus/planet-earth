// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.349464, lng: 108.816138, alt: 7733636, heading: 358, pitch: -82 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Bing image",
      icon: "img/basemaps/bingAerial.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.AERIAL,
      key: mars3d.Token.bing,
      show: true
    },
    {
      name: "Bing image (with annotations)",
      icon: "img/basemaps/bingAerialLabels.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.AERIAL_WITH_LABELS,
      key: mars3d.Token.bing
    },
    {
      name: "Bing electronic map",
      icon: "img/basemaps/bingRoads.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.ROAD,
      key: mars3d.Token.bing
    },
    {
      name: "Bing Map 2",
      icon: "img/basemaps/bingRoads.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.ROAD_ON_DEMAND,
      key: mars3d.Token.bing
    },
    {
      name: "Bing light-colored electronics",
      icon: "img/basemaps/bingAerialLabels.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.CANVAS_LIGHT,
      key: mars3d.Token.bing
    },
    {
      name: "Bing Dark Map",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.CANVAS_DARK,
      key: mars3d.Token.bing
    },
    {
      name: "Bing Gray Map",
      icon: "img/basemaps/bingAerialLabels.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.CANVAS_GRAY,
      key: mars3d.Token.bing
    }
  ]
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
  tileLayer = new mars3d.layer.BingLayer({
    layer: Cesium.BingMapsStyle.CANVAS_DARK,
    key: mars3d.Token.bing
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
