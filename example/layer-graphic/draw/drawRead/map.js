// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.609076, lng: 117.292797, alt: 17106, heading: 350, pitch: -51 }
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

  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "marathon",
    url: "//data.mars3d.cn/file/geojson/hefei-marathon.json",
    onCreateGraphic: function (e) {
      const typeP = e.type + "P" // Modify type to primitive type display
      if (mars3d.GraphicType[typeP]) {
        e.type = typeP
      }
      geoJsonLayer.addGraphic(e)
    }
  })
  map.addLayer(geoJsonLayer)
}

//Layer state The layer managed in the component
function getManagerLayer() {
  return map.getLayerByAttr("marathon", "name")
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function startPoint() {
  map.setCameraView({ lat: 31.77566, lng: 117.226039, alt: 413, heading: 47, pitch: -48 })
}

function halfWayPoint() {
  map.setCameraView({ lat: 31.723314, lng: 117.247933, alt: 159, heading: 270, pitch: -31 })
}
function endPoint() {
  map.setCameraView({ lat: 31.712765, lng: 117.294325, alt: 377, heading: 336, pitch: -56 })
}

function allLine() {
  map.setCameraView({ lat: 31.609076, lng: 117.292797, alt: 17106, heading: 350, pitch: -51 })
}
