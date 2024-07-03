// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 22.149271, lng: 116.950247, alt: 1062553.8, heading: 359.5, pitch: -50.6 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance

  globalNotify("Prompt", `CSS: transform: scale(2); has been set for DIV.`)

  const layer = new mars3d.layer.GraphicLayer()
  map.addLayer(layer)

  const point = new mars3d.graphic.PointPrimitive({
    position: [116.337407, 30.977153, 10],
    popup: "This is a point",
    style: {
      pixelSize: 12,
      color: "#ff0000",
      label: {
        text: "Please click",
        font_size: 14,
        horizontalOrigin: mars3d.Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: mars3d.Cesium.VerticalOrigin.CENTER,
        pixelOffsetX: 16
      }
    }
  })
  layer.addGraphic(point)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
