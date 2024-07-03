// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.823874, lng: 117.223976, alt: 3509, heading: 0, pitch: -90 }
  },
  control: {
    baseLayerPicker: false
  }
}

/**
 * Construct bloom effect object
 * @type {mars3d.BloomEffect}
 */
let bloomEffect

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  console.log("onMounted executed")
  map = mapInstance //Record the first created map

  // Construct bloom effect for slide bar testing
  bloomEffect = new mars3d.effect.BloomEffect()
  map.addEffect(bloomEffect)

  eventTarget.fire("init", {
    value: 10
  })
  queryTilesetData()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  console.log("onUnmounted executed")
  map.graphicLayer.clear()
  map.removeEffect(bloomEffect, true)
  bloomEffect = null
  map = null
}

//Draw a rectangle (demonstrates the interaction between map.js and index.vue)
function drawExtent() {
  map.graphicLayer.clear()
  // draw rectangle
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      fill: true,
      color: "rgba(255,255,0,0.2)",
      outline: true,
      outlineWidth: 2,
      outlineColor: "rgba(255,255,0,1)"
    },
    success: function (graphic) {
      const rectangle = mars3d.PolyUtil.formatRectangle(graphic._rectangle_draw)
      eventTarget.fire("drawExtent", { extent: JSON.stringify(rectangle) }) // Throws an event, you can listen to the event in the component
    }
  })
}

// Whether to run map mouse interaction
function enableMapMouseController(value) {
  map.setSceneOptions({
    cameraController: {
      enableZoom: value,
      enableTranslate: value,
      enableRotate: value,
      enableTilt: value
    }
  })
}

//Adjust brightness (demo slider)
function updateBrightness(val) {
  bloomEffect.brightness = val
}

//Adjust contrast (demo slider)
function updateContrast(val) {
  bloomEffect.contrast = val
}

//Create layer
function createLayer(layer) {
  return mars3d.LayerUtil.create(layer)
}

// data collection
function queryTilesetData() {
  mars3d.Util.fetchJson({ url: "config/tileset.json" })
    .then(function (arr) {
      const modelData = arr.layers
      eventTarget.fire("loadTypeList", { modelData })
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}
