// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.623244, lng: 123.508771, alt: 345435, heading: 0, pitch: -48 }
    // cameraController: {
    //   maximumZoomDistance: 500000000,
    // },
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true,
    compass: { top: "10px", left: "5px" }
  }
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  // url passes in the model address
  const type = mars3d.Util.getRequestByName("data")
  switch (type) {
    case "feiji":
      showAircraft()
      break
    case "chuanbo":
      showShip()
      break
    case "huojian":
      showRocket()
      break
    default:
      showAircraft()
      break
  }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
}

// Example:
function showCar() {
  removeLayer()

  map.setCameraView({ lat: 40.893923, lng: 121.917192, alt: 691, heading: 64, pitch: -46 })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "car",
    url: "//data.mars3d.cn/file/czml/car.czml"
    // flyTo: true,
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showAircraft() {
  removeLayer()

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "Flight Formation",
    url: "//data.mars3d.cn/file/czml/flight2.czml",
    popup: "all"
    // flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showShip() {
  removeLayer()

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "ship formation",
    url: "//data.mars3d.cn/file/czml/ship2.czml",
    popup: "all"
    // flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showBDSatellite() {
  removeLayer()

  map.setCameraView({ lat: 51.630551, lng: 165.640607, alt: 110141973.7, heading: 360, pitch: -89.9 })

  //Update earth parameters
  map.setSceneOptions({
    cameraController: {
      maximumZoomDistance: 500000000
    }
  })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "Beidou Satellite",
    url: "//data.mars3d.cn/file/czml/satellite.czml",
    center: { lng: 10, lat: 111.833884, z: 150000000, heading: 0, pitch: -90, roll: 0 }
    // flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)

    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

function showSatellite() {
  removeLayer()

  //Update earth parameters
  map.setSceneOptions({
    cameraController: {
      maximumZoomDistance: 500000000
    }
  })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "satellite",
    url: "//data.mars3d.cn/file/czml/satellite-simple.czml",
    center: { lat: -20.236138, lng: -144.262661, alt: 41875827, heading: 339, pitch: -90 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)

    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showRocket() {
  removeLayer()

  map.basemap = "ArcGIS Imagery"
  map.setCameraView({ lat: 28.561843, lng: -80.577575, alt: 630, heading: 359, pitch: -85 })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "Rocket Launch",
    url: "//data.mars3d.cn/file/czml/space.czml",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)
    // When Mars is launched, lock the rocket model object
    map.trackedEntity = data.dataSource.entities.getById("Vulcan")

    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showFireDrill() {
  removeLayer()

  map.setCameraView({ lat: 32.891559, lng: 117.360875, alt: 378, heading: 18, pitch: -62 })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "Fire Drill",
    url: "//data.mars3d.cn/file/czml/firedrill.czml"
    // flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("Data loading completed", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}
