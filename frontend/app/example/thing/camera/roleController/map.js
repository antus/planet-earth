/**
 * This example was developed by Liu Bofang,
 * Open source address: https://github.com/ShareQiu1994/CesiumRoleController/
 */
// import * as mars3d from "mars3d"
// import { CesiumRoleController } from "./CesiumRoleController.js"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.839441, lng: 117.153132, alt: 857.4, heading: 5, pitch: -28.3 }
  }
}

let controller // controller

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  controller = new CesiumRoleController(mars3d.Cesium, map.viewer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function startController() {
  map.setCursor("crosshair")

  map.once("click", (event) => {
    map.setCursor("default")
    initController(event.cartesian)
  })
}

function stopController() {
  controller.destroy()
}

function initController(position) {
  const point = mars3d.LngLatPoint.fromCartesian(position) // Convert to latitude and longitude
  controller.init({
    position: [point.lng, point.lat],
    url: "//data.mars3d.cn/gltf/mars/man/running.glb",
    animation: "run",
    lockViewLevel: 1,
    pitch: -25,
    speed: 2,
    range: 300.0
  })
}
