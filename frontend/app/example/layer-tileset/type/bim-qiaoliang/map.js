// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let terrainPlanClip
let tilesetPlanClip // Model clipping event
let underground
let terrainClip

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.8503, lng: 117.101008, alt: 308, heading: 291, pitch: -30 },
    baseColor: "rgba(0,0,0.0,0.5)",
    globe: {
      depthTestAgainstTerrain: true
    },
    highDynamicRange: true
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

  //Add a model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    id: 1987,
    name: "bridge",
    url: "//data.mars3d.cn/3dtiles/bim-qiaoliang/tileset.json",
    maximumScreenSpaceError: 16,
    cullWithChildrenBounds: false,

    position: { lng: 117.096906, lat: 31.851564, alt: 45 },
    rotation: { z: 17.5 },
    // Style when highlighted
    highlight: {
      // all: true, //All the overall highlighting, false is the component highlighting
      type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
      color: "#00FF00"
    },
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  // click event
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })

  addPlanClipThing(tiles3dLayer)

  terrainClips(30)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addPlanClipThing(tiles3dLayer) {
  //Model cropping
  tilesetPlanClip = new mars3d.thing.TilesetPlanClip({
    positions: [
      [117.096786, 31.851355, 0],
      [117.096834, 31.851464, 0],
      [117.09691, 31.851375, 0]
    ],
    layer: tiles3dLayer,
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
  })
  map.addThing(tilesetPlanClip)

  terrainPlanClip = new mars3d.thing.TerrainPlanClip({
    positions: [
      [117.096176, 31.851189, 42.56],
      [117.097776, 31.851189, 42.56],
      [117.097776, 31.853494, 42.56],
      [117.096176, 31.853494, 42.56]
    ]
  })
  map.addThing(terrainPlanClip)
}

// Whether to enable underground mode
function chkUnderground(val, alphaVal) {
  // underground mode
  if (!underground) {
    underground = new mars3d.thing.Underground({
      alpha: alphaVal,
      enabled: val
    })
    map.addThing(underground)
  }

  underground.enabled = val
}

//Transparency changes
function alphaChange(value) {
  if (underground) {
    underground.alpha = value
  }
}

// ==========================================
// Whether to excavate
function chkClippingPlanes(val) {
  terrainClip.enabled = val
  terrainPlanClip.enabled = val
}

function terrainClips(heightVal) {
  // Digging area
  terrainClip = new mars3d.thing.TerrainClip({
    positions: [
      [117.096176, 31.851189, 42.56],
      [117.097776, 31.851189, 42.56],
      [117.097776, 31.853494, 42.56],
      [117.096176, 31.853494, 42.56]
    ],
    exact: true,
    diffHeight: heightVal, // height
    image: "./img/textures/poly-stone.jpg",
    imageBottom: "./img/textures/poly-soil.jpg",
    splitNum: 80 // Well boundary interpolation number
  })
  map.addThing(terrainClip)
}

function heightChange(num) {
  terrainClip.diffHeight = num
}

// draw rectangle
function drawExtent() {
  terrainClip.clear() // Clear the excavation area
  terrainPlanClip.clear()

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

      // Digging area
      terrainClip.positions = positions

      terrainPlanClip.positions = positions
    }
  })
}

// draw polygon
function drawPolygon() {
  terrainClip.clear() // Clear the excavation area
  terrainPlanClip.clear()

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

      // Digging area
      terrainClip.positions = positions
      terrainPlanClip.positions = positions
    }
  })
}

function clearWJ() {
  terrainClip.clear() // Clear the excavation area
  terrainPlanClip.clear()
}

//= ========================================
function distanceChange(value) {
  tilesetPlanClip.distance = value
}

// Top cut
function clipTop() {
  tilesetPlanClip.clipType = mars3d.ClipType.ZR
}
// starting point
function clipBottom() {
  tilesetPlanClip.clipType = mars3d.ClipType.Z
}
// tangent
function clipLine() {
  tilesetPlanClip.clear()

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

      tilesetPlanClip.positions = positions
    }
  })
}

// incision
function clipPoly() {
  tilesetPlanClip.clear()

  // map.graphicLayer.startDraw({
  //   type: "polygon",
  //   style: {
  //     color: "#007be6",
  //     opacity: 0.5
  //   },
  //   success: function (graphic) {
  // // Callback after successful drawing
  //     const positions = graphic.positionsShow
  //     map.graphicLayer.clear()

  // console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

  //     tilesetPlanClip.positions = positions
  //   }
  // })

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

      tilesetPlanClip.positions = positions
    }
  })
}

// circumcision
function clipPoly2() {
  tilesetPlanClip.clear()

  // map.graphicLayer.startDraw({
  //   type: "polygon",
  //   style: {
  //     color: "#007be6",
  //     opacity: 0.5,
  //     clampToGround: true
  //   },
  //   success: function (graphic) {
  // // Callback after successful drawing
  //     const positions = graphic.positionsShow
  //     map.graphicLayer.clear()

  //     tilesetPlanClip.clipOutSide = true
  //     tilesetPlanClip.positions = positions
  //   }
  // })

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

      tilesetPlanClip.clipOutSide = true
      tilesetPlanClip.positions = positions
    }
  })
}

function clearClip() {
  tilesetPlanClip.clear()
}
