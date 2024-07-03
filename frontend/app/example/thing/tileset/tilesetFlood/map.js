// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel
var mapOptions = {
  scene: {
    center: { lat: 31.797067, lng: 117.21963, alt: 1512, heading: 360, pitch: -36 }
  }
}

var tilesetLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  globalNotify("Known Problem Tips", `(1) Currently not all types of 3dtile data are supported, please replace the url for self-test `)

  showDytDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// true: Precise mode, directly stores the range, but when the number of passed range vertices is large, it will cause a certain degree of lag;
// false: Mask mode, rasterization range, efficiency has nothing to do with the number of range vertices, but aliasing is serious after zooming in
const precise = false

function showDytDemo() {
  removeLayer()

  //Add model
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Big Wild Goose Pagoda",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1,
    flood: {
      precise,
      editHeight: -24, // Relative height (unit: meters), based on the offset of the lowest point height of the flattened/submerged area
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // Model flooding processing class
  const tilesetFlood = tilesetLayer.flood
  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("Start analysis", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("end analysis", e)
  })
}

function showTehDemo() {
  removeLayer()

  //Add model
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,

    editHeight: -140.0, // Relative height (unit: meters), based on the offset of the lowest point height of the flattened/submerged area
    flood: {
      precise,
      enabled: true
    },

    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // Will be executed multiple times, and will be called back after reloading.
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  // console.log("Trigger allTilesLoaded event", event)
  // })

  // Model flooding processing class
  const tilesetFlood = tilesetLayer.flood

  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("Start analysis", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("end analysis", e)
  })
}

function showXianDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },

    editHeight: -18.0, // Relative height (unit: meters), based on the offset of the lowest point height of the flattened/submerged area
    flood: {
      precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // Model flooding processing class
  const tilesetFlood = tilesetLayer.flood
  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("Start analysis", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("end analysis", e)
  })
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// height selection
function onChangeHeight(height) {
  tilesetLayer.flood.height = height
}

//Modify analysis method
function changeFloodType(val) {
  if (val === "1") {
    tilesetLayer.flood.floodAll = true
  } else {
    tilesetLayer.flood.floodAll = false
  }
}

// draw rectangle
function btnDrawExtent() {
  stop()
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)

      tilesetLayer.flood.addArea(positions)
    }
  })
}
// draw polygon
function btnDraw() {
  stop()
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow

      tilesetLayer.flood.addArea(positions)

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates
    }
  })
}

// Start analysis
function begin(data) {
  if (!tilesetLayer.flood.floodAll && tilesetLayer.flood.length === 0) {
    globalMsg("Please draw the analysis area first!")
    return false
  }
  map.graphicLayer.clear()

  const minValue = Number(data.minHeight)
  const maxValue = Number(data.maxHeight)
  const speed = Number(data.speed)
  if (minValue <= 27) {
    globalMsg("The minimum altitude is too low, please wait patiently for a few seconds")
  }
  if (minValue > maxValue) {
    globalMsg("The current lowest altitude is higher than the highest altitude")
    return false
  }

  console.log("Current parameters", { minHeight: minValue, maxHeight: maxValue })

  tilesetLayer.flood.setOptions({
    minHeight: minValue,
    maxHeight: maxValue,
    speed
  })

  tilesetLayer.flood.start()
  return true
}

function stop() {
  tilesetLayer.flood.clear()
}
