// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.587977, lng: 120.714577, alt: 580.9, heading: 4.8, pitch: -56.3 }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/wkt-demo.json" })
    .then(function (json) {
      addWktData(json)
    })
    .catch(function (e) {
      console.log("Loading error", e)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addWktData(arr) {
  const features = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const geojson = getPoint(item)
    if (geojson) {
      features.push(geojson)
    }
  }

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    data: features,
    symbol: {
      styleOptions: {
        randomColor: true,
        outline: true,
        outlineColor: "#ffffff"
      }
    },
    popup: "{name} {type}",
    flyTo: true
  })

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
    const data = event.list
    treeEvent.fire("tree", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })

  map.addLayer(graphicLayer)
}

/**
 * Convert geojson to WKT format
 *
 * @param {object} item all data
 * @return {object} parameters required by the data attribute in the new mars3d.layer.GeoJsonLayer object
 */
function getPoint(item) {
  if (!item.geometry) {
    return null
  }

  const geojson = Terraformer.WKT.parse(item.geometry) // WKT format conversion geojson

  return {
    type: "Feature",
    geometry: geojson,
    properties: item
  }
}
