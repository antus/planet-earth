// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.931953, lng: 117.352307, alt: 207201, heading: 0, pitch: -64 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "ArcGIS Imagery",
      icon: "img/basemaps/esriWorldImagery.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      enablePickFeatures: false,
      show: true
    },
    {
      name: "ArcGIS Electronic Street",
      icon: "img/basemaps/google_vec.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      enablePickFeatures: false
    },
    {
      name: "ArcGIS NatGeo",
      icon: "img/basemaps/esriWorldStreetMap.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
      enablePickFeatures: false
    },
    {
      name: "Blue Basemap",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "arcgis",
      url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      enablePickFeatures: false,
      chinaCRS: mars3d.ChinaCRS.GCJ02
    },
    {
      name: "Gray basemap",
      icon: "img/basemaps/bd-c-grayscale.png",
      type: "arcgis",
      url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer",
      enablePickFeatures: false,
      chinaCRS: mars3d.ChinaCRS.GCJ02
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Overlay layers
 *
 * @export
 * @returns {void}
 */
let arcGisLayer
function addLayer() {
  removeLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  arcGisLayer = new mars3d.layer.ArcGisLayer({
    name: "Hefei Building",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/guihua/MapServer",
    // usePreCachedTilesIfAvailable: false, // Please turn on this parameter when using non-standard tiles or the Earth 2000 Gaussian projection coordinate system
    // layerDefs: `{ 0: "Land number = 'R2'" }`,

    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4326/MapServer',
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4490/MapServer', //Earth 2000 geographical coordinate system
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4548/MapServer', //Earth 2000 Gaussian projection coordinate system
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw2000/MapServer', //Earth 2000 Gaussian projection coordinate system
    // queryParameters: { returnGeometry: false },
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
  map.addLayer(arcGisLayer)

  //Bind event
  arcGisLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("Loading completed service information", event)
  })

  arcGisLayer.on(mars3d.EventType.click, function (event) {
    console.log("Clicked vector data, total" + event.features.length + "bar", event)
  })
}

//Remove layer
function removeLayer() {
  if (arcGisLayer) {
    map.removeLayer(arcGisLayer, true)
    arcGisLayer = null
  }
}
