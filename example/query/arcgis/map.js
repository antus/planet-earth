// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

let queryMapserver
let geoJsonLayer
let drawGraphic

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.79536, lng: 117.255222, alt: 16294, heading: 358, pitch: -76 }
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

  showGeoJsonLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function query(keyWords) {
  queryMapserver.query({
    column: "Project name",
    text: keyWords,
    graphic: drawGraphic,
    success: (result) => {
      if (result.count === 0) {
        globalMsg("No relevant records found!")
        geoJsonLayer.load({ data: { features: null } })
        return
      }

      eventTarget.fire("result", { result })
      geoJsonLayer.load({ data: result.geojson })
    },
    error: (error, msg) => {
      console.log("Service access error", error)
      globalAlert(msg, "Service access error")
    }
  })
}

function showGeoJsonLayer() {
  queryMapserver = new mars3d.query.QueryArcServer({
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hfghss/MapServer/2",
    popup: "all",
    pageSize: 6
  })

  //Layer used to display query results (geojson)
  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    symbol: {
      styleOptions: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.5,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        clampToGround: true,
        highlight: { type: "click", image: "img/marker/mark-red.png" },
        label: {
          text: "{project name}",
          font_size: 25,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -25,
          scaleByDistance: true,
          scaleByDistance_far: 80000,
          scaleByDistance_farValue: 0.5,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 80000,
          distanceDisplayCondition_near: 0
        }
      }
    },
    popup: "all"
  })
  map.addLayer(geoJsonLayer)

  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    const list = event.list
    eventTarget.fire("beforUI", { list })
  })
}

// Frame selection query rectangle
function drawRectangle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic

      console.log("Select rectangle:", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// Frame selection query circle
function drawCircle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("Frame selection circle:", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// Frame selection query multi-row
function drawPolygon() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("Frame selection of multiple lines:", drawGraphic.toGeoJSON())
    }
  })
}

function flyToGraphic(graphic) {
  graphic.openHighlight()
  graphic.flyTo({
    radius: 1000, // Point data: radius controls the sight distance
    scale: 1.5, // Line and surface data: scale controls the amplification ratio of the boundary
    complete: () => {
      graphic.openPopup()
    }
  })
}

function clearAll() {
  drawGraphic = null
  map.graphicLayer.clear()
  geoJsonLayer.clear()
}

// front page
function showFirstPage() {
  queryMapserver.showFirstPage()
}
// Previous page
function showPretPage() {
  queryMapserver.showPretPage()
}
// next page
function showNextPage() {
  queryMapserver.showNextPage()
}
