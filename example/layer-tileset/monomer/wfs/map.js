// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.838348, lng: 117.206494, alt: 752, heading: 359, pitch: -54 }
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

  // Three-dimensional model [Currently there is no model in Hefei, the following model is for testing]
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "Hefei National University Science and Technology Park",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 43.7 },
    maximumScreenSpaceError: 1,
    show: true
  })
  map.addLayer(tilesetLayer)

  map.on(mars3d.EventType.load, () => {
    addWfsLayer()
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addWfsLayer() {
  // Single layer [supports geoserver's wfs service configuration dth attribute]
  const wfsLayer = new mars3d.layer.WfsLayer({
    name: "Building Floor",
    url: "//server.mars3d.cn/geoserver/mars/wfs",
    layer: "mars:hfjzw",
    parameters: {
      //Supports all wfs parameters
      maxFeatures: 500
    },
    minimumLevel: 15,
    debuggerTileInfo: false,
    popup: "Name: {NAME}<br />Number of floors: {floor}",
    symbol: {
      type: "polygonP",
      styleOptions: {
        //Single default display style
        color: "rgba(255, 255, 255, 0.01)",
        clampToGround: true,
        classification: true,
        buffer: 2,
        // Singletify the style highlighted after the mouse is moved or clicked
        highlight: {
          // type: mars3d.EventType.click,
          color: "rgba(255,255,0,0.4)"
        }
      }
    },
    show: true
  })
  map.addLayer(wfsLayer)

  // Single layer [also supports arcgis's wfs service configuration dth attribute]
  //  let wfsLayer = new mars3d.layer.ArcGisWfsLayer({
  // name: "Building Floor Vector Layer",
  //   url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/37",
  //   minimumLevel: 15,
  //   debuggerTileInfo: false,
  // popup: "Name: {NAME}<br />Number of floors: {floor}",
  //   symbol: {
  //     type: "polygonP",
  //     styleOptions: {
  // // Single default display style
  //       color: "rgba(255, 255, 255, 0.01)",
  //       clampToGround: true,
  //       classification: true,
  // // Singletify the style highlighted after the mouse is moved or clicked
  //       highlight: {
  //         // type: mars3d.EventType.click,
  //         color: "rgba(255,255,0,0.4)"
  //       }
  //     }
  //   }
  // })
  // map.addLayer(wfsLayer)
}
