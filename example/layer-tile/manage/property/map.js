// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tileLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.601462, lng: 117.246888, alt: 56825, heading: 359, pitch: -69 }
  },
  control: {
    baseLayerPicker: false
  },
  basemaps: [],
  layers: [
    {
      name: "Single picture",
      icon: "img/basemaps/bingmap.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg",
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

  //Add layer
  tileLayer = new mars3d.layer.GaodeLayer({
    layer: "vec",
    brightness: 1, // brightness
    contrast: 1, // contrast
    hue: 0.1, // color
    saturation: 1, // saturation
    gamma: 0.2, // gamma value
    opacity: 1 // transparency
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

/**
 * Parameters change
 * @param {string} attribute changed type
 * @param {number} val changed value
 */
function setLayerOptions(attribute, val) {
  tileLayer[attribute] = val
}
