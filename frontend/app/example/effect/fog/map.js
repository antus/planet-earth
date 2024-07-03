// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let fogEffect

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.251138, lng: 121.463588, alt: 1730, heading: 111, pitch: -25 }
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

  //Create gltf model,
  const graphicLayer = new mars3d.layer.GraphicLayer({
    name: "Shanghai Pudong",
    data: [
      {
        type: "model",
        position: [121.507762, 31.233975, 200],
        style: {
          url: "//data.mars3d.cn/gltf/mars/shanghai/pudong/scene.gltf",
          scale: 520,
          heading: 215
        }
      }
    ],
    center: { lat: 31.251138, lng: 121.463588, alt: 1729.97, heading: 110.7, pitch: -25, roll: 0.2 },
    popup: "Shanghai Pudong Model",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // fog effect
  fogEffect = new mars3d.effect.FogEffect({
    maxHeight: 20000, // Do not display if the height is greater than this
    fogByDistance: new Cesium.Cartesian4(100, 0.0, 9000, 0.9),
    color: Cesium.Color.WHITE
  })
  map.addEffect(fogEffect)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to start the fog effect
function setFogEffect(val) {
  fogEffect.enabled = val
}

//Change the color of the fog
function setColor(color) {
  fogEffect.color = Cesium.Color.fromCssColorString(color)
}

//Modify near and far distance
function setDistanceX(val) {
  fogEffect.fogByDistance.x = val
}

function setDistanceZ(val) {
  fogEffect.fogByDistance.z = val
}
