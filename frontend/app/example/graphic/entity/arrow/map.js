// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.620733, lng: 119.509245, alt: 657931, heading: 0, pitch: -80 }
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

  globalNotify("Known Problem Tips", `(1) When at the 180-degree longitude or the North and South Poles, there is a rendering issue.`)

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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.StraightArrow({
    positions: [
      [117.76314, 30.671648, 440.5],
      [117.885026, 32.030943, 440.5]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.FineArrow({
    positions: [
      [118.351476, 30.646825, 286.6],
      [118.419077, 32.05059, 286.6]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.FineArrowYW({
    positions: [
      [119.527562, 30.549996, 481.3],
      [119.645216, 31.987335, 481.3]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.AttackArrow({
    positions: [
      [119.162167, 30.627124, 206.6],
      [118.734841, 30.661996, 206.6],
      [119.136736, 31.175837, 206.6],
      [119.001217, 32.015687, 206.6]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.AttackArrowYW({
    positions: [
      [120.472593, 30.475435, 1429.5],
      [120.859927, 30.410491, 1429.5],
      [120.874151, 31.09718, 1429.5],
      [120.709928, 31.883932, 1429.5]
    ],
    style: {
      materialType: mars3d.MaterialType.PolyGradient,
      materialOptions: {
        color: "#ff0000",
        alphaPower: 0.8,
        center: new Cesium.Cartesian2(0.5, 0.0)
      }
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.AttackArrowPW({
    positions: [
      [120.159212, 30.51614, 0],
      [120.073352, 31.163911, 0],
      [120.248902, 31.922699, 0]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.DoubleArrow({
    positions: [
      [115.967691, 31.446636],
      [116.361355, 30.623772],
      [117.147102, 31.455161],
      [116.887987, 31.578392],
      [116.391773, 31.085218]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.GatheringPlace({
    positions: [
      [116.76866, 31.79288, 0],
      [117.336959, 31.678728, 0],
      [117.363407, 32.203935, 0]
    ],
    style: {
      materialType: mars3d.MaterialType.PolyGradient,
      materialOptions: {
        color: "#ff0000",
        alphaPower: 0.8
      },
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic)
}

// This method demonstrates custom dotted military signs (png or svg images are enough), complex ones can also be drawn with Canvas, refer to graphic\entity\billboard-canvas\CanvasBillboard.js
function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardEntity({
    position: [116.699972, 29.004322],
    style: {
      image: "img/marker/qianjin.png",
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // Horizontal anchor point, left of LEFT
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM // Vertical anchor point, bottom of BOTTOM
    },
    attr: { remark: "Example 9 - Custom dot military mark" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// This method demonstrates a custom linear military mark (defined in CurveEntity.js). You can refer to the self-expansion algorithm to implement related marks.
function addDemoGraphic10(graphicLayer) {
  // eslint-disable-next-line no-undef
  const graphic = new CurveEntity({
    positions: [
      [118.901633, 29.84308, 423.4],
      [118.030482, 29.323071, 214.3],
      [118.935367, 28.88123, 208.9],
      [117.973442, 28.441806, 223.9]
    ],
    style: {
      color: "#0000ff",
      opacity: 0.6,
      width: 4
    },
    attr: { remark: "Example 10 - Customized linear military mark" }
  })
  graphicLayer.addGraphic(graphic)
}

// This method demonstrates a custom surface military standard (defined in CloseVurveEntity.js). You can refer to the self-expansion algorithm to implement related labels.
function addDemoGraphic11(graphicLayer) {
  // eslint-disable-next-line no-undef
  const graphic = new CloseVurveEntity({
    positions: [
      [120.2849, 29.773135, 26.8],
      [119.26029, 28.767787, 297.3],
      [120.904109, 28.756734, 698.9]
    ],
    style: {
      color: "#0000ff",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff"
    },
    attr: { remark: "Example 11 - Customized area military mark" }
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 120, result.radius)

    const graphic = new mars3d.graphic.FineArrowYW({
      positions: [pt1, position, pt2],
      style: {
        color: Cesium.Color.fromRandom({ alpha: 0.6 }),
        outline: true,
        outlineWidth: 3,
        outlineColor: "#ffffff"
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
    type: "fineArrow",
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    }
  })
}

// Start drawing and draw the three-dimensional surface
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "fineArrowYW",
    style: {
      color: "#ff0000",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
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
      text: "Calculate perimeter",
      icon: "fa fa-medium",
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The perimeter of this object is:" + strDis)
      }
    },
    {
      text: "Calculate area",
      icon: "fa fa-reorder",
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}
