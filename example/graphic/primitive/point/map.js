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
  const graphic = new mars3d.graphic.PointPrimitive({
    position: [116.244399, 30.920459, 573.6],
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      label: {
        text: "I am the original point",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)

  initGraphicManager(graphic)

  // graphic to geojson
  const geojson = graphic.toGeoJSON()
  console.log("Converted geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}
// You can also perform personalized management and binding operations on a single Graphic
function initGraphicManager(graphic) {
  // 3. Bind the listening event to the graphic
  // graphic.on(mars3d.EventType.click, function (event) {
  // console.log("Listening to graphic, clicked vector object", event)
  // })
  // Bind Tooltip
  // graphic.bindTooltip('I am the Tooltip bound to graphic') //.openTooltip()

  // Bind Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">I am a Popup bound to the graphic </th>
            </tr>
            <tr>
              <td>Tips:</td>
              <td>This is just test information, you can use any html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  //Bind right-click menu
  graphic.bindContextMenu([
    {
      text: "Delete object [graphic-bound]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

// Add a single geojson as graphic, use graphicLayer.loadGeoJSON directly for multiple
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // new coordinates
  graphicCopy.position = [116.18869, 30.95041, 525.84]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PointPrimitive({
    name: "Scale points based on viewing distance",
    position: new mars3d.LngLatPoint(116.301798, 30.835848, 915),
    style: {
      color: "#00ff00",
      pixelSize: 32,
      scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)

  //Display objects in the specified time range 0-10, 20-30, 40-max
  const now = map.clock.currentTime
  graphic.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.PointPrimitive({
    name: "Posting location",
    position: new mars3d.LngLatPoint(116.39224, 30.902853),
    style: {
      color: "#ffff00",
      pixelSize: 10,
      clampToGround: true,
      outlineWidth: 0,

      label: { text: "Mouse click will highlight", pixelOffsetY: -10 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
        pixelSize: 15,
        outlineColor: "#ff0000",
        outlineWidth: 2
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.PointPrimitive({
    name: "Display points based on viewing distance",
    position: new mars3d.LngLatPoint(116.329102, 30.977955, 0),
    style: {
      color: "#0000ff",
      pixelSize: 20,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000),
      clampToGround: true
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
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

    const graphic = new mars3d.graphic.PointPrimitive({
      position,
      style: {
        color: "#00ffff",
        pixelSize: 6,
        outlineColor: "#ffffff",
        outlineWidth: 2
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
    type: "pointP",
    style: {
      color: "#00ffff",
      pixelSize: 8,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      label: {
        // When text is not needed, just remove the label configuration
        text: "can support text at the same time",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
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
