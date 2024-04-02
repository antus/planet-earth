// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  layers: [
    {
      type: "geojson",
      name: "Sample data",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "Test Model",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
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
  map = mapInstance

  map.on(mars3d.EventType.load, function (event) {
    console.log(`All map layers loaded`)
  })

  map.on(mars3d.EventType.keyup, function (e) {
    console.log("Keyboard pressed", e)
  })

  // on binding event
  map.on(mars3d.EventType.cameraChanged, this.map_cameraChangedHandler, this)
  map.on(mars3d.EventType.click, this.map_clickHandler, this)
  map.on(mars3d.EventType.dblClick, this.map_dblClickHandler, this)

  // off remove event
  // map.off(mars3d.EventType.cameraChanged, this.map_cameraChangedHandler, this)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let clickTimeId // Double click will trigger two click events.
function map_clickHandler(event) {
  clearTimeout(clickTimeId)
  clickTimeId = setTimeout(function () {
    console.log("mouse click", event)
  }, 250)
}

function map_dblClickHandler(event) {
  clearTimeout(clickTimeId)
  console.log("Double-click the mouse on the map", event)
}

function map_cameraChangedHandler(event) {
  console.log("Camera position completed", event)
}
