// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let floodByMaterial

var mapOptions = {
  scene: {
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      showGroundAtmosphere: false,
      enableLighting: false
    }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Based on the earth material, multiple areas can be used
  floodByMaterial = new mars3d.thing.FloodByMaterial({
    color: "rgba(0, 123, 230, 0.5)" // flood color
  })
  map.addThing(floodByMaterial)

  floodByMaterial.on(mars3d.EventType.start, function (e) {
    console.log("Start analysis", e)
  })

  floodByMaterial.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })

  floodByMaterial.on(mars3d.EventType.end, function (e) {
    console.log("end analysis", e)
    eventTarget.fire("floodEnd")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// draw rectangle
function btnDrawExtent(callback, floodColor) {
  clearDraw()

  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: floodColor || "rgba(0, 123, 230, 0.5)"
      // clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)

      //Update the maximum and minimum height values
      updateHeightRange(graphic, positions, callback)

      // area
      floodByMaterial.addArea(positions)
    }
  })
}

// draw polygon
function btnDraw(callback, floodColor) {
  clearDraw()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: floodColor || "rgba(0, 123, 230, 0.5)",
      outline: false
      // clampToGround: true
    },
    success: function (graphic) {
      const positions = graphic.positionsShow

      //Update the maximum and minimum height values
      updateHeightRange(graphic, positions, callback)
      floodByMaterial.addArea(positions)
    }
  })
}

// Find the maximum and minimum height values
function updateHeightRange(graphic, positions, callback) {
  showLoading()

  // Find the maximum and minimum height values
  graphic.show = false // Will block the depth map, so it needs to be hidden
  mars3d.PolyUtil.interPolygonByDepth({ scene: map.scene, positions }).then((result) => {
    graphic.show = true //restore display
    const minHeight = Math.ceil(result.minHeight)
    const maxHeight = Math.floor(result.maxHeight)

    callback(minHeight, maxHeight)
    hideLoading()
  })
}

// Start analysis
function begin(data) {
  if (floodByMaterial.length === 0) {
    globalMsg("Please draw the analysis area first!")
    return
  }
  map.graphicLayer.clear()

  const minValue = Number(data.minHeight)
  const maxValue = Number(data.maxHeight)
  const speed = Number(data.speed)

  floodByMaterial.setOptions({
    minHeight: minValue,
    maxHeight: maxValue,
    speed
  })
  floodByMaterial.start()
}

// height selection
function onChangeHeight(height) {
  floodByMaterial.height = height
}

// color changes
function onChangeColor(color) {
  floodByMaterial.color = color
}

// Autoplay
function startPlay() {
  if (floodByMaterial.isStart) {
    floodByMaterial.stop()
  } else {
    floodByMaterial.start()
  }
}

// Whether to display non-flooded areas
function onChangeElse(val) {
  floodByMaterial.showElseArea = val
}

function clearDraw() {
  floodByMaterial.clear()
  map.graphicLayer.clear()
}
