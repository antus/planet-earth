// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let canvasWindLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 24.677182, lng: 107.044123, alt: 20407002, heading: 0, pitch: -90 }
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
  map.basemap = 2017 // blue basemap
  map.hasTerrain = false

  // wind farm
  canvasWindLayer = new mars3d.layer.CanvasWindLayer({
    worker: window.currentPath + "windWorker.js", // Enable multi-threaded mode, single-threaded mode after comment (not required)
    frameRate: 20, //Number of refreshes per second
    speedRate: 60, // wind forward speed
    particlesNumber: 10000,
    maxAge: 120,
    lineWidth: 2,
    // single color
    color: "#ffffff"
    // Multi-color
    // colors: ["rgb(0, 228, 0)", "rgb(256, 256, 0)", "rgb(256, 126, 0)", "rgb(256, 0, 0)", "rgb(153, 0, 76)", "rgb(126, 0, 35)"],
    // steps: [1.0, 2.0, 5.4, 7.9, 10.7, 13.8]
  })
  map.addLayer(canvasWindLayer)

  loadEarthData()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Slider event
//Modify the number of particles
function changeCount(val) {
  if (val) {
    canvasWindLayer.particlesNumber = val
  }
}

//Modify survival time
function changeAge(val) {
  if (val) {
    canvasWindLayer.maxAge = val
  }
}

//Modify movement speed
function changeSpeed(val) {
  if (val) {
    canvasWindLayer.speedRate = val
  }
}

//Modify line width
function changeLinewidth(val) {
  if (val) {
    canvasWindLayer.lineWidth = val
  }
}

// change color
function changeColor(color) {
  canvasWindLayer.color = color
}

//Load global data
let earthWindData
//Load weather
let dongnanWindData
function loadEarthData() {
  map.flyHome()

  canvasWindLayer.speedRate = 50
  canvasWindLayer.reverseY = false // false indicates that the latitude order is from large to small

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windyuv.json" })
    .then(function (res) {
      if (earthWindData) {
        canvasWindLayer.data = earthWindData
        return
      }
      earthWindData = res
      canvasWindLayer.data = earthWindData
    })
    .catch(function (err) {
      console.log("Request data failed!", err)
    })
}
//Load local data
function loadDongnanData() {
  map.setCameraView({ lat: 30.484229, lng: 116.627601, alt: 1719951, heading: 0, pitch: -90, roll: 0 })

  canvasWindLayer.speedRate = 85
  canvasWindLayer.reverseY = true // When true, it means that the latitude order is from small to large

  //Access the windpoint.json backend interface and get data
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
    .then(function (res) {
      if (dongnanWindData) {
        canvasWindLayer.data = dongnanWindData
        return
      }
      dongnanWindData = convertWindData(res.data)
      canvasWindLayer.data = dongnanWindData
    })
    .catch(function () {
      globalMsg("Real-time query of weather information failed, please try again later")
    })
}

//Convert the data to the required format: wind direction to UV
function convertWindData(arr) {
  const arrU = []
  const arrV = []

  let xmin = arr[0].x
  let xmax = arr[0].x
  let ymin = arr[0].y
  let ymax = arr[0].y

  //The wind direction is clockwise with the positive direction of the y-axis as zero degrees, and 0 degrees means north wind. 90 degrees means east wind.
  // u represents the wind in the longitude direction. If u is positive, it represents west wind, the wind blowing from the west.
  // v represents the wind in the latitude direction, v is positive, indicating south wind, wind blowing from the south.
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    if (xmin > item.x) {
      xmin = item.x
    }
    if (xmax < item.x) {
      xmax = item.x
    }
    if (ymin > item.y) {
      ymin = item.y
    }
    if (ymax < item.y) {
      ymax = item.y
    }

    const u = mars3d.WindUtil.getU(item.speed, item.dir)
    arrU.push(u)

    const v = mars3d.WindUtil.getV(item.speed, item.dir)
    arrV.push(v)
  }

  const rows = getKeyNumCount(arr, "y") // Calculate the number of rows
  const cols = getKeyNumCount(arr, "x") // Calculate the number of columns

  return {
    xmin,
    xmax,
    ymax,
    ymin,
    rows,
    cols,
    udata: arrU, // cross wind speed
    vdata: arrV // Longitudinal wind speed
  }
}

function getKeyNumCount(arr, key) {
  const obj = {}
  arr.forEach((item) => {
    obj[item[key]] = true
  })

  let count = 0
  for (const col in obj) {
    count++
  }
  return count
}
