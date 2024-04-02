// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tileLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 24.336939, lng: 108.949729, alt: 14990362, heading: 0, pitch: -90 }
  },
  control: {
    // baseLayerPicker: false,
    infoBox: false
  },
  layers: [
    {
      name: "Tile test information",
      type: "tileinfo",
      color: "rgba(255,255,0,0.6)",
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
  map = mapInstance //Record the first created map

  map.basemap = "Single image (local offline)"
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

//Load layer
function createTileLayer(options) {
  const params = {
    type: options.type, // type
    url: options.url, // layer url
    // subdomains: $("#txtSubdomains").val(), // url subdomain
    layer: options.txtLayer, // layer name

    crs: options.CRS, //Coordinate system information
    chinaCRS: options.chinaCRS, // Domestic coordinate system

    minimumLevel: options.minLoadLevel, // lowest level
    maximumLevel: options.maxLoadLevel, //The highest level
    minimumTerrainLevel: options.minShowLevel, // Display the minimum terrain detail level of the image layer
    maximumTerrainLevel: options.maxShowLevel, // Display the maximum terrain detail level of the image layer
    brightness: options.brightness, // brightness
    opacity: options.opacity // transparency
  }
  //Add new layer
  if (params.error) {
    globalMsg(params.msg)
    return
  }
  if (params.minimumLevel > params.maximumLevel) {
    return { error: true, msg: "The value of the lowest level must not be higher than the highest level" }
  }
  if (params.minimumTerrainLevel > params.maximumTerrainLevel) {
    return { error: true, msg: "The minimum detail must not be higher than the maximum detail" }
  }

  //Remove the original layer
  removeLayer()

  // draw area
  const rectangle = options.rectangle
  if (rectangle) {
    params.rectangle = rectangle
  }

  //Agent is selected
  if (params.chkProxy) {
    params.proxy = "//server.mars3d.cn/proxy/"
  } else {
    params.proxy = null
  }

  console.log("Layer parameters are", params)

  tileLayer = mars3d.LayerUtil.create({
    ...params,
    highlight: {
      clampToGround: true,
      fill: true,
      color: "#2deaf7",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9",
      outlineOpacity: 1.0
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(tileLayer)
}

// Remove and destroy the layer
function removeLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

// Data Update
function dataUpdate(params) {
  if (tileLayer) {
    params.flyTo = false
    createTileLayer(params)
  }
}

// Draw and clear areas
function btnDrawExtent(options) {
  if (tileLayer) {
    tileLayer.rectangle = null
  }
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      fill: false,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ff0000"
    },
    success: function (graphic) {
      const rectangle = mars3d.PolyUtil.formatRectangle(graphic._rectangle_draw)
      options.rectangle = rectangle
      eventTarget.fire("rectangle", { rectangle })
      createTileLayer(options)
    }
  })
}
function btnClearExtent() {
  map.graphicLayer.clear()
  if (tileLayer) {
    tileLayer.rectangle = null
    tileLayer.options.flyTo = false
    // tileLayer.reload()
  }
}

// Modify some values ​​of the layer
function changeOpacity(val) {
  if (tileLayer) {
    tileLayer.opacity = val
  }
}
function changeBrightness(val) {
  if (tileLayer) {
    tileLayer.brightness = val
  }
}

function creatHRectangleEntity(item) {
  map.graphicLayer.clear()
  const graphic = new mars3d.graphic.RectangleEntity({
    rectangle: Cesium.Rectangle.fromDegrees(item.xmin, item.ymin, item.xmax, item.ymax),
    style: {
      fill: false,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ff0000"
    }
  })
  map.graphicLayer.addGraphic(graphic)

  graphic.flyTo({ scale: 1.5 })
}

var saveParams = (updateValue) => {
  mars3d.Util.downloadFile("Tile layer parameters.json", JSON.stringify({ ...updateValue, center: map.getCameraView() }))
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
