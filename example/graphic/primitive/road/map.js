// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.808563, lng: 117.187762, alt: 234, heading: 95, pitch: -15 }
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
  graphicLayer.remove()
  graphicLayer = null
  map = null
}

function addDemoGraphic1() {
  const road = new mars3d.graphic.Road({
    positions: [
      [117.181132, 31.814245, 45.95],
      [117.185542, 31.8125, 43.23],
      [117.190607, 31.810037, 38.95],
      [117.195048, 31.807351, 39.03],
      [117.198338, 31.804961, 39.86],
      [117.201378, 31.802543, 33.1],
      [117.204316, 31.80064, 34.33],
      [117.209094, 31.798011, 33.56],
      [117.212615, 31.796325, 33.75],
      [117.216706, 31.794731, 39.96]
    ],
    style: {
      image: "./img/textures/road.jpg",
      width: 15,
      height: 1
    }
  })
  graphicLayer.addGraphic(road)
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

    const graphic = new mars3d.graphic.Road({
      positions: [pt1, position, pt2],
      style: {
        image: "./img/textures/road.jpg",
        width: result.radius * 0.2,
        height: 30
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// draw the road
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "road",
    style: {
      image: "./img/textures/road.jpg",
      width: 15,
      height: 1,
      opacity: 1
    }
  })
}
let road
function getGraphic(GraphicId) {
  road = graphicLayer.getGraphicById(GraphicId)
  return road
}

// width changes
function widthChange(value) {
  if (road) {
    road.width = value
  }
}

//High changes
function heightChange(value) {
  if (road) {
    road.height = value
  }
}

// clear
function clearLayer() {
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
    },
    {
      text: "Calculate length",
      icon: "fa fa-medium",
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The length of this object is:" + strDis)
      }
    }
  ])
}
