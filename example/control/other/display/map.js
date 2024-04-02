// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  control: {
    homeButton: {
      icon: "/img/svg/homeButton.svg"
    },
    fullscreenButton: {
      icon: "/img/svg/fullscreen.svg"
    },
    navigationHelpButton: {
      icon: "/img/svg/navigationHelp.svg"
    },
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: "gaode",
    baseLayerPicker: true,
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    distanceLegend: { left: "100px", bottom: "25px" },
    compass: { top: "10px", left: "5px" }
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
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  const control = map.getControl("navigationHelpButton", "type")
  control.on(mars3d.EventType.click, function (event) {
    console.log("You clicked the help button", event)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// button
function bindPOI(val) {
  map.controls.geocoder.show = val
}

//Reset angle of view
function bindView(val) {
  map.controls.homeButton.show = val
}

//Basic map switching
function bindBaseLayerPicker(val) {
  map.controls.baseLayerPicker.show = val
}

// switch to full screen
function bindFullScreen(val) {
  map.controls.fullscreenButton.show = val
}

// VR
function bindVR(val) {
  map.controls.vrButton.show = val
}

// help button
function bindHelpButton(val) {
  map.controls.navigationHelpButton.show = val
}

// Switch between 2D and 3D
function bindSceneModePicker(val) {
  map.controls.sceneModePicker.show = val
}

function bindZoom(val) {
  map.controls.zoom.show = val
}

//Panel:
//Information status bar
function bindLocation(val) {
  map.controls.locationBar.show = val
}

// clock
function bindClock(val) {
  map.controls.clockAnimate.show = val
}

// time tick mark
function bindTimeLine(val) {
  map.controls.timeline.show = val
}

// Navigation ball
function bindNav(val) {
  map.controls.compass.show = val
}

//scale
function bindLegend(val) {
  map.controls.distanceLegend.show = val
}

//Layer
function bindLayer(val) {
  document.getElementById("mars-manage-layer-btn").style.display = val ? "inline-block" : "none"
}
