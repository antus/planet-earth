// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 30.606438, lng: 116.329605, alt: 53280, heading: 0, pitch: -60 }
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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic3b(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
  addDemoGraphic13(graphicLayer)
  addDemoGraphic14(graphicLayer)
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

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 31.0, 1000],
    style: {
      radii: new Cesium.Cartesian3(1000.0, 1000.0, 1500.0),
      color: "#00ff00",
      opacity: 0.5,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.9
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // Demonstrate personalized processing graphic
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
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 31.0, 1000),
    style: {
      radii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
      color: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  //Set rotation animation
  let angle
  map.on(mars3d.EventType.clockTick, function (clock) {
    angle = (Cesium.Math.TWO_PI * clock.multiplier * clock.currentTime.secondsOfDay) / 86400 // Calculate the rotation angle
  })
  graphic.entity.orientation = new Cesium.CallbackProperty((time) => {
    return Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, angle)
  }, false)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidElectric,
      materialOptions: {
        color: Cesium.Color.GREEN,
        speed: 5.0
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3b(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.303345, 31.087028, 452.2),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidWave,
      materialOptions: {
        color: "#00ffff",
        speed: 5.0
      }
    }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.4, 31.0, 1000],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 2500.0),
      innerRadii: new Cesium.Cartesian3(10.0, 10.0, 10.0),
      minimumClockDegree: -15.0,
      maximumClockDegree: 15.0,
      minimumConeDegree: 75.0,
      maximumConeDegree: 105.0,
      pitch: 30,
      color: "#f33349",
      opacity: 0.9,
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)",
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
  graphicCopy.position = [116.5, 31.0, 1000]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

// 2 circles of flat sector
function addDemoGraphic5(graphicLayer) {
  const outerRadius = 5000.0
  const innerRadius = 1000

  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 30.9, 1000],
    style: {
      radii: new Cesium.Cartesian3(outerRadius, outerRadius, outerRadius),
      innerRadii: new Cesium.Cartesian3(innerRadius, innerRadius, innerRadius),
      minimumClockDegree: -20.0,
      maximumClockDegree: 20.0,
      minimumConeDegree: 90,
      maximumConeDegree: 90,
      color: "rgba(255,255,0,0.2)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// half dome sphere
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      maximumConeDegree: 90,
      color: Cesium.Color.BLUE.withAlpha(0.3),
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//Including inner radius semi-dome sphere
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2000.0, 1500.0),
      innerRadii: new Cesium.Cartesian3(1000.0, 800.0, 600.0),
      maximumConeDegree: 90,
      color: Cesium.Color.RED.withAlpha(0.3),
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// The cut inner radius of the semi-dome sphere
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.4, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
      minimumConeDegree: 20.0,
      maximumConeDegree: 90,
      color: Cesium.Color.YELLOW.withAlpha(0.3),
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// Barrel-shaped body cut out at the top and bottom
function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.5, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
      minimumConeDegree: 60.0,
      maximumConeDegree: 140.0,
      color: "rgba(31,254,230,0.3)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 9" }
  })
  graphicLayer.addGraphic(graphic)
}

// Bowl body
function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.1, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1800.0, 1800.0, 1800.0),
      minimumConeDegree: 110.0,
      color: "rgba(149,228,12,0.3)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 10" }
  })
  graphicLayer.addGraphic(graphic)
}

// Clock opening
function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1500.0, 1500.0, 1500.0),
      minimumClockDegree: -90.0,
      maximumClockDegree: 180.0,
      minimumConeDegree: 20.0,
      maximumConeDegree: 70.0,
      color: "rgba(149,228,12,0.3)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic)
}

// partial dome
function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      minimumClockDegree: -90.0,
      maximumClockDegree: 180.0,
      maximumConeDegree: 90.0,
      color: "rgba(242,250,25,0.3)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 12" }
  })
  graphicLayer.addGraphic(graphic)
}

// Partial ellipsoid
function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.4, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
      innerRadii: new Cesium.Cartesian3(700.0, 700.0, 700.0),
      minimumClockDegree: 180.0,
      maximumClockDegree: 400.0,
      maximumConeDegree: 90.0,
      color: "rgba(247,154,44,0.3)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.5)"
    },
    attr: { remark: "Example 13" }
  })
  graphicLayer.addGraphic(graphic)
}

//Saturn composite object
function addDemoGraphic14(graphicLayer) {
  const position = new mars3d.LngLatPoint(116.5, 30.8, 1000)
  const graphic = new mars3d.graphic.EllipsoidEntity({
    name: "Saturn",
    position,
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      color: new Cesium.Color(0.95, 0.82, 0.49)
    },
    attr: { remark: "Example 14" }
  })
  graphicLayer.addGraphic(graphic)

  const graphicNei = new mars3d.graphic.EllipsoidEntity({
    name: "Saturn's inner circle",
    position,
    style: {
      radii: new Cesium.Cartesian3(4000.0, 4000.0, 4000.0),
      innerRadii: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
      minimumConeDegree: 89.8,
      maximumConeDegree: 90.2,
      color: new Cesium.Color(0.95, 0.82, 0.49, 0.5),
      heading: 30,
      pitch: 30
    }
  })
  graphicLayer.addGraphic(graphicNei)

  const graphicWai = new mars3d.graphic.EllipsoidEntity({
    name: "Saturn's Outer Circle",
    position,
    style: {
      radii: new Cesium.Cartesian3(4600.0, 4600.0, 4600.0),
      innerRadii: new Cesium.Cartesian3(4150.0, 4150.0, 4150.0),
      minimumConeDegree: 89.8,
      maximumConeDegree: 90.2,
      color: new Cesium.Color(0.95, 0.82, 0.49, 0.5),
      heading: 30,
      pitch: 30
    }
  })
  graphicLayer.addGraphic(graphicWai)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  const radius = result.radius

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.EllipsoidEntity({
      position,
      style: {
        radii: new Cesium.Cartesian3(radius, radius, radius),
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
    type: "ellipsoid",
    style: {
      color: "rgba(0,255,255,0.6)"
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
