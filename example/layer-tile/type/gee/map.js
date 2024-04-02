// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 23.54104, lng: 121.083097, alt: 10219674, heading: 0, pitch: -85 },
    highDynamicRange: false
  },
  terrain: {
    type: "gee",
    url: "http://www.earthenterprise.org/3d",
    // "proxy": "//server.mars3d.cn/proxy/",
    show: true
  },
  basemaps: [
    {
      name: "GEE map",
      icon: "img/basemaps/osm.png",
      type: "gee",
      url: "http://www.earthenterprise.org/3d",
      // "proxy": "//server.mars3d.cn/proxy/",
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

  globalNotify("Known Issue Tips", `(1) You need to deploy your own Google Earth Enterprise Edition service and modify the URL to experience it.`)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
