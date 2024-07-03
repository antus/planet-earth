// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.473861, lng: 117.225929, alt: 52974, heading: 2, pitch: -49 }
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
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.154815, 31.853495],
      [117.181255, 31.854257],
      [117.182284, 31.848255],
      [117.184748, 31.840141],
      [117.180557, 31.835556],
      [117.180023, 31.833741],
      [117.166846, 31.833737],
      [117.155531, 31.833151],
      [117.154787, 31.835978],
      [117.151994, 31.839036],
      [117.150691, 31.8416],
      [117.151215, 31.844734]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      //Animation line material
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#00ff00",
        mixt: true,
        speed: 10,
        axisY: true
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)

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

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.208302, 31.85757],
      [117.234234, 31.858263],
      [117.234261, 31.833317],
      [117.207414, 31.834541]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      //Animation line material
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/arrow.png",
        color: Cesium.Color.CHARTREUSE,
        repeat: new Cesium.Cartesian2(30, 1),
        speed: 20
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  // When round
  const positions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: Cesium.Cartesian3.fromDegrees(117.276257, 31.866351, 19.57),
    radius: 1200, // radius
    count: 50 // Return a total of (count*4) points
  })

  const graphic = new mars3d.graphic.WallEntity({
    positions,
    style: {
      diffHeight: 800,
      closure: true,
      //Animation line material
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#00ffff",
        speed: 10,
        axisY: true
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.229659, 31.908221],
      [117.240804, 31.908175]
    ],
    style: {
      diffHeight: 700,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        //Animation line material
        image: "img/textures/fence.png",
        axisY: true,
        color: "#ff0000",
        image2: "img/textures/tanhao.png",
        color2: "#ffff00",
        speed: 10
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.153945, 31.881122, 36.4],
      [117.168352, 31.880147, 32.6],
      [117.178047, 31.885925, 29.25]
    ],
    style: {
      diffHeight: 200,
      color: "#00ffff",
      opacity: 0.4,
      label: {
        text: "I am original",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 5" }
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
    [117.105938, 31.883825, 43.6],
    [117.125006, 31.876243, 42.6],
    [117.135525, 31.882068, 39],
    [117.151507, 31.874259, 39.7]
  ]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic6(graphicLayer) {
  const positions = [
    [117.517578, 31.893561, 25.7],
    [117.321028, 31.887207, 21.3],
    [117.290341, 31.902469, 15.1]
  ]

  const graphic = new mars3d.graphic.WallEntity({
    positions: mars3d.PolyUtil.interLine(positions, { minDistance: "auto" }), // Split the coordinates to make the flowing material more uniform
    style: {
      diffHeight: 400,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        //Animation line material
        image: "img/textures/arrow.png",
        color: "#00eba8",
        repeat: new Cesium.Cartesian2(20, 1),
        speed: 20
      }
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.192113, 31.80998, 32.2],
      [117.228145, 31.792757, 26.7],
      [117.261023, 31.776821, 19.8]
    ],
    style: {
      diffHeight: 500,
      color: "#00ffff",
      opacity: 0.4,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.206138, 31.877321],
      [117.206326, 31.901436]
    ],
    style: {
      diffHeight: 400,
      materialType: mars3d.MaterialType.Image,
      materialOptions: {
        image: getColorRampCanvas(),
        transparent: false
      }
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic)
}

//Texture map drawing
function getColorRampCanvas(elevationRamp) {
  if (elevationRamp == null) {
    // elevationRamp = { 0.0: "blue", 0.1: "cyan", 0.37: "lime", 0.54: "yellow", 1: "red" };
    // elevationRamp = { 0.0: '#000000', 0.045: '#2747E0', 0.1: '#D33B7D', 0.15: '#D32738', 0.37: '#FF9742', 0.54: '#ffd700', 1.0: '#ffffff' }
    elevationRamp = {
      0.0: "#FFEDA0",
      0.05: "#FED976",
      0.1: "#FEB24C",
      0.15: "#FD8D3C",
      0.37: "#FC4E2A",
      0.54: "#E31A1C",
      0.7: "#BD0026",
      1.0: "#800026"
    }
  }

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 100

  const ctx = canvas.getContext("2d")
  const grd = ctx.createLinearGradient(0, 0, 0, 100)
  for (const key in elevationRamp) {
    grd.addColorStop(1 - Number(key), elevationRamp[key])
  }

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 1, 100) // Parameters: upper left corner x, upper left corner y, width width, height
  return canvas.toDataURL()
}

// Boundary wall drawing
function addDemoGraphic9(graphicLayer) {
  const url = "//data.mars3d.cn/file/geojson/areas/340100.json"
  mars3d.Util.fetchJson({ url }).then(function (data) {
    const arr = mars3d.Util.geoJsonToGraphics(data) // Parse geojson
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const graphic = new mars3d.graphic.WallEntity({
        positions: item.positions,
        style: {
          diffHeight: 3000,
          materialType: mars3d.MaterialType.LineFlow,
          materialOptions: {
            image: "img/textures/fence.png",
            color: "#bdf700",
            repeat: new Cesium.Cartesian2(5, 1),
            axisY: true, // direction, up and down when true, left and right when false
            speed: 10
          }
        },
        attr: item.attr
      })
      graphicLayer.addGraphic(graphic)
      graphic.bindTooltip("Welcome to Hefei - Mars Technology")
    }
  })
}

function addDemoGraphic10() {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.251382, 31.824055, 28.4],
      [117.278989, 31.819766, 27.3],
      [117.279566, 31.799699, 3.9],
      [117.265249, 31.797702, 26.3],
      [117.245146, 31.811783, 29]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      materialType: mars3d.MaterialType.WallScroll,
      materialOptions: {
        image: "img/textures/fence.png",
        color: Cesium.Color.CHARTREUSE,
        count: 3,
        speed: 20,
        bloom: true
      }
    },
    attr: { remark: "Example 10" }
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

    const graphic = new mars3d.graphic.WallEntity({
      positions: [pt1, position, pt2],
      style: {
        diffHeight: result.radius,
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
    type: "wall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800
    }
  })
}

// Start drawing
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800,
      closure: true
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
