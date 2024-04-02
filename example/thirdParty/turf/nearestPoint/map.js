// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let pointLayer
let graphicLayer

var mapOptions = {
  scene: {
    center: { lat: 31.967015, lng: 117.316406, alt: 9150, heading: 206, pitch: -42 },
    fxaa: true
  }
}

const pointStyle = {
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  scale: 1,
  scaleByDistance: true,
  scaleByDistance_far: 20000,
  scaleByDistance_farValue: 0.7,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  clampToGround: true
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  pointLayer = new mars3d.layer.GeoJsonLayer({
    name: "Sports facilities",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      styleOptions: {
        ...pointStyle,
        image: "img/marker/mark-blue.png"
      }
    },
    popup: "{project name}",
    zIndex: 10
  })
  map.addLayer(pointLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer({
    zIndex: 20
  })
  map.addLayer(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawPoint() {
  clearAll()

  graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        ...pointStyle,
        image: "img/marker/route-start.png"
      }
    })
    .then((graphic) => {
      clickPoint(graphic.positionShow)
      graphic.remove()
    })
}

function clickPoint(position) {
  if (pointLayer.length === 0) {
    globalMsg("Loading data, please wait...")
    return
  }

  graphicLayer.clear()

  // Generate query points
  const queryPoint = new mars3d.graphic.BillboardEntity({
    position,
    style: {
      ...pointStyle,
      image: "img/marker/route-start.png"
    },
    popup: "query point"
  })
  graphicLayer.addGraphic(queryPoint)

  console.log(`Analyze the closest point in ${pointLayer.length} data`)

  // turf analysis
  const targetPoint = queryPoint.toGeoJSON()
  const points = pointLayer.toGeoJSON()
  const nearest = turf.nearestPoint(targetPoint, points)
  if (!nearest) {
    return
  }

  const nearestPoint = mars3d.Util.geoJsonToGraphics(nearest)[0]

  const graphic = pointLayer.getGraphicById(nearestPoint.attr.id)
  updateSelect(graphic)

  // connect
  const polyline = new mars3d.graphic.PolylineEntity({
    positions: [position, nearestPoint.position],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(89,249,255,0.8)",
        image: "img/textures/line-tarans.png",
        speed: 8
      }
    }
  })
  graphicLayer.addGraphic(polyline)

  //end point
  const endPoint = new mars3d.graphic.CircleEntity({
    position: nearestPoint.position,
    style: {
      radius: polyline.distance / 10,
      height: 40,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#00ffff",
        count: 2,
        speed: 20
      }
    },
    popup: "The nearest sports venue is:<br />" + nearestPoint.attr["Project Name"]
  })
  graphicLayer.addGraphic(endPoint)
  endPoint.openPopup()
}

function clearAll() {
  removeSelect()
  graphicLayer.clear()
}

let selectGraphic
function updateSelect(graphic) {
  removeSelect()

  if (graphic) {
    selectGraphic = graphic
    selectGraphic.setStyle({
      image: "img/marker/mark-red.png"
    })
  }
}

function removeSelect() {
  if (!selectGraphic) {
    return
  }

  selectGraphic.setStyle({
    image: "img/marker/mark-blue.png"
  })
  selectGraphic = undefined
}
