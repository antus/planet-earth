// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 14.132213, lng: 107.948167, alt: 14854603, heading: 2, pitch: -89 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  // Jingwei.com
  const tileLayer = new mars3d.layer.GraticuleLayer({
    steps: [0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0],
    lineStyle: {
      color: "#fff",
      height: 1000
    }
    // labelStyle: {
    //   color: "#ffff00",
    //   pixelOffset: new Cesium.Cartesian2(0, 0)
    // }
  })
  map.addLayer(tileLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
