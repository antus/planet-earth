// import * as mars3d from "mars3d"

var mapOptions = {
  scene: {
    center: { lat: 31.967015, lng: 117.316406, alt: 9150, heading: 206, pitch: -42 },
    fxaa: true
  }
}

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
let pointLayer

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

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // Whether to automatically activate editing after drawing is completed
  })
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    updateBuffer(e.graphic)
  })

  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    updateBuffer(e.graphic)
  })

  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    updateBuffer(e.graphic)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawPoint() {
  deleteAll()

  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 12,
      color: "#ffff00"
    }
  })
}

function drawPolyline() {
  deleteAll()

  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ffff00",
      width: 3,
      clampToGround: true
    }
  })
}

function drawPolygon() {
  deleteAll()

  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      outline: true,
      outlineColor: "#f0ce22",
      outlineWidth: 4,
      opacity: 0.5,
      clampToGround: true
    }
  })
}

function deleteAll() {
  graphicLayer.clear()
  map.graphicLayer.clear()
  lastgeojson = null
  removeSelect()
}

let width
function radiusChange(val) {
  width = val * 1000 // km
  if (lastgeojson) {
    updateBuffer()
  }
}

let lastgeojson
function updateBuffer(graphic) {
  let buffere
  try {
    const geojson = graphic ? graphic.toGeoJSON() : lastgeojson
    geojson.properties = {}

    buffere = mars3d.PolyUtil.buffer(geojson, width)

    lastgeojson = geojson
  } catch (e) {
    console.log("Buffer analysis exception", e)
  }
  if (!buffere) {
    return
  }

  const graphicsOptions = mars3d.Util.geoJsonToGraphics(buffere, {
    type: "polygon",
    style: {
      color: "rgba(255,0,0,0.4)",
      clampToGround: true
    }
  })[0]

  map.graphicLayer.clear()

  const drawGraphic = map.graphicLayer.addGraphic(graphicsOptions)
  updateSelect(drawGraphic)
}

let selectGraphic = []
function updateSelect(drawGraphic) {
  removeSelect()
  if (!drawGraphic) {
    return
  }

  pointLayer.eachGraphic((graphic) => {
    const position = graphic.positionShow

    const isInArea = drawGraphic.isInPoly(position)
    if (isInArea) {
      graphic.setStyle({
        image: "img/marker/mark-red.png"
      })
      selectGraphic.push(graphic)
    }
  })
}

function removeSelect() {
  for (let i = 0; i < selectGraphic.length; i++) {
    const graphic = selectGraphic[i]
    graphic.setStyle({
      image: "img/marker/mark-blue.png"
    })
  }
  selectGraphic = []
}
