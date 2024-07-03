// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.328888, lng: 110.051238, alt: 6352112, heading: 0, pitch: -78 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "ArcGIS Imagery",
      icon: "img/basemaps/esriWorldImagery.png",
      type: "arcgis_cache",
      url: "//data.mars3d.cn/arcgis_cache/googleVec/_alllayers/{z}/{y}/{x}.jpg",
      upperCase: true, // Identifies whether the image name is uppercase or not
      minimumLevel: 0,
      maximumLevel: 4,
      show: true
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

  map.setCameraView({ lat: 31.427562, lng: 117.193707, alt: 97757, heading: 3, pitch: -66 })

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.ArcGisCacheLayer({
    url: "//data.mars3d.cn/arcgis_cache/hfgh/_alllayers/{z}/{y}/{x}.png",
    upperCase: false,
    minimumLevel: 1,
    maximumLevel: 17,
    minimumTerrainLevel: 1,
    // "maximumTerrainLevel": 17,
    rectangle: { xmin: 116.846, xmax: 117.642, ymin: 31.533, ymax: 32.185 } // Control the slice to be displayed if it is within the rectangular coordinates, and not display if it is not within the rectangular coordinates
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
