// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tilesetPlanClip
let terrainPlanClip

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.842658, lng: 117.251492, alt: 249, heading: 358, pitch: -59 },
    globe: {
      depthTestAgainstTerrain: true
    }
  },
  control: {
    infoBox: false
  },
  layers: [
    {
      id: 1987,
      name: "Teaching Building",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
      maximumScreenSpaceError: 16,
      highlight: {
        type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
        color: "#00FF00"
      },
      popup: "all",
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // BIM model processing
  const layerWorkBIM = map.getLayerById(1987)

  // click event
  layerWorkBIM.on(mars3d.EventType.click, function (event) {
    console.log("3dtiles layer clicked", event)
  })

  // Traverse to retrieve all features and query their attributes
  // layerWorkBIM.readyPromise.then(function (e) {
  //   const allTileObj = {}
  //   layerWorkBIM.tileset.tileVisible.addEventListener((tile) => {
  //     const content = tile.content
  //     const featuresLength = content.featuresLength
  //     for (let i = 0; i < featuresLength; i++) {
  //       const feature = content.getFeature(i)
  //       const attr = mars3d.Util.get3DTileFeatureAttr(feature)
  //       allTileObj[attr.id] = attr
  //     }
  // // You can use allTileObj later
  //     console.log(allTileObj)
  //   })
  // })

  // keyboard roaming
  map.keyboardRoam.setOptions({
    moveStep: 0.1, // Translation step size (meters).
    dirStep: 50, // The step size of the camera's original rotation. The larger the value, the smaller the step size.
    rotateStep: 0.3, // Camera rotation rate around the target point, 0.3-2.0
    minPitch: 0.1, // Minimum elevation angle 0-1
    maxPitch: 0.95 // Maximum elevation angle 0-1
  })
  map.keyboardRoam.enabled = true // Enable keyboard roaming

  addPlaneClipThing(layerWorkBIM)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addPlaneClipThing(layerWorkBIM) {
  //Model cropping
  tilesetPlanClip = new mars3d.thing.TilesetPlanClip({
    layer: layerWorkBIM,
    clipType: mars3d.ClipType.ZR,
    distance: 100,
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
  })
  map.addThing(tilesetPlanClip)

  // Excavation area --- negative first floor
  terrainPlanClip = new mars3d.thing.TerrainPlanClip({
    positions: [
      [117.251176, 31.843707, 28.24],
      [117.251877, 31.843707, 28.24],
      [117.251877, 31.844216, 28.24],
      [117.251176, 31.844216, 28.24]
    ],
    diffHeight: 10, // height
    image: "./img/textures/poly-stone.jpg", // Boundary wall material
    imageBottom: "./img/textures/poly-soil.jpg", // Bottom area material
    splitNum: 50 // wall boundary interpolation number
  })
  map.addThing(terrainPlanClip)
}

function centerAtDX1() {
  map.setCameraView({ lat: 31.843703, lng: 117.251038, alt: 33, heading: 50, pitch: -6 })
}

function centerAtDX2() {
  map.setCameraView({ lat: 31.843816, lng: 117.250978, alt: 34, heading: 308, pitch: -8 })
}

function centerAtDX3() {
  map.setCameraView({ lat: 31.843789, lng: 117.251188, alt: 42, heading: 6, pitch: -31 })
}

// By controlling the distance value 1~5 and displaying all
function showModel(num) {
  terrainPlanClip.show = false
  tilesetPlanClip.distance = num
}

//D1 layer display
function showD1() {
  terrainPlanClip.show = true
  tilesetPlanClip.distance = -3.6
}
