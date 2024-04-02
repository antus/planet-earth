// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.614035, lng: 117.292184, alt: 25686, heading: 0, pitch: -44 }
  }
}

var treeEvent = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  shoXZM()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// flyTo to target
function flyToEntity(entity) {
  map.flyTo(entity)
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
}

// Example: township noodles
function shoXZM() {
  removeLayer()

  graphicLayer = new mars3d.layer.Shp2JsonLayer({
    url: "http://data.mars3d.cn/file/shp/hefei_xz.zip",
    encoding: "utf-8",
    simplify: { tolerance: 0.0001 },
    symbol: {
      type: "polygon",
      styleOptions: {
        fill: true,
        randomColor: true, // random color
        opacity: 0.3,
        clampToGround: false,
        outline: true,
        outlineStyle: {
          width: 3,
          color: "#FED976"
        },
        // Style when highlighted
        highlight: {
          opacity: 0.6,
          outline: true,
          outlineStyle: {
            width: 10,
            color: "#08F3FE",
            addHeight: 10
          }
        }
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example: elevation points
function shoGCD() {
  removeLayer()

  graphicLayer = new mars3d.layer.Shp2JsonLayer({
    url: "http://data.mars3d.cn/file/shp/yuexi_point.zip",
    symbol: {
      type: "pointP",
      merge: true,
      styleOptions: {
        color: "#ff0000",
        pixelSize: 6,
        addHeight: 500
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}
