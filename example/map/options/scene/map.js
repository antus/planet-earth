// import * as mars3d from "mars3d"

var map

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.772952, lng: 82.609338, alt: 22604251, heading: 0, pitch: -90 }
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

  // 2 You can also obtain the center parameter through the following method
  const center = map.getCameraView()
  console.log("center parameter is", JSON.stringify(center))

  //You can switch the perspective through centerAt
  map.setCameraView(center)
}

// View switching
function sceneMode(name) {
  const value = Number(name)
  setSceneOptions("sceneMode", value)
}

function setSceneOptions(name, value) {
  const options = {}
  options[name] = value

  console.log("Updated map parameters", options)
  map.setSceneOptions(options)
}

function setSceneGlobeOptions(name, value) {
  const options = { globe: {} }
  options.globe[name] = value

  console.log("Updated map parameters", options)
  map.setSceneOptions(options)
}

function setSceneCameraControllerOptions(name, value) {
  const options = { cameraController: {} }
  options.cameraController[name] = value

  console.log("Updated map parameters", options)
  map.setSceneOptions(options)

  if (name === "constrainedAxis" && value === true) {
    map.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z
  }
}

// Whether to display the base map
function showBaseMap(val) {
  if (val === "1") {
    map.basemap = 2021
  } else {
    map.basemap = undefined
  }
}
