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

  globalNotify("Known problem tips", `Because the clippingPlanes interface is used, when drawing surfaces, some drawing angles have incorrect effects`)

  //Add model
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,

    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },

    //TilesetPlanClip construction parameters can be passed in. The following is the demonstration cropping area.
    planClip: {
      positions: [
        [119.481231, 28.440357, 0],
        [119.481998, 28.441117, 0],
        [119.482421, 28.440803, 0],
        [119.481627, 28.439996, 0]
      ],
      edgeColor: Cesium.Color.GREY,
      edgeWidth: 2.0
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // Also compatible with native cesium tileset, use as follows
  // let tilesetPlanClip = new mars3d.thing.TilesetPlanClip()
  // tilesetPlanClip.clipTarget = tileset
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

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

      // Adding positions can make 3D cropping determine the position and take effect.
      tilesetLayer.planClip.positions = positions
    }
  })
}

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

function drawExtent() {
  tilesetLayer.planClip.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
      // clampToGround: true
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

function drawExtent2() {
  tilesetLayer.planClip.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
      // clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()
      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.planClip.clipOutSide = true
      tilesetLayer.planClip.positions = positions
    }
  })
}

function clear() {
  tilesetLayer.planClip.clear()
}
