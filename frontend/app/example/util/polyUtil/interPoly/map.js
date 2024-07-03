// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.841762, lng: 116.26537, alt: 3281, heading: 39, pitch: -63 }
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeAll() {
  map.graphicLayer.clear()

  clearInterResult()
}

/**
 * Surface interpolation
 *
 * @export
 * @param {number} val step size
 * @returns {void}
 */
function interPolygon(val) {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#29cf34",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      mars3d.PolyUtil.interPolygon({
        scene: map.scene,
        positions,
        splitNum: val //The number of splitNum interpolation divisions
      }).then((resultInter) => {
        showInterPolygonResult(resultInter.list)
      })
    }
  })
}
function showInterPolygonResult(list) {
  clearInterResult() // The analysis results are used for test analysis. Without much processing, the previous ones are cleared directly and only one is retained.

  let pt1, pt2, pt3
  const arrData = []
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]

    pt1 = item.point1.pointDM
    pt2 = item.point2.pointDM
    pt3 = item.point3.pointDM

    // point
    for (const pt of [item.point1, item.point2, item.point3]) {
      const graphic = new mars3d.graphic.PointPrimitive({
        position: pt.pointDM,
        style: {
          pixelSize: 9,
          color: Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.5)
        }
      })
      interGraphicLayer.addGraphic(graphic)

      graphic.bindTooltip("Point height:" + mars3d.MeasureUtil.formatDistance(pt.height))
    }

    // cross-sectional area
    item.area = item.area || mars3d.MeasureUtil.getTriangleArea(pt1, pt2, pt3)
    item.index = i

    //Triangle network and edges
    arrData.push({
      positions: [pt1, pt2, pt3, pt1],
      style: {
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
      },
      attr: item
    })
  }

  //Triangular mesh (for click)
  const primitivePoly = new mars3d.graphic.PolygonCombine({
    instances: arrData,
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  interGraphicLayer.addGraphic(primitivePoly)

  primitivePoly.bindTooltip(function (event) {
    const item = event.pickedObject?.data?.attr
    if (!item) {
      return
    }

    return "Triangular area:" + mars3d.MeasureUtil.formatArea(item.area) + "(th" + item.index + "number)"
  })

  // Triangle network edges
  const primitiveLine = new mars3d.graphic.PolylineCombine({
    instances: arrData,
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  interGraphicLayer.addGraphic(primitiveLine)
}

function interPolygonGrid(val) {
  clearInterResult()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#29cf34",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      const result = mars3d.PolyUtil.getGridPointsByPoly(positions, val)
      result.forEach((p, i) => {
        const graphic = new mars3d.graphic.PointPrimitive({
          position: p,
          style: {
            color: "#ff0000",
            pixelSize: 6
          }
        })
        interGraphicLayer.addGraphic(graphic)
      })
    }
  })
}

/**
 * Surface interpolation
 *
 * @export
 * @param {number} val step size
 * @returns {void}
 */
function interPolygonByDepth(val) {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#29cf34",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      updateAllGraphicShow(map, false)
      mars3d.PolyUtil.interPolygonByDepth({
        scene: map.scene,
        positions,
        splitNum: val //The number of splitNum interpolation divisions
      }).then((resultInter) => {
        updateAllGraphicShow(map, true)
        showInterPolygonByDepthResult(resultInter)
      })
    }
  })
}
function showInterPolygonByDepthResult(resultInter) {
  clearInterResult() // The analysis results are used for test analysis. Without much processing, the previous ones are cleared directly and only one is retained.

  const arrData = []
  for (let i = 0, len = resultInter.count; i < len; i++) {
    const position = resultInter.positions[i]

    // const graphic = new mars3d.graphic.PointPrimitive({
    //   position: position,
    //   style: {
    //     pixelSize: 9,
    //     color: Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.5)
    //   }
    // })
    // interGraphicLayer.addGraphic(graphic)
    // graphic.bindTooltip("Point height:" + mars3d.MeasureUtil.formatDistance(position.height))

    arrData.push({
      positions: position.getOutline(),
      style: {
        color: Cesium.Color.fromRandom({ alpha: 0.4 })
      },
      attr: { height: position.height, index: i }
    })
  }

  const primitivePoly = new mars3d.graphic.PolygonCombine({
    instances: arrData,
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  interGraphicLayer.addGraphic(primitivePoly)

  primitivePoly.bindTooltip(function (event) {
    const item = event.pickedObject?.data?.attr
    if (!item) {
      return
    }

    return "Point height:" + mars3d.MeasureUtil.formatDistance(item.height) + "(th" + item.index + ")"
  })
}

// line interpolation
function interPolyline(val) {
  map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: true
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      const arrLine = mars3d.PolyUtil.interPolyline({
        scene: map.scene,
        positions,
        splitNum: val // Number of interpolation splits
      })

      showInterLineResult(arrLine)
    }
  })
}

// height equal parts
function interLine(val) {
  map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      const arrLine = mars3d.PolyUtil.interLine(positions, {
        splitNum: val // Number of interpolation splits
      })

      showInterLineResult(arrLine)
    }
  })
}

function interLineByDepth(val) {
  map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      updateAllGraphicShow(map, false)
      mars3d.PolyUtil.interPolylineByDepth({
        scene: map.scene,
        positions,
        splitNum: val // Number of interpolation splits
      }).then((resultInter) => {
        updateAllGraphicShow(map, true)
        showInterLineResult(resultInter.positions)
      })
    }
  })
}

//Display shadow vector data
function updateAllGraphicShow(map, show) {
  map.eachLayer((layer) => {
    if (layer.type === "graphic") {
      layer.show = show
    }
  })
}

// Display the in-plane interpolation analysis results after mars3d.polygon.interPolygon processing, mainly used for testing and comparison
//Display the interpolation calculation results of the surface to facilitate comparison and analysis.
let interGraphicLayer
function clearInterResult() {
  if (!interGraphicLayer) {
    interGraphicLayer = new mars3d.layer.GraphicLayer()
    map.addLayer(interGraphicLayer)
  }

  interGraphicLayer.clear()
}

//
function showInterLineResult(list) {
  clearInterResult() // The analysis results are used for test analysis. Without much processing, the previous ones are cleared directly and only the last one is retained.

  const colorList = [Cesium.Color.fromCssColorString("#ffff00"), Cesium.Color.fromCssColorString("#00ffff")]

  const arrData = []
  for (let i = 1, len = list.length; i < len; i++) {
    const pt1 = list[i - 1]
    const pt2 = list[i]

    const color = colorList[i % 2]

    arrData.push({
      positions: [pt1, pt2],
      style: {
        width: 3,
        color,
        depthFailColor: color
      },
      attr: {
        distance: Cesium.Cartesian3.distance(pt1, pt2),
        index: i
      }
    })
  }

  const primitiveLine = new mars3d.graphic.PolylineCombine({
    instances: arrData,
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.RED
    }
  })
  interGraphicLayer.addGraphic(primitiveLine)

  primitiveLine.bindTooltip(function (event) {
    const item = event.pickedObject?.data?.attr
    if (!item) {
      return
    }
    return "Length:" + mars3d.MeasureUtil.formatDistance(item.distance) + "(th" + item.index + ")"
  })
}
