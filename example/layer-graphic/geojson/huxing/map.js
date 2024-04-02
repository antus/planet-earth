// import * as mars3d from "mars3d"
// import { HuxingLayer } from "./HuxingLayer.js"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.820474, lng: 117.178655, alt: 326, heading: 24, pitch: -45 }
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

  // The HuxingLayer class is defined in HuxingLayer.js
  graphicLayer = new HuxingLayer({
    url: "//data.mars3d.cn/file/geojson/huxing.json"
  })
  map.addLayer(graphicLayer)

  // You can bind the Popup window and handle it arbitrarily in the callback method.
  // layer.bindPopup(function (event) {
  //   let item = event.graphic.attr;
  //   if (!item) {
  //     return false;
  //   }
  //   return mars3d.Util.getTemplateHtml({
  // title: "Building",
  //     attr: item,
  //     template: [
  // { field: "CH", name: "Layer number" },
  // { field: "DYH", name: "Unit" },
  // { field: "FH", name: "Room number" },
  // { field: "WZ", name: "Location" },
  //     ],
  //   });
  // });
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
