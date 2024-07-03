// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.931953, lng: 117.352307, alt: 207201, heading: 0, pitch: -64 }
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
  map.basemap = 2013 // No basemap

  globalNotify(
    "Known Issue Tips",
    `(1) When multiple layers are adjusted, they will all be re-rendered;
    (2) Currently, tiles in the EPSG:3857 Web Mercator projection coordinate system are not supported for pasting models. `
  )

  // const graphic = new mars3d.graphic.RectanglePrimitive({
  //   positions: [
  //     [119.474794, 28.442985, 142.6],
  //     [119.478693, 28.43993, 131.1]
  //   ],
  //   style: {
  //     color: Cesium.Color.BLUE,
  //     clampToGround: true
  //   },
  // attr: { remark: "Example 4" }
  // })
  // map.graphicLayer.addGraphic(graphic)

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // Annotation layer
  const tdtLayer = new mars3d.layer.TdtLayer({
    name: "Post model annotation",
    layer: "img_z",
    key: mars3d.Token.tiandituArr,
    crs: mars3d.CRS.EPSG4326,
    clampToTileset: true // key code
  })
  map.addLayer(tdtLayer)
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

  tileLayer = new mars3d.layer.TileInfoLayer({
    name: "tile information",
    clampToTileset: true
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
