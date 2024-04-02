// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let skyline

var mapOptions = {
  scene: {
    center: { lat: 28.441881, lng: 119.482881, alt: 133, heading: 240, pitch: -2 },
    globe: {
      depthTestAgainstTerrain: true
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
  map = mapInstance // record map

  //Add a model for better viewing effect
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    show: true
  })
  map.addLayer(tiles3dLayer)

  skyline = new mars3d.thing.Skyline()
  map.addThing(skyline)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function changeColor() {
  skyline.color = Cesium.Color.fromRandom()
}

function lineWidth(val) {
  skyline.width = val
}

function isVChecked(value) {
  skyline.enabled = value
}
