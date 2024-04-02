// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let limitHeight

var mapOptions = {
  scene: {
    center: { lat: 31.794547, lng: 117.21215, alt: 1672, heading: 18, pitch: -33 }
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

  // // Create vector data layer
  // const graphicLayer = new mars3d.layer.GraphicLayer()
  // map.addLayer(graphicLayer)

  // // Add gltf model
  // const graphic = new mars3d.graphic.ModelPrimitive({
  // name: "Fan",
  //   position: [117.221189, 31.814105, 30],
  //   style: {
  //     url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
  //     colorBlendMode: Cesium.ColorBlendMode.MIX,
  //     scale: 50
  //   }
  // })
  // graphicLayer.addGraphic(graphic)

  //Add 3dtiles model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  //Height limit analysis class
  limitHeight = new mars3d.thing.LimitHeight({
    color: "rgba(255,0,0,0.5)",
    height: 80, // height limit
    bottomHeight: 32, //The altitude of the model ground (unit: meters)
    positions: [
      [117.210446, 31.829032, 0],
      [117.226334, 31.826662, 0],
      [117.226694, 31.807882, 0],
      [117.209776, 31.808359, 0],
      [117.209778, 31.808341, 0]
    ]
  })
  map.addThing(limitHeight)

  // Automatically read the height of the model, but it may not be accurate.
  // tilesetLayer.on(mars3d.EventType.load, function (event) {
  //   limitHeight.bottomHeight = mars3d.LngLatPoint.fromCartesian(tilesetLayer.boundingSphere.center).alt
  // })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// slider
function currHeight(value) {
  limitHeight.height = value
}

// draw rectangle
function drawExtent() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.3,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      limitHeight.positions = positions

      map.graphicLayer.clear()
    }
  })
}

// Draw the surface
function drawPolygon() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.3,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      limitHeight.positions = positions

      map.graphicLayer.clear()
      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates
    }
  })
}

function clear() {
  limitHeight.clear()
  map.graphicLayer.clear()
}
