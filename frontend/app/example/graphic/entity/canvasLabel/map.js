// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass()

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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    position: new mars3d.LngLatPoint(116.308659, 30.914005, 429.94),
    style: {
      text: "Hefei Mars Technology Co., Ltd.",
      font_size: 50,
      scale: 0.5, // font_size can be enlarged and then reduced to display the text more clearly.
      font_family: "黑体",
      color: "#ffffff",
      background: true,
      backgroundColor: "rgba(226,190,40,0.5)",
      backgroundPadding: 15,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      visibleDepth: false
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)

  // graphic to geojson
  const geojson = graphic.toGeoJSON()
  console.log("Converted geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// Add a single geojson as graphic, use graphicLayer.loadGeoJSON directly for multiple
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // new coordinates
  graphicCopy.position = [116.18869, 30.95041, 525.84]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.text = "MarsGIS-I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    name: "Text on the ground",
    position: new mars3d.LngLatPoint(116.241728, 30.879732),
    style: {
      text: "Mars3D Platform",
      font_size: 50,
      scale: 0.5, // font_size can be enlarged and then reduced to display the text more clearly.
      color: "#ffff00",

      stroke: true,
      strokeColor: "#cccccc",
      strokeWidth: 2,

      clampToGround: true
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    name: "Scale text according to viewing distance",
    position: new mars3d.LngLatPoint(116.340026, 30.873948, 383.31),
    style: {
      text: "Hefei, Anhui, China",
      font_size: 60,
      color: "#00ff00",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      scaleByDistance: new Cesium.NearFarScalar(10000, 0.5, 500000, 0.1)
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    name: "Display text according to viewing distance",
    position: new mars3d.LngLatPoint(116.329102, 30.977955, 1548.6),
    style: {
      text: "Mars Technology Mars3D Platform",
      font_size: 50,
      scale: 0.5, // font_size can be enlarged and then reduced to display the text more clearly.
      font_family: "Microsoft Yahei",
      color: "#ffffff",

      // backgroundColor: "rgba(226,190,40,0.5)",
      backgroundPadding: 15,
      outlineColor: "#ffffff",
      outlineWidth: 5,

      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000),

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        color: "#ff0000",
        outlineColor: "#ff0000"
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
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

    const graphic = new mars3d.graphic.CanvasLabelEntity({
      position,
      style: {
        text: "th" + index + "number",
        font_size: 50,
        scale: 0.5, // font_size can be enlarged and then reduced to display the text more clearly.
        font_family: "Microsoft Yahei",
        color: "#ffffff",
        backgroundColor: "rgba(226,190,40,0.5)",
        backgroundPadding: 15,
        outlineColor: "#ffffff",
        outlineWidth: 5
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
    type: "canvasLabel",
    style: {
      text: "Mars Technology Mars3D Platform",
      color: "#0081c2",
      font_size: 50,
      scale: 0.5, // font_size can be enlarged and then reduced to display the text more clearly.

      stroke: true,
      strokeColor: "#ffffff",
      strokeWidth: 2
    },
    success: function (graphic) {
      console.log("Drawing completed", graphic)
    }
  })
}

function onClickStartBounce() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.startBounce) {
      graphic.startBounce()
    }
  })
}

function onClickStartBounce2() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.startBounce) {
      graphic.startBounce({
        autoStop: true,
        step: 2,
        maxHeight: 90
      })
    }
  })
}

function onClickStopBounce() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.stopBounce) {
      graphic.stopBounce()
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
      text: "Start editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "Stop editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
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
