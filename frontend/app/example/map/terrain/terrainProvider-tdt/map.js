// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Map API: http://lbs.tianditu.gov.cn/server/MapService.html

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  terrain: false
  //Method 1: Configure the terrain parameters in the parameters before creating the earth [Currently, 1 ball only supports 1 terrain service]
  // terrain: {
  //   type: "tdt",
  //   url: "https://t{s}.tianditu.gov.cn/mapservice/swdx",
  //   key: mars3d.Token.tianditu,
  //   subdomains: "01234567",
  //   show: true,
  // },
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Method 2: Update terrainProvider after creating the earth
  map.terrainProvider = new mars3d.provider.TdtTerrainProvider({
    url: "https://t{s}.tianditu.gov.cn/mapservice/swdx",
    key: mars3d.Token.tianditu,
    subdomains: "01234567"
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to enable triangulation network
function checkedTriangulation(enabled) {
  map.scene.globe._surface.tileProvider._debug.wireframe = enabled // triangle network
}
