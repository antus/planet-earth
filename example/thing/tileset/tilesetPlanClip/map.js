// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tilesetLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Model
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Teaching Building",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,

    //TilesetPlanClip construction parameters can be passed in. The following is the demonstration cropping area.
    planClip: {
      positions: [
        [117.251193, 31.843689, 47.7],
        [117.251384, 31.843689, 47.7],
        [117.251384, 31.843746, 47.7],
        [117.251193, 31.843746, 47.7]
      ],
      edgeColor: Cesium.Color.GREY,
      edgeWidth: 2.0
      // showPlane: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// draw line
function drawLine() {
  tilesetLayer.planClip.clear()

  map.graphicLayer.startDraw({
    type: "polyline",
    maxPointNum: 2,
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()
      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.planClip.positions = positions
    }
  })
}

// draw rectangle
function drawExtent() {
  tilesetLayer.planClip.clear()

  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()
      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.planClip.positions = positions
    }
  })
}

// Draw the surface
function drawPoly() {
  tilesetLayer.planClip.clear()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()
      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.planClip.positions = positions
    }
  })
}
// Draw the surface (circumscribed)
function drawPoly2() {
  tilesetLayer.planClip.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()
      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.planClip.clipOutSide = true
      tilesetLayer.planClip.positions = positions
    }
  })
}

//Change switching direction
function clippingType(type) {
  tilesetLayer.planClip.clipType = mars3d.ClipType[type]
}

// distance
function rangeDistance(value) {
  tilesetLayer.planClip.distance = value
}

function rangeAngle1(value) {
  tilesetLayer.planClip.angle1 = value
}
function rangeAngle2(value) {
  tilesetLayer.planClip.angle2 = value
}

function clear() {
  tilesetLayer.planClip.clear()
}
