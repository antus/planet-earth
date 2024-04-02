// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.250697, lng: 121.468373, alt: 1768.9, heading: 116.2, pitch: -30.5 }
  }
}

var tilesetShake
var tiles3dLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2013 // No basemap

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "building",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  tilesetShake = new mars3d.thing.TilesetShake({
    layer: tiles3dLayer,
    positions: [
      [121.48754, 31.237295, 15.1],
      [121.49268, 31.246588, 14.5],
      [121.519515, 31.249963, 2],
      [121.524191, 31.240138, 23.7],
      [121.520988, 31.229589, 30.5],
      [121.50516, 31.220627, 11.6]
    ],
    maxDistance: 5,
    duration: 1200, // duration
    maxHeight: 130
  })
  map.addThing(tilesetShake)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawArea() {
  map.graphicLayer.startDraw({
    type: "polygonP",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.removeGraphic(graphic)

      tilesetShake.positions = positions
    }
  })
}
