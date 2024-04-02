// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayerDTH

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

  //Add 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "campus",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 279.0 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  //Create a single layer
  tiles3dLayerDTH = new mars3d.layer.TilesetLayer({
    name: "School-Single",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao-dth/tileset.json",
    position: { alt: 217 },
    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    style: {
      color: {
        conditions: [
          ["${thisFloor} ===1", "rgba(7, 184, 134, 0.3)"],
          ["${thisFloor} ===2", "rgba(224, 148, 18, 0.3)"],
          ["${thisFloor} ===3", "rgba(15, 212, 186, 0.3)"],
          ["${thisFloor} ===4", "rgba(15, 134, 214, 0.3)"],
          ["${thisFloor} ===5", "rgba(204, 14, 191, 0.3)"],
          ["true", "rgba(255, 255, 0,0.3)"]
        ]
      }
    },
    maximumScreenSpaceError: 1,
    highlight: {
      type: mars3d.EventType.click,
      color: "#00ff00",
      opacity: 0.4
    },
    popup: "Room number: {name}<br/>Floor: {thisFloor} floor (total {allFloor} floors)<br/>Class: {remark}<br/>Description: Teaching building"
  })
  map.addLayer(tiles3dLayerDTH)

  tiles3dLayerDTH.on(mars3d.EventType.click, function (event) {
    console.log("Model single clicked", event.graphic?.attr)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Color display of each layer
function chkShowColor(val) {
  if (val) {
    tiles3dLayerDTH.style = {
      color: {
        conditions: [
          ["${thisFloor} ===1", "rgba(7, 184, 134, 0.3)"],
          ["${thisFloor} ===2", "rgba(224, 148, 18, 0.3)"],
          ["${thisFloor} ===3", "rgba(15, 212, 186, 0.3)"],
          ["${thisFloor} ===4", "rgba(15, 134, 214, 0.3)"],
          ["${thisFloor} ===5", "rgba(204, 14, 191, 0.3)"],
          ["true", "rgba(255, 255, 0,0.3)"]
        ]
      }
    }
  } else {
    tiles3dLayerDTH.style = {
      color: "rgba(255, 255, 255, 0.01)"
    }
  }
}
