// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.786828, lng: 117.181704, alt: 3393, heading: 38, pitch: -34 }
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

  map.basemap = 2017 // switch to blue basemap
  // Model
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    style: {
      color: {
        conditions: [
          ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
          ["${height} >= 200", "rgb(102, 71, 151)"],
          ["${height} >= 100", "rgb(170, 162, 204)"],
          ["${height} >= 50", "rgb(224, 226, 238)"],
          ["${height} >= 30", "rgb(252, 230, 200)"],
          ["${height} >= 20", "rgb(248, 176, 87)"],
          ["${height} >= 10", "rgb(198, 106, 11)"],
          ["true", "rgb(127, 59, 8)"]
        ]
      }
    },
    highlight: { type: "click", color: "#FFFF00" },
    popup: [
      { field: "objectid", name: "number" },
      { field: "name", name: "name" },
      { field: "height", name: "building height", unit: "meters" }
    ]
  })
  map.addLayer(tiles3dLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function setStyle1() {
  tiles3dLayer.style = undefined
}

function setStyle2() {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
        ["${height} >= 200", "rgb(102, 71, 151)"],
        ["${height} >= 100", "rgb(170, 162, 204)"],
        ["${height} >= 50", "rgb(224, 226, 238)"],
        ["${height} >= 30", "rgb(252, 230, 200)"],
        ["${height} >= 20", "rgb(248, 176, 87)"],
        ["${height} >= 10", "rgb(198, 106, 11)"],
        ["true", "rgb(127, 59, 8)"]
      ]
    }
  })
}

function selectColor(col) {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", `color("${col}")`]]
    }
  })
}
