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
  addDemoGraphic5(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.EllipseEntity({
    position: [116.282587, 30.859197, 544.31],
    style: {
      semiMajorAxis: 800, // semi-major axis radius
      semiMinorAxis: 600, // radius of minor semi-axis
      color: "#00ff00",
      opacity: 0.3,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // Demonstrate personalized processing of graphics
  initGraphicManager(graphic)
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

  //Test color flash
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // Flashing duration (seconds)
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // Callback after completion
      }
    })
  }
}

//
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.EllipseEntity({
    position: new mars3d.LngLatPoint(116.329199, 30.881595, 390.3),
    style: {
      semiMajorAxis: 1500, // semi-major axis radius
      semiMinorAxis: 900, // radius of minor semi-axis
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ff0000",
        count: 1, // single circle
        speed: 40
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic3(graphicLayer) {
  let _rotation = Math.random()

  const graphic = new mars3d.graphic.EllipseEntity({
    position: new mars3d.LngLatPoint(116.392526, 30.903729, 933.55),
    style: {
      semiMajorAxis: 1500, // semi-major axis radius
      semiMinorAxis: 900, // radius of minor semi-axis
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        image: "img/textures/circle-scan.png",
        color: "#5fc4ee"
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation -= 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.EllipseEntity({
    position: [116.244399, 30.920459],
    style: {
      semiMinorAxis: 1100, // radius of minor semi-axis
      semiMajorAxis: 2000, // semi-major axis radius
      height: 200,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ffff00",
        count: 2,
        speed: 20
      },
      label: {
        text: "I am original",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

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
  graphicCopy.position = [116.301991, 30.933872, 624.03]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.EllipseEntity({
    position: new mars3d.LngLatPoint(116.37617, 30.847384, 396.12),
    style: {
      semiMajorAxis: 1500, // semi-major axis radius
      semiMinorAxis: 900, // radius of minor semi-axis
      diffHeight: 1000.0,
      color: "#00ff00",
      opacity: 0.3,
      rotationDegree: 45,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        color: "#00ff00",
        opacity: 0.7
      }
    },
    attr: { remark: "Example 5" }
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

    const graphic = new mars3d.graphic.CircleEntity({
      position,
      style: {
        semiMajorAxis: result.radius, // semimajor axis radius
        semiMinorAxis: result.radius * 0.7, // radius of minor semi-axis
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
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
    type: "ellipse",
    style: {
      color: "#ffff00",
      opacity: 0.6,
      clampToGround: false
    }
  })
}

function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "ellipse",
    style: {
      color: "#ff0000",
      opacity: 0.6,
      diffHeight: 600
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
