// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.471758, lng: 117.20494, alt: 47660, heading: 4, pitch: -45 }
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
  addDemoGraphic15(graphicLayer)
  addDemoGraphic16(graphicLayer)
  addDemoGraphic17(graphicLayer)
  addDemoGraphic18(graphicLayer)
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
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.220337, 31.832987, 42.8],
      [117.220242, 31.835234, 45.6],
      [117.216263, 31.835251, 39.3],
      [117.217219, 31.819929, 35.8],
      [117.223096, 31.818342, 29.8],
      [117.249686, 31.818964, 40.1],
      [117.263171, 31.816664, 35.2],
      [117.278695, 31.816107, 35.5],
      [117.279826, 31.804185, 34.5],
      [117.286308, 31.804112, 29.2],
      [117.28621, 31.801059, 24.6]
    ],
    style: {
      width: 5,
      color: "#3388ff",
      // color: Cesium.CallbackProperty(function () {
      //   return Cesium.Color.BLUE
      // }, false),

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        color: "#ff0000"
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)

  // Demonstrate personalized processing graphic
  // initGraphicManager(graphic)
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

// There are colored edges, attached label demonstration, export geojson, load geojson
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.172852, 31.862736, 33.69],
      [117.251461, 31.856011, 26.44]
    ],
    style: {
      width: 6,
      materialType: mars3d.MaterialType.PolylineOutline,
      materialOptions: {
        color: Cesium.Color.ORANGE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK
      },
      label: {
        text: "I am the original line",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 2" }
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
  graphicCopy.positions = [
    [117.172852, 31.872736, 33.69],
    [117.251461, 31.866011, 26.44]
  ]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

// arrow line
function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.358187, 31.838662, 12.23],
      [117.4384, 31.819405, 11.78]
    ],
    style: {
      width: 8,
      clampToGround: true,
      materialType: mars3d.MaterialType.PolylineArrow,
      materialOptions: {
        color: Cesium.Color.YELLOW
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

// dashed line
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.348938, 31.805369, 7.63],
      [117.429496, 31.786715, 8.41]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.CYAN,
        dashLength: 8.0
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

// Dotted line, two-color interval
function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.313682, 31.7416, 10.85],
      [117.311934, 31.774753, 19.71],
      [117.305473, 31.800304, 23.86]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.BLUE,
        gapColor: Cesium.Color.YELLOW,
        dashPattern: parseInt("1111000000", 2)
      }
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.169646, 31.769171],
      [117.194579, 31.806466]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "#00ff00",
        image: "img/textures/line-pulse.png",
        speed: 3
      }
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.025419, 32.00651, 51.2)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.323963, 32.050384, 33.8)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // Calculate curve points

  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 8,
      //Animation line material
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-gradual.png",
        color: "#66bd63",
        repeat: new Cesium.Cartesian2(2.0, 1.0),
        speed: 25
      }
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic8(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.128446, 31.943352, 42.31)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.410216, 31.975375, 37.53)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // Calculate curve points

  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 10,
      //Animation line material
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-arrow-blue.png",
        color: "#1a9850",
        mixt: true,
        speed: 20,
        repeat: new Cesium.Cartesian2(5, 1)
      }
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic)
}

// Demonstrate CallbackProperty property
function addDemoGraphic9(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.281455, 31.896386, 22.64)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.528249, 31.921552, 43.3)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // Calculate curve points

  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#00ffff",
        speed: 10,
        percent: 0.15,
        alpha: 0.2
      }
    },
    attr: { remark: "Example 9" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic10(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(116.96385, 32.089068, 38.1)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.299257, 32.137552, 40)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // Calculate curve points

  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-colour.png",
        speed: 10
      }
    },
    attr: { remark: "Example 10" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.086107, 31.848306, 40.6],
      [117.145698, 31.798726, 22.6]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.AQUA,
        image: "./img/textures/arrow-h.png",
        repeat: new Cesium.Cartesian2(20, 1),
        speed: 30
      }
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.037815, 31.799497, 39.1],
      [117.097695, 31.742135, 22.5]
    ],
    style: {
      width: 18,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "#a6d96a",
        repeat: new Cesium.Cartesian2(4.0, 1.0),
        image: "img/textures/line-arrow-dovetail.png",
        speed: 20
      }
    },
    attr: { remark: "Example 12" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.057761, 31.81993, 33.3],
      [117.121986, 31.77118, 19.3]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.CHARTREUSE,
        image: "img/textures/line-color-yellow.png",
        speed: 25
      }
    },
    attr: { remark: "Example 13" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic14(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.009827, 31.776642, 42],
      [117.100274, 31.69459, 37.4]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(89,249,255,0.8)",
        image: "img/textures/line-tarans.png",
        speed: 8
      }
    },
    attr: { remark: "Example 14" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic15(graphicLayer) {
  const positions = [
    [117.225254, 31.743174, 22.5],
    [117.333836, 31.743008, 7.4],
    [117.333411, 31.715264, 2.7],
    [117.31401, 31.715658, 4.3],
    [117.314371, 31.727136, 5.4],
    [117.297682, 31.727056, 7.2],
    [117.296586, 31.692789, 3.4],
    [117.279685, 31.693365, 7.1],
    [117.280136, 31.726877, 11.4],
    [117.225741, 31.726757, 20.2],
    [117.225387, 31.743153, 22.5]
  ]

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: mars3d.PolyUtil.interLine(positions, { minDistance: "auto" }), // Split the coordinates to make the flowing material more uniform
    style: {
      width: 7,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "/img/textures/line-interval.png",
        axisY: false,
        repeat: new Cesium.Cartesian2(10.0, 1.0),
        color: "#ffffff",
        speed: 10
      }
    },
    attr: { remark: "Example 15" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic16(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [116.929192, 31.891959, 32.8],
      [116.960064, 31.883802, 35.7],
      [116.948047, 31.868749, 33.7]
    ],
    style: {
      width: 3,
      color: "#ff0000"
    },
    attr: { remark: "Example 16" }
  })
  graphicLayer.addGraphic(graphic)

  //Dynamic smooth additional points
  const positions_draw = graphic.setCallbackPositions() // Switch coordinates to dynamic callback mode
  setInterval(() => {
    const position = new mars3d.LngLatPoint(116.979661 + Math.random() * 0.01, 31.863542 + Math.random() * 0.01, 38).toCartesian()
    positions_draw.push(position) //Add points
  }, 3000)
}

function addDemoGraphic17(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.126296, 31.901182, 32.3],
      [117.19873, 31.896307, 29],
      [117.245564, 31.894645, 24.1]
    ],
    style: {
      width: 20,
      materialType: mars3d.MaterialType.LineThreeDash,
      materialOptions: {
        color: Cesium.Color.RED, // center line color
        dashLength: 64, // center length
        widthRatio: 0.1, // Center percentage
        sidesColor: Cesium.Color.WHITE, // Outside color
        sidesDashLength: 32, // outside length
        sidesWidthRatio: 0.1 // Outside percentage
      }
    },
    attr: { remark: "Example 17" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic18(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.336832, 31.871106, 16.6],
      [117.413649, 31.872435, 10.9],
      [117.507419, 31.847006, 18.7]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineCross,
      materialOptions: {
        color: Cesium.Color.RED, // center line color
        dashLength: 36, // cross length
        maskLength: 10, // Gap interval length
        centerPower: 0.1, // Center width percentage
        dashPower: 0.2 // dashed line percentage
      }
    },
    attr: { remark: "Example 18" }
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)

    const graphic = new mars3d.graphic.PolylineEntity({
      positions: [pt1, position, pt2],
      style: {
        width: 3.0,
        color: Cesium.Color.fromRandom({ alpha: 1.0 })
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
    type: "polyline",
    // maxPointNum: 2, //The maximum number of points can be limited, and it will automatically end after drawing 2 points
    // hasMidPoint: false,
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: false,
      label: {
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    }
  })
}

// Start drawing
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ff0000",
      width: 3,
      closure: true
    }
  })
}

// Start drawing free curve
function startDrawBrushLine() {
  graphicLayer.startDraw({
    type: "brushLine",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: false
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
