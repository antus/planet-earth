// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 14.741847, lng: 108.420914, alt: 10003793, heading: 0, pitch: -83 }
  },
  basemaps: [
    {
      pid: 10,
      name: "Satellite Map",
      type: "xyz",
      icon: "img/basemaps/mapboxSatellite.png",
      url: "//data.mars3d.cn/tile/googleImg/{z}/{x}/{y}.jpg",
      minimumLevel: 0,
      maximumLevel: 12,
      show: true
    },
    {
      pid: 10,
      name: "Single picture",
      icon: "img/basemaps/offline.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg"
    }
  ],
  layers: [
    {
      name: "Satellite Annotation",
      type: "xyz",
      url: "//data.mars3d.cn/tile/tdtImgZj/{z}/{x}/{y}.png",
      minimumLevel: 0,
      maximumLevel: 12,
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
  map = mapInstance
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
