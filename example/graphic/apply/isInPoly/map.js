// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.772337, lng: 117.213784, alt: 12450, heading: 0, pitch: -66 }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const extent = map.getExtent()
  mars3d.Util.fetchJson({
    url: "//server.mars3d.cn/server/pointRandom/",
    queryParameters: {
      xmin: extent.xmin,
      ymin: extent.ymin,
      xmax: extent.xmax,
      ymax: extent.ymax,
      count: 100
    }
  })
    .then(function (data) {
      addData(data)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let selectGraphic = []
function addData(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.x, item.y, 0),
      style: {
        image: "img/marker/mark-blue.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1),
        clampToGround: true
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)

    graphic.bindTooltip(item.name)
  }
}

// Change icons within the range are red
function updateSelect(drawGraphic) {
  graphicLayer.eachGraphic((graphic) => {
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

function removeAll() {
  map.graphicLayer.clear()

  for (let i = 0; i < selectGraphic.length; i++) {
    const graphic = selectGraphic[i]
    graphic.setStyle({
      image: "img/marker/mark-blue.png"
    })
  }
  selectGraphic = []
}

function drawPolygon() {
  removeAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      updateSelect(graphic)
    }
  })
}

function drawCircle() {
  removeAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      updateSelect(graphic)
    }
  })
}

function drawRectangle() {
  removeAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      updateSelect(graphic)
    }
  })
}
