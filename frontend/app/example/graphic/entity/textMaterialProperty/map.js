// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.792325, lng: 121.480055, alt: 146, heading: 198, pitch: -54 }
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

  //Add a model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Water Conservancy Gate",
    url: "//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",
    position: { alt: 15.2 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

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
  graphicLayer.clear()
}

// wall text entity mode
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [121.479914, 29.791249, 32],
      [121.479694, 29.791303, 32]
    ],
    style: {
      diffHeight: 5,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Water Conservancy Gate",
        font_family: "楷体",
        color: "#00ffff"
      }
    },
    attr: { remark: "Example 1" }
  })

  graphicLayer.addGraphic(graphic)
}

// wall text added in primitive way
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [121.479343, 29.791419, 35],
      [121.479197, 29.791474, 35]
    ],
    style: {
      diffHeight: 5,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars Technology",
        font_size: 70,
        fill: true,
        color: "#00FFFF",
        // stroke: true,
        // strokeColor: "#FF0000",
        // strokeWidth: 3,
        outline: true,
        outlineWidth: 4,
        onCustomCanvas // Customize Canvas
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

// To do custom processing on Canvas, you need to return Promise
function onCustomCanvas(canvas, material) {
  const context = canvas.getContext("2d")
  return Cesium.Resource.createIfNeeded("./img/country/zg.png")
    .fetchImage()
    .then((image) => {
      context.drawImage(image, 5, 5, 20, 20)
      return canvas
    })
}

// rectangle ground-mounted rectangle 3dtiles road text
function addDemoGraphic3(graphicLayer) {
  const rectangleEntity = new mars3d.graphic.RectangleEntity({
    positions: [
      [121.479989, 29.791162],
      [121.480114, 29.791201]
    ],
    style: {
      classificationType: Cesium.ClassificationType.BOTH,
      rotationDegree: 163,
      clampToGround: true,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars Road",
        font_size: 50,
        font_family: "楷体",
        color: "#00ff00",
        stroke: true,
        strokeWidth: 2,
        strokeColor: "#ffffff",
        speed: 10 //Scroll text speed, no scrolling when 0
      },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        type: mars3d.EventType.click,
        materialOptions: {
          stroke: true,
          strokeColor: "rgba(255,0,0,0.8)",
          strokeWidth: 5
        }
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(rectangleEntity)
}

function addDemoGraphic4(graphicLayer) {
  let rotation = Cesium.Math.toRadians(30)
  function getRotationValue() {
    rotation += 0.005
    return rotation
  }

  const rectangleEntity = new mars3d.graphic.RectangleEntity({
    positions: [
      [121.479593, 29.791632, 13],
      [121.480136, 29.79169, 13]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars Technology Mars3D Platform",
        font_size: 70,
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        stroke: true,
        strokeWidth: 2,
        strokeColor: new Cesium.Color(1.0, 1.0, 1.0, 0.8)
      },
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(rectangleEntity)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  const diffHeight = result.radius * 0.5

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 45, result.radius)

    const graphic = new mars3d.graphic.WallEntity({
      positions: [pt1, pt2],
      style: {
        diffHeight,
        materialType: mars3d.MaterialType.Text,
        materialOptions: {
          text: "Mars3D three-dimensional visualization platform",
          font_family: "楷体",
          color: "#00ffff"
        }
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
    maxPointNum: 2,
    style: {
      diffHeight: 5,
      outline: false,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars3D three-dimensional visualization platform",
        font_size: 50,
        color: "#ffff00"
      }
    }
  })
}

//Draw a rectangle that touches the ground
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars3D three-dimensional visualization platform"
      },
      clampToGround: true
    }
  })
}

// Calculate the rectangle based on the center point
function onClickDrawPoint() {
  graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#ffff00",
      clampToGround: true
    },
    success: function (graphic) {
      const position = graphic.positionShow
      const positions = mars3d.PolyUtil.getRectPositionsByCenter({
        center: position,
        width: 60,
        height: 10
      })
      graphic.remove(true)

      const rectangleEntity = new mars3d.graphic.RectangleEntity({
        positions,
        style: {
          materialType: mars3d.MaterialType.Text,
          materialOptions: {
            text: "Mars3D three-dimensional visualization platform"
          },
          clampToGround: true
        }
      })
      graphicLayer.addGraphic(rectangleEntity)

      if (graphicLayer.hasEdit) {
        rectangleEntity.startEditing()
      }

      eventTarget.fire("addTableData", { graphicLayer })
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

function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
