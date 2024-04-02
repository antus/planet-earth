// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 36.468047, lng: 104.069505, alt: 16801717, heading: 0, pitch: -88 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Shanxi Tianmap",
      icon: "img/basemaps/blackMarble.png",
      type: "wmts",
      url: "http://shanxi.tianditu.gov.cn/service/SX_DOM/wmts",
      layer: "WD_DOM",
      format: "image/tile",
      tileMatrixSetID: "Matrix_WD_DOM_1",
      crs: "EPSG:4490",
      proxy: "//server.mars3d.cn/proxy/", // Proxy service to solve cross-domain problems
      show: true
    },
    {
      name: "Single picture",
      icon: "img/basemaps/offline.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg",
      show: false
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
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

  map.setCameraView({ lat: 31.528964, lng: 117.245717, alt: 81718, heading: 0, pitch: -67 })

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.WmtsLayer({
    url: "//server.mars3d.cn/geoserver/gwc/service/wmts",
    layer: "mars:hfgh",
    format: "image/png",
    tileMatrixSetID: "EPSG:4326",
    crs: "EPSG:4326",
    alpha: 0.8,

    pickFeaturesUrl: "//server.mars3d.cn/geoserver/mars/wms",
    popup: "all",
    highlight: {
      type: "wallP",
      diffHeight: 100,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#ffff00",
        speed: 10, // Speed, recommended value range 1-100
        axisY: true
      }
    },

    flyTo: true
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
