// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.779398, lng: 117.314306, alt: 5949, heading: 340, pitch: -39 }
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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // Revolving lantern wall effect
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [117.268479, 31.836646, 25.53],
      [117.282362, 31.827581, 34.28],
      [117.275399, 31.813784, 30.59],
      [117.256533, 31.817975, 31.95],
      [117.254811, 31.830772, 35.99]
    ],
    style: {
      diffHeight: 500, // height
      color: "#f2fa19",
      speed: 10,
      reverse: false, // Direction: true up, false down
      label: {
        text: "I am the revolving lantern fence",
        font_size: 18,
        color: "#ffffff",
        show: false
      },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        color: "#ff0000",
        label: {
          show: true
        }
      }
    },
    attr: { remark: "Example 1", xiaoguo: "Show the highlight effect when the mouse is moved in" }
  })
  graphicLayer.addGraphic(scrollWall)
}

function addDemoGraphic2(graphicLayer) {
  // Revolving lantern wall effect
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [117.269712, 31.883547, 22.12],
      [117.303505, 31.881174, 16.89],
      [117.297216, 31.852026, 15.2],
      [117.270889, 31.854476, 21.75]
    ],
    style: {
      diffHeight: 500, // height
      color: "#00ff00",
      speed: 10,
      reverse: true // Direction: true up, false down
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(scrollWall)
}

function addDemoGraphic3(graphicLayer) {
  // Revolving lantern wall effect
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [117.319966, 31.842082, 12.29],
      [117.330034, 31.835286, 11.07],
      [117.330576, 31.823452, 11.01],
      [117.311457, 31.821023, 17.11],
      [117.308954, 31.828975, 16.29]
    ],
    style: {
      diffHeight: 500, // height
      color: "#f33349",
      style: 2, // Effect 2, default is 1
      speed: 10
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(scrollWall)
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)

    const graphic = new mars3d.graphic.ScrollWall({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        diffHeight: result.radius,
        color: Cesium.Color.fromRandom({ alpha: 0.6 }),
        style: j % 2,
        reverse: j % 1 // Direction: true up, false down
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
    type: "scrollWall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800,
      reverse: false, // Direction: true up, false down
      speed: 10
    }
  })
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
    },
    {
      text: "Calculate enclosed area",
      icon: "fa fa-reorder",
      show: (event) => {
        return event.graphic?.positionsShow?.length > 2
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}
