// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 23.816631, lng: 111.688366, alt: 4605984, heading: 355, pitch: -80 }
  },
  //Method 1: Configure the terrain parameters in the parameters before creating the earth [Currently, 1 ball only supports 1 terrain service]
  terrain: {
    type: "tdt",
    url: "https://t{s}.tianditu.gov.cn/mapservice/swdx",
    key: mars3d.Token.tianditu,
    subdomains: "01234567",
    show: true
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

  globalNotify("Known problem tips", `(1) Use the National Bureau of Surveying and Mapping Tiantu online place name service. (2) If the place name is not displayed, it may be caused by unstable service`)

  // Tianmap 3D place name service layer
  const tdtDmLayer = new mars3d.layer.TdtDmLayer({
    key: mars3d.Token.tianditu,
    label: {
      pixelOffsetY: -20,
      visibleDepth: false
    }
  })
  map.addLayer(tdtDmLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
