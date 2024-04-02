// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.83251, lng: 117.221054, alt: 183, heading: 355, pitch: -48 }
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

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/max-fcfh/tileset.json",
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)

    // tiles3dLayer.tileset._selectedTiles[0].transform = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(100, 0, 0))
    // Cesium.Matrix4.multiply(temp1.transform, Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(100, 0, 0)), temp1.transform)

    const attr = event.graphic.attr
    if (attr) {
      tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ["${name} ==='" + attr.name + "'", "rgb(255, 255, 255)"],
            ["true", "rgba(255, 255, 255,0.03)"]
          ]
        }
      })
    }
  })

  map.on(mars3d.EventType.clickMap, function (event) {
    tiles3dLayer.style = undefined
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
