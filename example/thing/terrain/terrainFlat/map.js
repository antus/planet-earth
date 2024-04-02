// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let terrainFlat

var mapOptions = {
  scene: {
    center: { lat: 30.827414, lng: 116.378229, alt: 16933, heading: 0, pitch: -56 }
  }
}

let lineLayer // Vector layer object, used for graphic binding display

var eventTabel = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Create vector data layer
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addTerrainClip() {
  terrainFlat = new mars3d.thing.TerrainFlat()
  map.addThing(terrainFlat)

  // terrainFlat.on(mars3d.EventType.addItem, onAddFlatArea)

  const areaItem = terrainFlat.addArea(
    [
      [116.334222, 30.899171, 645.46],
      [116.370874, 30.899171, 645.46],
      [116.370874, 30.944509, 645.46],
      [116.334222, 30.944509, 645.46]
    ],
    { height: 900 }
  )
  addTableItem(areaItem)

  const areaItem2 = terrainFlat.addArea(
    [
      [116.416497, 30.934256, 775.89],
      [116.427392, 30.962941, 1084.88],
      [116.434838, 30.932608, 900.43],
      [116.462994, 30.923081, 771.42],
      [116.437571, 30.916044, 906.39],
      [116.44977, 30.894487, 776.06],
      [116.424183, 30.908752, 727.02],
      [116.402218, 30.898406, 593.08],
      [116.414309, 30.918806, 588.78],
      [116.387022, 30.933539, 700.65]
    ],
    { height: 200 }
  )
  addTableItem(areaItem2)
}

// add rectangle
function btnDrawExtent(height) {
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Print the lower boundary

      // Digging area
      const areaItem = terrainFlat.addArea(positions, { height })
      addTableItem(areaItem)
    }
  })
}
//Add polygon
function btnDraw(height) {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Print the lower boundary

      const areaItem = terrainFlat.addArea(positions, { height })
      addTableItem(areaItem)
    }
  })
}

// clear
function removeAll() {
  terrainFlat.clear() // Clear the excavation area
  table = []
  lineLayer.clear()
}

//Change the depth of the cut
function changeClipHeight(val) {
  terrainFlat.height = val
}

// Whether to dig the ground
function chkClippingPlanes(val) {
  terrainFlat.enabled = val
}

let table = []
//Add a row of records to the area table
function addTableItem(item) {
  item.lineId = addTestLine(item.positions)

  table.push({ key: item.id, name: "flatten area" + item.id, lineId: item.lineId })

  eventTabel.fire("tableObject", { table })
}
function changeTable(data) {
  table = data
}

// table operations
function flyToGraphic(item) {
  const graphic = terrainFlat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

function deletedGraphic(areaId, lineId) {
  const graphic = terrainFlat.getAreaById(areaId)
  terrainFlat.removeArea(graphic)

  if (lineId) {
    const graphicLine = lineLayer.getGraphicById(lineId)
    lineLayer.removeGraphic(graphicLine)
  }
}

function showHideArea(id, selected) {
  if (selected) {
    terrainFlat.showArea(id)
  } else {
    terrainFlat.hideArea(id)
  }
}

// Whether to display the test boundary line
function chkShowLine(val) {
  lineLayer.show = val
}

function addTestLine(positions) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      closure: true,
      color: "#ffffff",
      opacity: 0.8,
      width: 2,
      clampToGround: true
    }
  })
  lineLayer.addGraphic(graphic)

  // const graphic = new mars3d.graphic.PolygonEntity({
  //   positions: positions,
  //   style: {
  //     materialType: mars3d.MaterialType.Image,
  //     materialOptions: {
  //       image: "img/textures/poly-soil.jpg",
  // opacity: 0.8 // transparency
  //     },
  //     clampToGround: true
  //   }
  // })
  // lineLayer.addGraphic(graphic)

  return graphic.id
}
