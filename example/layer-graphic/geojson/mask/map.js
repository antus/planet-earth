// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.307787, lng: 117.559842, alt: 312871, heading: 0, pitch: -64 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 1000000
    }
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
  // geojson Hefei boundary line
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/areas/340100.json",
    mask: true, // Marked as a mask layer [Key parameters]
    symbol: {
      styleOptions: {
        fill: true,
        color: "rgb(2,26,79)",
        opacity: 0.9,
        outline: true,
        outlineColor: "#39E09B",
        outlineWidth: 8,
        outlineOpacity: 0.8,
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: true
      }
    }
    // flyTo: true
  })
  map.addLayer(geoJsonLayer)

  window.geoJsonLayer = geoJsonLayer
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
