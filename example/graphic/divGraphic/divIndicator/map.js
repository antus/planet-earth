// import * as mars3d from "mars3d"
// import { DivIndicator } from "./DivIndicator"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  //Create DIV data layer
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// This method demonstrates custom dragging div (defined in DivIndicator.js), you can refer to the self-expansion algorithm
function addDemoGraphic1(graphicLayer) {
  const divIndicator = new DivIndicator({
    position: [116.115794, 30.973847, 1455.6],
    style: {
      html: ` <div class="divIndicator-fixed"></div>
              <div class="divIndicator-line"></div>
              <div class="divIndicator-drag">The connection position will adapt to the nearest vertex as you drag</div> `,
      offsetX: -6,
      offsetY: 6
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(divIndicator)

  // divIndicator.testPoint = true //Can turn on the css offset value of offsetX, offsetY for comparison
}

function addDemoGraphic2(graphicLayer) {
  const divIndicator = new DivIndicator({
    position: [116.377794, 30.845679, 407.1],
    style: {
      html: ` <div class="divIndicator-fixed"></div>
              <div class="divIndicator-line"></div>
              <div class="divIndicator-drag">The connection position is fixed</div> `,
      offsetX: -6,
      offsetY: 6,
      autoPoistion: false,
      verticalPoistion: "bottom",
      horizontalPoistion: "left"
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(divIndicator)
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

    const graphic = new DivIndicator({
      position,
      style: {
        html: ` <div class="divIndicator-fixed"></div>
                <div class="divIndicator-line"></div>
                <div class="divIndicator-drag">Text</div> `,
        offsetX: -6,
        offsetY: 6
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
    type: "divIndicator",
    style: {
      html: ` <div class="divIndicator-fixed"></div>
              <div class="divIndicator-line"></div>
              <div class="divIndicator-drag">Text</div> `,
      offsetX: -6,
      offsetY: 6
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
