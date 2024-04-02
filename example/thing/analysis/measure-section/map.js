// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let measureObj

var mapOptions = {
  scene: {
    center: { lat: 30.715648, lng: 116.300527, alt: 10727, heading: 3, pitch: -25 }
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

  measureObj = new mars3d.thing.Measure({
    //Set text style
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  })
  map.addThing(measureObj)

  // Trigger event: before starting analysis
  measureObj.on(mars3d.EventType.start, function (e) {
    // console.log("Start analysis", e)
    showLoading()
  })

  //Trigger event: after asynchronous analysis is completed
  measureObj.on(mars3d.EventType.end, function (e) {
    // console.log("Analysis ended", e)

    hideLoading()
    if (e.graphic?.type === mars3d.graphic.SectionMeasure.type) {
      eventTarget.fire("measureEnd", e)
    }
  })

  measureObj.on(mars3d.EventType.click, function (e) {
    // console.log("Object clicked", e)
    hideTipMarker()

    if (e.graphic?.type === mars3d.graphic.SectionMeasure.type) {
      eventTarget.fire("measureClick", { value: e.graphic?.measured })
    }
  })

  //Add some demo data
  addDemoGraphic1(measureObj.graphicLayer)
}
/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.SectionMeasure({
    exact: true,
    positions: [
      [116.193794, 30.994415, 654.8],
      [116.236077, 30.925154, 506.2],
      [116.314569, 30.864239, 408.7],
      [116.341924, 30.847984, 381.8],
      [116.392754, 30.854264, 581.7],
      [116.415222, 30.880092, 580.5],
      [116.567457, 30.85223, 314.6]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

function removeAll() {
  measureObj.clear()
  hideTipMarker()
}

function measureSection() {
  measureObj.section({
    // maxPointNum:2,
    splitNum: 300, // Number of interpolations
    exact: false // Whether to perform precise calculations. When false is passed, whether to use a quick rough calculation method. This method has lower calculation accuracy but fast calculation speed. It can only calculate the height of coordinates within the current field of view.
  })
}

function calculation(params) {
  const len = mars3d.MeasureUtil.formatDistance(Number(params.axisValue))
  const hbgdStr = mars3d.MeasureUtil.formatDistance(Number(params.value))

  return { len, hbgdStr }
}

let tipGraphic
/**
 *Icons in echart charts
 *
 * @export
 * @param {Array} point coordinate point
 * @param {number} z altitude
 * @param {html} inthtml html
 * @returns {void}
 */
function showTipMarker(point, z, inthtml) {
  const _position_draw = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z)

  if (!tipGraphic) {
    tipGraphic = new mars3d.graphic.BillboardEntity({
      name: "Current point",
      position: _position_draw,
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2)
      }
    }).addTo(map.graphicLayer)
    tipGraphic._setPositionsToCallback()
  }
  tipGraphic._position_draw = _position_draw
  tipGraphic.bindPopup(inthtml).openPopup()
}

function hideTipMarker() {
  if (!tipGraphic) {
    return
  }
  tipGraphic.remove(true)
  tipGraphic = null
}
