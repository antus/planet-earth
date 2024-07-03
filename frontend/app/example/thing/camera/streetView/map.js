// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let streetView

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  streetView = new mars3d.thing.StreetView({
    rotateSpeed: 30, // The degree of movement of right-click dragging, the direction and speed of rotation, and the positive and negative control directions.
    windingPointDirection: false, /// Rotation direction around the point true counterclockwise, false clockwise
    windingPointTime: 30, // The length of one rotation around the point (seconds), controlling the speed.
    windingPointAngle: 360, // Automatically stop after the rotation angle
    heightStep: 0.2, // Raise or lower the camera height ratio, the ratio of the current camera height
    moveStep: 0.1, // The movement ratio of the left-click double-click positioning, the ratio of the current viewing distance
    moveDuration: 3 // The duration of the left-click positioning animation is automatically calculated internally by cesium if not specified.
  })
  map.addThing(streetView)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function shadingMaterials(val) {
  if (val === 1) {
    streetView.enabled = true
  } else {
    streetView.enabled = false
  }
}
