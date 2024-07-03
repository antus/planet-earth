// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tileLayer
let graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.676218, lng: 117.251248, alt: 27740, heading: 1, pitch: -63 }
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

  globalNotify("Known Issue Tips", "(1) Baidu Street View is currently restricted for use, you need to apply for panoramic map service usage permission Key replacement")

  creatDom()
  map.basemap = "Tencent Electronics"

  //Vector layer data
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // overlaid layers
  tileLayer = new mars3d.layer.BaiduLayer({
    layer: "streetview",
    show: false
  })
  map.addLayer(tileLayer)

  splitScreen()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function chooseStree() {
  if (markerStreet) {
    graphicLayer.removeGraphic(markerStreet, true)
    markerStreet = null
  }

  map.off(mars3d.EventType.click, onClickMap)
  tileLayer.show = false

  tileLayer.show = true

  // if (typeView !== 0) {
  //   viewTo3d()
  // }

  graphicLayer.startDraw({
    type: "billboard",
    style: {
      image: "img/marker/street.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        font_size: 30,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -50
      }
    },
    success: function (graphic) {
      markerStreet = graphic
    }
  })

  map.on(mars3d.EventType.click, onClickMap)
}

function creatDom() {
  const divDom = mars3d.DomUtil.create("div", "", document.body)
  divDom.setAttribute("id", "centerDivJJ")

  const iframDom = mars3d.DomUtil.create("iframe", "stree", divDom)
  iframDom.setAttribute("id", "streeScape")
  iframDom.setAttribute("src", window.currentPath + "baidu.html?lng=117.215219&lat=31.861592") // currentPath is the current directory, built into the example framework
}
let typeView = 0

// 3d display
function viewTo3d() {
  typeView = 0
  const dom2d = document.getElementById("centerDivJJ")
  const dom3d = document.getElementById("centerDiv3D")
  dom3d.style.display = "block"
  dom3d.style.width = "100%"
  dom3d.style.left = "0"

  dom2d.style.display = "none"
}

// // Street view display
function streetscape() {
  typeView = 1
  const dom2d = document.getElementById("centerDivJJ")
  const dom3d = document.getElementById("centerDiv3D")
  dom3d.style.display = "none"
  dom2d.style.width = "100%"
  dom2d.style.display = "block"
}

// Split screen display
function splitScreen() {
  typeView = 2
  const dom2d = document.getElementById("centerDivJJ")
  const dom3d = document.getElementById("centerDiv3D")

  dom2d.style.width = "50%"
  dom3d.style.width = "50%"
  dom3d.style.left = "50%"
  dom2d.style.display = "block"
  dom3d.style.display = "block"
}

function onClickMap(event) {
  const point = mars3d.LngLatPoint.fromCartesian(event.cartesian)

  const rightFrame = document.getElementById("streeScape")
  rightFrame.contentWindow.setPosition(point)

  if (typeView === 0) {
    streetscape()
  }
}

let markerStreet
function updateMarker(position) {
  if (markerStreet) {
    markerStreet.position = position
  } else {
    markerStreet = new mars3d.graphic.BillboardEntity({
      position,
      style: {
        image: "img/marker/street.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        clampToGround: true
      }
    })
    graphicLayer.addGraphic(markerStreet)
  }

  map.flyToGraphic(markerStreet, { radius: 800 })
}
