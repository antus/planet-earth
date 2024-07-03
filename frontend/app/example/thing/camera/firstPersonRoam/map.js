// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let firstPersonRoam

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.929546, lng: 116.172289, alt: 559, heading: 168, pitch: -11 }
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

  firstPersonRoam = new mars3d.thing.FirstPersonRoam()
  map.addThing(firstPersonRoam)

  firstPersonRoam.startAutoForward()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to enable roaming
function chkOpen(value) {
  firstPersonRoam.enabled = value
}

// Start automatic roaming
function startAuto() {
  firstPersonRoam.startAutoForward()
}

// Stop automatic roaming
function stopAuto() {
  firstPersonRoam.stopAutoForward()
}
