// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 21.373802, lng: 105.112505, alt: 12964001, heading: 2, pitch: -85 },
    highDynamicRange: false,
    globe: {
      enableLighting: true
    }
  },
  terrain: false,
  control: {
    terrainProviderViewModels: []
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Single picture",
      icon: "img/basemaps/bingmap.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg"
    },
    {
      name: "Night Picture",
      icon: "img/basemaps/blackMarble.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/night.jpg",
      dayAlpha: 0.0,
      nightAlpha: 1.0,
      brightness: 3.5
    },
    {
      name: "Blue Basemap",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/blue.jpg",
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
    url: "//data.mars3d.cn//file/img/radar/201906211112.PNG",
    rectangle: { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 },
    alpha: 0.7
  })
  map.addLayer(tileLayer)

  // Image loading completion event
  tileLayer.readyPromise.then((layer) => {
    console.log("Image loading completed", layer.image)
  })
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
