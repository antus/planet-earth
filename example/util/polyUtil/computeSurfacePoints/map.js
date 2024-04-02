// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

var mapOptions = {
  scene: {
    center: { lat: 31.667593, lng: 117.163634, alt: 5394.7, heading: 358.7, pitch: -55.8 }
  },
  terrain: false
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

let graphicLayer
let graphic1
let graphic2
let graphic3

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer({ popup: "all" })
  map.addLayer(graphicLayer)

  const point = [117.181079, 31.705313, 100]

  graphic1 = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/c1.gltf"
    },
    attr: { remark: "c1" }
  })
  graphicLayer.addGraphic(graphic1)

  graphic2 = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/c2.gltf"
    },
    attr: { remark: "c2" }
  })
  graphicLayer.addGraphic(graphic2)

  graphic3 = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/c3.gltf"
    },
    attr: { remark: "c3" }
  })
  graphicLayer.addGraphic(graphic3)
}
/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeAll() {
  hideTipMarker()
}

function measureSection() {
  graphicLayer
    .startDraw({
      type: "polyline",
      style: {
        color: "#ff0000",
        width: 3
      }
    })
    .then((graphic) => {
      const positionsShow = graphic.positionsShow
      graphic.remove(true)

      computeStepSurfaceLine(positionsShow)
    })
}

var formatDistance = mars3d.MeasureUtil.formatDistance

async function computeStepSurfaceLine(positions) {
  const newPositions = mars3d.PolyUtil.interPolyline({
    map,
    positions,
    splitNum: 50,
    exact: true,
    surfaceHeight: false // No need to repeatedly calculate height
  })
  console.log("New coordinate array after interpolation", newPositions)

  graphic1.show = true
  graphic2.show = false
  graphic3.show = false
  await delay(100)

  const result1 = await mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: newPositions,
    has3dtiles: true,
    exact: true
  })
  const arrHeightPoints1 = result1.positions
  console.log("Generate layer 1 data", result1)

  graphic1.show = false
  graphic2.show = true
  graphic3.show = false
  await delay(100)

  const result2 = await mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: newPositions,
    has3dtiles: true,
    exact: true
  })
  const arrHeightPoints2 = result2.positions
  console.log("Generate layer 2 data", result2)

  graphic1.show = false
  graphic2.show = false
  graphic3.show = true
  await delay(500)
  const result3 = await mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: newPositions,
    has3dtiles: true,
    exact: true
  })
  const arrHeightPoints3 = result3.positions
  console.log("Generate layer 3 data", result3)

  graphic1.show = true
  graphic2.show = true
  graphic3.show = true

  let all_distance = 0
  let this_distance = 0
  const arrPoint = []
  const arrLen = []
  const arrHB1 = []
  const arrHB2 = []
  const arrHB3 = []

  for (let i = 0; i < arrHeightPoints1.length; i++) {
    // length
    if (i !== 0) {
      const templen = Cesium.Cartesian3.distance(arrHeightPoints1[i], arrHeightPoints1[i - 1])
      all_distance += templen
      this_distance += templen
    }
    arrLen.push(Number(all_distance.toFixed(1)))

    // Altitude
    const point = mars3d.LngLatPoint.fromCartesian(arrHeightPoints1[i])
    arrHB1.push(point.alt)
    arrPoint.push(point)

    //The height of the other 3 floors
    const point2 = mars3d.LngLatPoint.fromCartesian(arrHeightPoints2[i])
    arrHB2.push(point2.alt)

    const point3 = mars3d.LngLatPoint.fromCartesian(arrHeightPoints3[i])
    arrHB3.push(point3.alt)
  }

  eventTarget.fire("measureEnd", { arrLen, arrHB1, arrHB2, arrHB3, arrPoint })
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

// eslint-disable-next-line promise/param-names
const delay = (ms) => new Promise((res) => setTimeout(res, ms))
