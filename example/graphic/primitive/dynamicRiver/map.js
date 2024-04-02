// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // layer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.422407, lng: 115.820222, alt: 3498, heading: 67, pitch: -32 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
  clear()
}

// Three-dimensional wall diffusion effect, surface shape
function addDemoGraphic1() {
  const dynamicRiver = new mars3d.graphic.DynamicRiver({
    positions: [
      [115.906607, 30.441582, 555.9],
      [115.899964, 30.438543, 467.3],
      [115.893105, 30.440714, 374.6],
      [115.88362, 30.443924, 340.7],
      [115.873948, 30.444827, 299],
      [115.864003, 30.442111, 292.2],
      [115.850741, 30.438108, 189.9]
    ],
    style: {
      image: "./img/textures/poly-rivers.png",
      width: 280,
      height: 30,
      speed: 10
    }
  })
  graphicLayer.addGraphic(dynamicRiver)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)

    const graphic = new mars3d.graphic.DynamicRiver({
      positions: [pt1, position, pt2],
      style: {
        image: "./img/textures/poly-rivers.png",
        width: 280,
        height: 30,
        speed: 10
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "dynamicRiver",
    style: {
      image: "./img/textures/poly-rivers.png",
      width: 280,
      height: 30,
      speed: 10
    }
  })
}

let dynamicRiver
function getGraphic(graphicId) {
  dynamicRiver = graphicLayer.getGraphicById(graphicId)
  return dynamicRiver
}

// width changes
function widthChange(value) {
  if (dynamicRiver) {
    dynamicRiver.width = value
  }
}

//High changes
function heightChange(value) {
  if (dynamicRiver) {
    dynamicRiver.height = value
  }
}

//speed changes
function speedChange(value) {
  if (dynamicRiver) {
    dynamicRiver.speed = value
  }
}

let onOff = true
// Height up 30 meters animation
function addHeight() {
  if (!dynamicRiver) {
    return
  }
  if (!onOff) {
    globalMsg("The last operation was not completed")
    return
  }
  dynamicRiver.setOffsetHeight(30, 5) // Raise 30 meters in 5 seconds
  throttle()
}

//Drop 30 meters animation
function lowerHeight() {
  if (!dynamicRiver) {
    return
  }
  if (!onOff) {
    globalMsg("The last operation was not completed")
    return
  }
  dynamicRiver.setOffsetHeight(-30, 5) // Lower 30 meters in 5 seconds
  throttle()
}

function throttle() {
  setTimeout(() => {
    onOff = true
  }, 2000)

  onOff = false
}

// clear
function clear() {
  graphicLayer.clear()
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // When the right click is the editing point
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
