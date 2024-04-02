// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.753913, lng: 116.271687, alt: 7959.2, heading: 5.5, pitch: -39.1 }
  },
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

  // Modify the style of the 3D map
  const dom3d = document.getElementById("centerDiv3D")
  dom3d.style.left = "50%"
  dom3d.style.width = "50%"

  //Create 2d map
  const mapDiv = mars3d.DomUtil.create("div", "", document.body)
  mapDiv.setAttribute("id", "centerDiv2D")
  mapDiv.style.width = "50%"

  const map2ds = mars3d.DomUtil.create("div", "", mapDiv)
  map2ds.setAttribute("id", "map2d")
  map2ds.setAttribute("class", "mars2d-container")

  const tileWorldImagery = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      crossOrigin: "Anonymous"
    })
  })

  const map2d = new ol.Map({
    target: "map2d",
    projection: "EPSG:3857",
    layers: [tileWorldImagery],

    view: new ol.View({
      center: ol.proj.fromLonLat([134.364805, 26.710497]),
      zoom: 4,
      minZoom: 2
    })
  })

  // Linkage controller
  const ol3d = new olcs.OLCesium({ map: map2d, viewer: map.viewer })

  //Remove ol synchronized base map
  const layers = map.imageryLayers._layers
  for (let i = layers.length - 1; i >= 0; i--) {
    const imageLayer = layers[i]
    if (imageLayer._mars3d_config) {
      continue
    }
    map.imageryLayers.remove(imageLayer)
  }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
