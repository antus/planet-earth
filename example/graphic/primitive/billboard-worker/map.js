//AQI source: https://aqicn.org

// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

let lastExtent = null
let bWorking = false
let currentData

let startTimestamp, endTimestamp
let timeout = 1000
let worker

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 25.251743, lng: 107.045599, alt: 553192, heading: 0, pitch: -51 }
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

  //globalNotify("Known Problem Tips", `(1) AQI comes from a third-party service and is currently inaccessible`)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Bind the Popup click popup window to the layer
  graphicLayer.bindPopup(function (event, callback) {
    const item = event.graphic.attr
    if (!item) {
      return false
    }
    return mars3d.Util.getTemplateHtml({
      title: "AQI",
      template: [
        { field: "city", name: "city" },
        { field: "utime", name: "time" },
        { field: "aqi", name: "AQI" },
        { field: "level", name: "quality" },
        { field: "influence", name: "influence" },
        { field: "suggestion", name: "suggestion" }
      ],
      attr: item
    })
  })

  map.on(mars3d.EventType.cameraChanged, onMap_cameraChanged)
  onMap_cameraChanged()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function onMap_cameraChanged() {
  endTimestamp = new Date().getTime()
  if (bWorking === false) {
    const extent = map.getExtent()
    const bbox = extent.ymin + "," + extent.xmin + "," + extent.ymax + "," + extent.xmax
    if (bbox !== lastExtent) {
      startWorker(bbox)
      lastExtent = bbox
    }
  } else if (endTimestamp - startTimestamp > timeout) {
    bWorking = false
    timeout += 1000
    worker.terminate() // Terminate web worker
  }
}

function startWorker(strBounds) {
  startTimestamp = endTimestamp = new Date().getTime()
  worker = new Worker(window.currentPath + `aqiWorker.js`) // currentPath is the current directory, built into the sample framework

  //The main thread calls the worker.postMessage() method to send a message to the Worker.
  worker.postMessage({
    bounds: strBounds
  })
  bWorking = true

  worker.onmessage = function (event) {
    //The result returned by the Worker.
    currentData = event.data.entityTable
    const currTime = event.data.currTime
    if (currentData.length !== 0 && currTime > startTimestamp) {
      createGraphics(currentData)
    }

    bWorking = false
    worker.terminate() // Terminate web worker
  }
}

const colorRamp = new mars3d.ColorRamp({
  steps: [25, 75, 125, 175, 250, 400],
  colors: ["rgb(0, 228, 0)", "rgb(256, 256, 0)", "rgb(256, 126, 0)", "rgb(256, 0, 0)", "rgb(153, 0, 76)", "rgb(126, 0, 35)"]
})

function createGraphics(currentData) {
  graphicLayer.clear()
  console.log("Loading data", currentData)

  for (let i = currentData.length - 1; i >= 0; i--) {
    const item = currentData[i]

    const graphic = new mars3d.graphic.BillboardPrimitive({
      id: item.x,
      name: item.city,
      position: [item.lon, item.lat],
      style: {
        image: mars3d.Util.getCircleImage(item.aqi, {
          color: colorRamp.getColor(item.aqi),
          radius: 25
        }),
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 900000, 0.3)
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)
  }
}
