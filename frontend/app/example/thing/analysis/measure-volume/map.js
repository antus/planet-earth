// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let measure
let measureVolume

var mapOptions = {
  scene: {
    center: { lat: 30.883785, lng: 116.230883, alt: 8121, heading: 266, pitch: -62 },
    globe: { depthTestAgainstTerrain: true }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  addMeasure()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addMeasure() {
  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  })
  map.addThing(measure)

  measure.on(mars3d.EventType.start, function (event) {
    console.log("Start analysis", event)
    clearInterResult()
    showLoading()
    console.log("The coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(event.positions))) // Convenient for testing copy coordinates
  })

  measure.on(mars3d.EventType.end, function (event) {
    console.log("Analysis completed", event)
    hideLoading()

    // const resultInter = event.graphic.interPolygonObj
    // const cutHeight = event.graphic.height

    // let totalArea = 0
    // for (let i = 0, len = resultInter.list.length; i < len; i++) {
    //   const item = resultInter.list[i]

    //   const pt1 = item.point1
    //   const pt2 = item.point2
    //   const pt3 = item.point3

    //   const height = (pt1.height + pt2.height + pt3.height) / 3
    //   if (height < cutHeight) {
    //     totalArea += item.area
    //   }
    // }
    // console.log(totalArea, mars3d.MeasureUtil.formatArea(totalArea))
  })

  //Add some demo data
  setTimeout(() => {
    addDemoGraphic1(measure.graphicLayer)
  }, 3000)

  //When there is a model
  // tiles3dLayer.readyPromise.then((layer) => {
  // // Key code, execute volume after the model readyPromise is loaded.
  //   addDemoGraphic1(measure.graphicLayer)
  // })
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.VolumeMeasure({
    splitNum: 6,
    height: 450,
    positions: [
      [116.191817, 30.864845, 309.3],
      [116.192869, 30.8757, 521.81],
      [116.190478, 30.886266, 672.79],
      [116.19247, 30.893748, 448.91],
      [116.200836, 30.889954, 379.92],
      [116.204063, 30.882578, 532.5],
      [116.203027, 30.873828, 498.8],
      [116.201795, 30.865941, 443.06]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    attr: { remark: "Example 1" }
  })
  graphic.on(mars3d.EventType.end, function () {
    showHeightVal()
  })
  graphicLayer.addGraphic(graphic)

  measureVolume = graphic
}

//Click height
function showHeightVal() {
  const baseHeight = measureVolume.height.toFixed(1)
  const minHeight = measureVolume.minHeight.toFixed(1)
  const maxHeight = getFixedNum(measureVolume.maxHeight)

  // Trigger the custom event heightVal and change the value in the component panel
  eventTarget.fire("heightVal", { baseHeight, minHeight, maxHeight })
}

function getFixedNum(val) {
  return Math.ceil(val * 10) / 10
}

// Square quantity analysis
function analysisMeasure() {
  // Analysis of manual drawing methods
  measure
    .volume({
      splitNum: 6, // Number of in-plane interpolations to control accuracy [note that the greater the accuracy, the longer the analysis time]
      // minHeight: 50, //You can set a fixed minimum height
      exact: false // Whether to perform precise calculations. When false is passed, whether to use a quick rough calculation method. This method has lower calculation accuracy but fast calculation speed. It can only calculate the height of coordinates within the current field of view.
    })
    .then((e) => {
      measureVolume = e
      showHeightVal()
    })
}

// clear
function clear() {
  measure.clear()
  measureVolume = null
  clearInterResult()
}

function showResult(reslut) {
  if (reslut && measureVolume && measureVolume.interPolygonObj) {
    showInterResult(measureVolume.interPolygonObj.list)
    return true
  } else {
    clearInterResult()
    return false
  }
}

//Modify base height
function baseHeight(num) {
  measureVolume.height = num
  showHeightVal()
}

//Modify bottom height
function txtMinHeight(num) {
  if (num > measureVolume.height) {
    globalMsg("The bottom height of the wall cannot be higher than the height of the base plane")
    return
  }
  measureVolume.minHeight = num
}

//Modify top height
function txtMaxHeight(num) {
  const maxHeight = getFixedNum(measureVolume.polygonMaxHeight)
  if (num < maxHeight) {
    globalMsg("The height of the top of the wall cannot be lower than the surface height in the area" + maxHeight)
    measureVolume.maxHeight = Number(maxHeight)
    return
  }
  if (num < measureVolume.height) {
    globalMsg("The height of the top of the wall cannot be lower than the height of the base plane")
    return
  }
  measureVolume.maxHeight = num
}

function selHeight() {
  if (!measureVolume || !measure) {
    globalMsg("Please start the square analysis first")
    return
  }

  // Pick up height
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#00fff2"
    },
    success: (graphic) => {
      const height = graphic.point?.alt
      map.graphicLayer.removeGraphic(graphic)

      if (!height) {
        return
      }

      measureVolume.height = height

      showHeightVal(height)
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

function showInterResult(list) {
  //The analysis results are used for test analysis. Without much processing, the previous ones are directly cleared and only one is retained.
  clearInterResult()

  let pt1, pt2, pt3
  // var geometryInstances = [];
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

    //Triangle network and edges
    const positions = [pt1, pt2, pt3, pt1]

    //Triangular mesh (for click)
    const primitivePoly = new mars3d.graphic.PolygonPrimitive({
      positions,
      style: {
        color: Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.01)
      }
    })
    interGraphicLayer.addGraphic(primitivePoly)
    primitivePoly.bindTooltip("Triangle area:" + mars3d.MeasureUtil.formatArea(item.area) + "(th" + i + "number)")

    // Triangle network edges
    const primitiveLine = new mars3d.graphic.PolylinePrimitive({
      positions,
      style: {
        width: 1,
        color: Cesium.Color.fromCssColorString("#ffff00").withAlpha(0.3)
      }
    })
    interGraphicLayer.addGraphic(primitiveLine)
  }
}
