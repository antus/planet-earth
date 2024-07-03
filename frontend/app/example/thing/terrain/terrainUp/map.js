// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let terrainUplift

var mapOptions = {
  scene: {
    center: { lat: 30.827414, lng: 116.378229, alt: 16933, heading: 0, pitch: -56 }
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

  terrainUplift = new mars3d.thing.TerrainUplift({
    upHeight: 2000, // raised height
    image: "img/textures/poly-land.png",
    // image: "./img/textures/mining.jpg",
    imageBottom: "img/textures/poly-land.png",
    diffHeight: 100,
    splitNum: 80 // Well boundary interpolation number
  })
  map.addThing(terrainUplift)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addTerrainUplift(height) {
  const areaItem = terrainUplift.addArea(
    [
      [116.334222, 30.899171, 645.46],
      [116.370874, 30.899171, 645.46],
      [116.370874, 30.944509, 645.46],
      [116.334222, 30.944509, 645.46]
    ],
    { diffHeight: height, exact: true }
  )
  addTableItem(areaItem)

  const areaItem2 = terrainUplift.addArea(
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
    { diffHeight: height, exact: true }
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
      const areaItem = terrainUplift.addArea(positions, { diffHeight: height })
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

      const areaItem = terrainUplift.addArea(positions, { diffHeight: height })
      addTableItem(areaItem)
    }
  })
}

// clear
function removeAll() {
  terrainUplift.clear() // Clear the excavation area
  table = []
}

function changeClipHeight(val) {
  // terrainUplift.diffHeight = val
}

function changeUpHeight(val) {
  terrainUplift.upHeight = val
}

// Whether to dig the ground
function chkClippingPlanes(val) {
  terrainUplift.enabled = val
}

let table = []
//Add a row of records to the area table
function addTableItem(item) {
  table.push({ key: item.id, name: "lift area" + item.id })

  eventTabel.fire("tableObject", { table })
}
function changeTable(data) {
  table = data
}

// table operations
function flyToGraphic(item) {
  const graphic = terrainUplift.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

function deletedGraphic(item) {
  const graphic = terrainUplift.getAreaById(item)
  terrainUplift.removeArea(graphic)
}

function showHideArea(id, selected) {
  if (selected) {
    terrainUplift.showArea(id)
  } else {
    terrainUplift.hideArea(id)
  }
}
