// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let geoJsonLayerDTH

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 43.823957, lng: 125.136704, alt: 286, heading: 11, pitch: -24 }
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

  // Model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2030,
    type: "3dtiles",
    name: "campus",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 279.0 },
    maximumScreenSpaceError: 1,
    center: { lat: 43.821193, lng: 125.143124, alt: 990, heading: 342, pitch: -50 }
  })
  map.addLayer(tiles3dLayer)

  //Create a single layer
  geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer({
    name: "stratified household unitization",
    url: "//data.mars3d.cn/file/geojson/dth-xuexiao-fcfh.json",
    onCreateGraphic: createDthGraphic // Customized parsing data
  })
  map.addLayer(geoJsonLayerDTH)

  geoJsonLayerDTH.bindPopup((e) => {
    const item = e.graphic.attr
    const html = `Room number: ${item.name}<br/>
                Floor: ${item.thisFloor} (total ${item.allFloor})<br/>
                Class: ${item.remark}<br/>
                Description: Teaching building`
    return html
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to display individual account colors
function chkShowColor(val) {
  geoJsonLayerDTH.closePopup()
  if (val) {
    geoJsonLayerDTH.eachGraphic((graphic, index) => {
      graphic.setStyle({
        opacity: 0.2
      })
    })
  } else {
    geoJsonLayerDTH.eachGraphic((graphic) => {
      graphic.setStyle({
        opacity: 0.01
      })
    })
  }
}

//Add singleton vector object
function createDthGraphic(options) {
  const points = options.positions // Coordinates of each vertex
  const attr = options.attr // Floor height configuration information

  const minHight = attr.bottomHeight // Bottom altitude of the current layer
  const maxHight = attr.topHeight // Top altitude of the current layer

  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: points,
    style: {
      height: minHight,
      extrudedHeight: maxHight,
      //Single default display style
      color: getColor(),
      opacity: 0.3,
      classification: true,
      // Singletify the style highlighted after the mouse is moved or clicked
      highlight: {
        type: mars3d.EventType.click,
        color: "#ffff00",
        opacity: 0.6
      }
    },
    attr
  })
  geoJsonLayerDTH.addGraphic(graphic)
}

// color
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}
