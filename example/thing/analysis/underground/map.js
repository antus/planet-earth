// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let underground

var mapOptions = {
  scene: {
    center: { lat: 31.840106, lng: 117.216768, alt: 554, heading: 0, pitch: -59 },
    orderIndependentTranslucency: false,
    contextOptions: { webgl: { alpha: true } }, // Allow transparency, only Map initialization can be passed in [key code]
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      depthTestAgainstTerrain: true // Turn on depth detection
    }
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
  map.container.style.backgroundColor = "#546a53" // Background color

  globalNotify("Known Issue Tips", `(1) After enabling transparency, there is a black gap at the connection between the tiles of the enlarged level basemap `)

  addLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addLayer() {
  underground = new mars3d.thing.Underground({
    alpha: 0.5
  })
  map.addThing(underground)

  /* // Personalization of underground colors
  underground.color = Cesium.Color.BLACK
  underground.colorAlphaByDistance = new Cesium.NearFarScalar(1000.0, 0.0, 1000000.0, 1.0) */

  //Add a model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Underground Pipe Network",
    url: "//data.mars3d.cn/3dtiles/max-piping/tileset.json",
    position: { lng: 117.215457, lat: 31.843363, alt: -3.6 },
    rotation: { z: 336.7 },
    maximumScreenSpaceError: 2,
    highlight: { type: "click", color: "#00FFFF" },
    popup: "all",
    center: { lat: 31.838081, lng: 117.216584, alt: 406, heading: 1, pitch: -34 }
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //yellow box
  const graphic = new mars3d.graphic.BoxEntity({
    position: [117.218633, 31.843935, 41.43],
    style: {
      dimensions: new Cesium.Cartesian3(40.0, 30.0, 50.0),
      fill: true,
      color: "#ffff00",
      opacity: 1
    }
  })
  graphicLayer.addGraphic(graphic)

  //Create gltf model
  const graphicModel = new mars3d.graphic.ModelEntity({
    position: [117.214494, 31.844015, 30],
    style: {
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche2.gltf",
      scale: 7,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphicModel)
}

// top view
function centerAtDX1() {
  map.setCameraView({
    y: 31.840106,
    x: 117.216768,
    z: 554.36,
    heading: 0,
    pitch: -59.3,
    roll: 0
  })
}

// Underground perspective 1
function centerAtDX2() {
  map.setCameraView({
    y: 31.841263,
    x: 117.21538,
    z: -13.35,
    heading: 40.6,
    pitch: 15.7,
    roll: 0.1
  })
}

// Underground perspective 2
function centerAtDX3() {
  map.setCameraView({
    y: 31.838908,
    x: 117.217486,
    z: -63.75,
    heading: 349.2,
    pitch: 18.2,
    roll: 0
  })
}

//Transparency changes
function opacityChange(value) {
  underground.alpha = value
}

// Check box, whether to enable underground mode
function chkUnderground(value) {
  underground.enabled = value
}
