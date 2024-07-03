// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let contourLine

var mapOptions = {
  scene: {
    center: { lat: 30.706401, lng: 116.08272, alt: 26859, heading: 5, pitch: -55 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      showGroundAtmosphere: false,
      enableLighting: false
    }
  }
}

var eventTabel = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  addContourLine()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addContourLine() {
  contourLine = new mars3d.thing.ContourLine({
    spacing: 100,
    width: 1.5,
    color: "rgba(255,0,0,0.8)",
    minHeight: -414.0,
    maxHeight: 8777.0,
    shadingAlpha: 0.6, /// Transparency of surface rendering
    colorScheme: {
      // Color scheme for surface rendering
      elevation: {
        step: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
        color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
      },
      slope: {
        step: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
        color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
      },
      aspect: {
        step: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
        color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
      }
    }
  })
  map.addThing(contourLine)

  // Sample area for demonstration
  const areaItem = contourLine.addArea([
    [116.003125, 30.948354, 1103.66],
    [116.23964, 30.946376, 563.02],
    [116.223677, 30.802558, 522.04],
    [115.997891, 30.807484, 440.83]
  ])
  addTableItem(areaItem)
}

// add rectangle
function btnDrawExtent() {
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      let positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      positions = mars3d.PointUtil.setPositionsHeight(positions, 0)
      const areaItem = contourLine.addArea(positions)
      addTableItem(areaItem)
    }
  })
}

//Add polygon
function btnDraw() {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      let positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      positions = mars3d.PointUtil.setPositionsHeight(positions, 0)
      const areaItem = contourLine.addArea(positions)
      addTableItem(areaItem)
    }
  })
}

// clear
function clearAll() {
  contourLine.clear()
  table = []
}

// Slider control
function changeWidth(val) {
  if (val) {
    contourLine.width = val
  }
}

function changeSpacing(val) {
  if (val) {
    contourLine.spacing = val
  }
}

// change color
function changeColor(val) {
  contourLine.color = Cesium.Color.fromCssColorString(val)
}

//Contour control
function showDengGX(val) {
  contourLine.contourShow = val
}

// state control
function chkClippingPlanes(val) {
  contourLine.showElseArea = val
}

//Shadow control
function changeShadingType(val) {
  contourLine.shadingType = val
}

let table = []
//Add a row of records to the area table
function addTableItem(item) {
  table.push({ key: item.id, name: "area" + item.id })
  const tableItem = { key: item.id, table }
  eventTabel.fire("tableObject", { tableItem })
}
function changeTable(data) {
  table = data
}

// table operations
function flyToGraphic(item) {
  const graphic = contourLine.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

function deletedGraphic(item) {
  const graphic = contourLine.getAreaById(item)
  contourLine.removeArea(graphic)
}

function showHideArea(id, selected) {
  if (selected) {
    contourLine.showArea(id)
  } else {
    contourLine.hideArea(id)
  }
}
