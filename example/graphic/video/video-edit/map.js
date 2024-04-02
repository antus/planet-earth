// import * as mars3d from "mars3d"
// import { CanvasEdit } from "./CanvasEdit"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.842839, lng: 117.204275, alt: 269.9, heading: 179, pitch: -77.7 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

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

function creatCanvas(drawVideo) {
  return new CanvasEdit(drawVideo)
}

let videoPolygon

function addDemoGraphic1(graphicLayer) {
  videoPolygon = new mars3d.graphic.VideoPrimitive({
    positions: [
      [117.204858, 31.842209, 45.6],
      [117.204087, 31.842184, 43.6],
      [117.204087, 31.842668, 43.6],
      [117.204827, 31.842712, 43.6]
    ],
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      opacity: 0.9,
      distanceDisplayCondition_far: 5000
    }
  })
  graphicLayer.addGraphic(videoPolygon)
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 45, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 90 + 45, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 180 + 45, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 270 + 45, result.radius)

    const graphic = new mars3d.graphic.VideoPrimitive({
      positions: [pt1, pt2, pt3, pt4],
      style: {
        url: "//data.mars3d.cn/file/video/lukou.mp4"
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

function updateROI(uvROI) {
  if (!videoPolygon || videoPolygon.isDestroy) {
    return
  }
  videoPolygon.rois = uvROI
}

function clearROI() {
  if (!videoPolygon || videoPolygon.isDestroy) {
    return
  }
  videoPolygon.rois = undefined
}

var choosePoint = (isChoosePoint) => {
  if (!videoPolygon || videoPolygon.isDestroy) {
    return
  }

  if (isChoosePoint) {
    videoPolygon.startEditingGrid()
  } else {
    videoPolygon.stopEditingGrid()
  }
}

// Start drawing
function startDrawGraphic() {
  graphicLayer
    .startDraw({
      type: "videoPrimitive",
      style: {
        url: "//data.mars3d.cn/file/video/lukou.mp4",
        opacity: 0.8
      }
    })
    .then((graphic) => {
      videoPolygon = graphic
    })
}

// Cast video according to current camera
function startDrawGraphic2() {
  const positions = mars3d.PolyUtil.getMapExtentPositions(map.scene)
  if (positions.length < 3) {
    return
  }

  const graphic = new mars3d.graphic.VideoPrimitive({
    positions: positions,
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4"
    }
  })
  graphicLayer.addGraphic(graphic)

  videoPolygon = graphic
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
      text: "Start editing grid points",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return !graphic.isEditingGrid
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.startEditingGrid()
        }
      }
    },
    {
      text: "Stop editing grid points",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.isEditingGrid
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditingGrid()
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
