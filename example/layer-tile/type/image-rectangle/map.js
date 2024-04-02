// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.scene.center = { lat: 31.839403, lng: 117.257352, alt: 2540, heading: 0, pitch: -90 }

  // Method 1: Configure in the parameters before creating the earth
  option.layers.push({
    name: "University of Science and Technology of China-Eastern District",
    type: "image",
    url: "//data.mars3d.cn/file/img/zkd-dq.png",
    rectangle: { xmin: 117.259691, xmax: 117.267778, ymin: 31.834432, ymax: 31.84387 },
    zIndex: 20,
    show: true
  })

  return option
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  addTileLayer()
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

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.ImageLayer({
    name: "University of Science and Technology of China-Western District",
    url: "//data.mars3d.cn/file/img/zkd-xq.png",
    rectangle: { xmin: 117.245648, xmax: 117.254431, ymin: 31.836891, ymax: 31.843413 },
    zIndex: 20
  })
  map.addLayer(tileLayer)
}

//Remove layer
function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
