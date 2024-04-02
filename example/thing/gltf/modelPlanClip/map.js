// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let modelPlanClip

var mapOptions = {
  scene: {
    center: { lat: 31.841619, lng: 117.140395, alt: 1259, heading: 90, pitch: -51 },
    fxaa: true
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
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add model
  const graphic = new mars3d.graphic.ModelPrimitive({
    position: [117.150365, 31.841954, 50.26],
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/d1.gltf",
      scale: 1
    }
  })
  graphicLayer.addGraphic(graphic)

  modelPlanClip = new mars3d.thing.ModelPlanClip({
    graphic,
    height: 1, // depth of excavation
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
  })
  map.addThing(modelPlanClip)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function rangeDistance(value) {
  modelPlanClip.distance = value
}

function rangeNormalZ(value) {
  modelPlanClip.normalZ = value
}

//Change switching direction
function clippingType(clipType) {
  modelPlanClip.clipType = mars3d.ClipType[clipType]
}

// draw line
function drawLine() {
  modelPlanClip.clear()

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

      modelPlanClip.positions = positions
    }
  })
}
// draw rectangle
function drawExtent() {
  modelPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: true,
      outlineWidth: 2,
      addHeight: 0.5
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      modelPlanClip.positions = positions
    }
  })
}

// Draw the surface
function drawPoly() {
  modelPlanClip.clear()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      addHeight: 0.5
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      modelPlanClip.positions = positions
    }
  })
}
// Draw the surface (circumscribed)
function drawPoly2() {
  modelPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      addHeight: 0.5
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      modelPlanClip.clipOutSide = true
      modelPlanClip.positions = positions
    }
  })
}

function clear() {
  modelPlanClip.clear()
}
