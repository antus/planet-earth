// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  layers: [
    {
      type: "geojson",
      name: "Sample data",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "Test Model",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
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

  map.on(mars3d.EventType.load, function (event) {
    console.log(`All map layers loaded`)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  destroyMap()
}

function createMap() {
  if (map) {
    globalMsg("The map already exists, please do not create it again!")
    return map
  }
  map = new mars3d.Map("mars3dContainer", mapOptions)

  return map
}

function destroyMap() {
  if (!map) {
    globalMsg("The map has been destroyed, no need to destroy it again!")
    return
  }
  map.destroy()
  map = null
}
