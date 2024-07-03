// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let floodByGraphic
let drawPotions

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Based on polygon vector surface elevation simulation, only supports a single area
  floodByGraphic = new mars3d.thing.FloodByGraphic({
    // perPositionHeight: true, // Whether the height of each analysis point is different
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    }
  })
  map.addThing(floodByGraphic)

  floodByGraphic.on(mars3d.EventType.start, function (e) {
    console.log("Start analysis", e)
  })
  floodByGraphic.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  floodByGraphic.on(mars3d.EventType.end, function (e) {
    console.log("end analysis", e)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  clearDraw()
  floodByGraphic.remove()
  floodByGraphic = null

  map = null
}

// draw rectangle
function btnDrawExtent(callback) {
  clearDraw()

  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)

      // area
      drawPotions = positions

      if (floodByGraphic.options.perPositionHeight) {
        // eslint-disable-next-line
        callback(-100, 100)
      } else {
        showLoading()
        // Find the maximum and minimum height values
        graphic.show = false // Will block the depth map, so it needs to be hidden
        mars3d.PolyUtil.interPolygonByDepth({ scene: map.scene, positions }).then((result) => {
          graphic.show = true //restore display
          hideLoading()
          callback(result.minHeight, result.maxHeight)
        })
      }
    }
  })
}
// draw polygon
function btnDraw(callback) {
  clearDraw()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      const positions = graphic.positionsShow

      drawPotions = positions

      if (floodByGraphic.options.perPositionHeight) {
        // eslint-disable-next-line
        callback(-100, 100)
      } else {
        showLoading()
        // Find the maximum and minimum height values
        graphic.show = false // Will block the depth map, so it needs to be hidden
        mars3d.PolyUtil.interPolygonByDepth({ scene: map.scene, positions }).then((result) => {
          graphic.show = true //restore display
          hideLoading()
          callback(result.minHeight, result.maxHeight)
        })
      }
    }
  })
}

function clearDraw() {
  drawPotions = null
  map.graphicLayer.clear()

  if (floodByGraphic) {
    floodByGraphic.clear()
  }
}

// Start analysis
function begin(data, callback) {
  if (drawPotions == null) {
    globalMsg("Please draw the analysis area first!")
    return
  }
  map.graphicLayer.clear()

  floodByGraphic.setOptions({
    positions: drawPotions,
    minHeight: Number(data.minHeight),
    maxHeight: Number(data.maxHeight),
    speed: Number(data.speed)
  })
  floodByGraphic.start()

  callback()
}

// height selection
function onChangeHeight(height) {
  floodByGraphic.height = height
}

// Autoplay
function startPlay() {
  if (floodByGraphic.isStart) {
    floodByGraphic.stop()
  } else {
    floodByGraphic.start()
  }
}
