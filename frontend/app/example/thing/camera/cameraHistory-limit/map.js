// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let cameraHistory

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  cameraHistory = new mars3d.thing.CameraHistory({
    limit: {
      //Limit the viewing angle range
      position: Cesium.Cartesian3.fromDegrees(117.27462, 31.864196, 34.85),
      radius: 5000.0,
      debugExtent: true
    },
    maxCacheCount: 999
  })
  map.addThing(cameraHistory)

  cameraHistory.on(mars3d.EventType.change, function (event) {
    // Trigger custom event
    const count = event.count
    eventTarget.fire("changeCamera", { count })
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to enable limited range
function chkUnderground(val) {
  cameraHistory.debugExtent = val
}
