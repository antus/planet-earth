// import * as mars3d from "mars3d"

var map
let graphic

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 25.389914, lng: 119.084961, alt: 1179575, heading: 346, pitch: -60 }
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
  map.camera.percentageChanged = 0.01

  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphic = new mars3d.graphic.EllipsoidEntity({
    position: [107.39956, 29.719738, 100.9],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      maximumConeDegree: 90, // hemisphere
      fill: false,
      subdivisions: 64,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: "#ffff00",

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        outlineColor: "#ff0000"
      }
    },
    //Add scanning surface
    scanPlane: {
      step: 0.5, // step size
      style: {
        color: "#ffff00",
        opacity: 0.4
      }
    }
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */

function onUnmounted() {
  map = null
}

//****************************** Attraction perspective demonstration************************ ***** //
function changeView1() {
  map.setCameraView({ lat: 39.904128, lng: 116.391643, alt: 1054, heading: 0, pitch: -39 })
}

function changeView2() {
  map.setCameraView({ lat: 28.13059, lng: 86.835138, alt: 7627, heading: 148, pitch: -7 })
}

function changeView3() {
  map.setCameraView({ lat: 34.560392, lng: 110.052393, alt: 1724, heading: 171, pitch: -5 })
}

function changeView4() {
  map.setCameraView({ lat: 30.83463, lng: 115.86774, alt: 710, heading: 303, pitch: -7 })
}

//******************************Camera and perspective control****************** ****** //
function mapGetCameraView() {
  const camera = map.getCameraView()
  globalAlert(JSON.stringify(camera), "Current perspective parameters")
}

function mapSetCameraView() {
  map.setCameraView({ lat: 26.8764, lng: 91.148781, alt: 223798, heading: 0, pitch: -45 })
}

function mapSetCameraViewList() {
  // Perspective switching (step-by-step execution), stop sets the time to stay in this perspective
  map.setCameraViewList([
    { lng: 108.961601, lat: 34.217109, alt: 509.2, heading: 314.5, pitch: -22.5, duration: 8, stop: 0 },
    { lng: 108.96164, lat: 34.222159, alt: 510.3, heading: 211.2, pitch: -22.5, duration: 5, stop: 0 },
    { lng: 108.957259, lat: 34.221967, alt: 494.3, heading: 127.5, pitch: -17.2, duration: 5, stop: 0 },
    { lng: 108.957319, lat: 34.217225, alt: 515.5, heading: 25.4, pitch: -25.3, duration: 5 }
  ])
}

function mapFlyHome() {
  map.flyHome()
}

function mapFlyToGraphic() {
  map.flyToGraphic(graphic, { radius: 10000 })
}

function mapFlyToExtent() {
  map.flyToExtent({ xmin: 114.811691, xmax: 119.703609, ymin: 29.35597, ymax: 34.698585 })
}

function mapFlyToPositions() {
  map.flyToPositions([
    [114.031965, 36.098482, 332.8],
    [114.038309, 36.089496, 267.6],
    [114.048026, 36.093311, 255.7],
    [114.041602, 36.102055, 377.5]
  ])
}

function mapFlyToPoint() {
  map.flyToPoint([113.939351, 36.068144, 350.9], { radius: 50000 })
}

function mapCancelFlyTo() {
  map.cancelFlyTo()
}
