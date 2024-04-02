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

  cameraHistory = new mars3d.thing.CameraHistory()
  map.addThing(cameraHistory)

  cameraHistory.on(mars3d.EventType.change, function (data) {
    eventTarget.fire("changeCameraHistory", { data })
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Previous perspective
function lastView() {
  const result = cameraHistory.goLast()

  if (!result) {
    globalMsg("This is the first record")
  }
}
//Next perspective
function nextView() {
  const result = cameraHistory.goNext()
  if (!result) {
    globalMsg("This is the last record")
  }
}

// Return to current perspective
function lastOneView() {
  const result = cameraHistory.goNow()
  if (!result) {
    globalMsg("This is the last record")
  }
}
