// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

var mapOptions = {
  scene: {
    center: { lat: 31.794547, lng: 117.21215, alt: 1672, heading: 18, pitch: -33 }
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
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  // Cesium has a unified interface for resource access. Whether loading images, vectors, terrains, or models globally, unified requests must be made through the Cesium.Resource module. Here, the judgment of accessing the indexDB cache during the resource request is implemented through the plug-in.
  // eslint-disable-next-line no-undef
  const OfflineCache = CesiumNetworkPlug.OfflineCacheController

  // ① Global cache
  // OfflineCache.ruleList.add("*")
  // ② Cache the tile layer at the specified address
  OfflineCache.ruleList.add("http://data.mars3d.cn/")
  OfflineCache.ruleList.add("https://gac-geo.googlecnapps.cn/")

  // For the data encryption function in the CesiumNetworkPlug plug-in, please refer to: https://github.com/WangShan010/CesiumNetworkPlug

  globalMsg("Please F12 to check the network request status")

  //Add model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
