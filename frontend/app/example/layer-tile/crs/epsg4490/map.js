// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.211374, lng: 117.277002, alt: 1200952, heading: 354, pitch: -72 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "XYZ Tiles",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "http://t3.tianditu.gov.cn/img_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={z}&layer=img&style=default&tilerow={y}&tilecol={x}&tilematrixset=c&format=tiles&tk=6c99c7793f41fccc4bd595b03711913e",
      crs: "EPSG:4490", // Identifies the coordinate system
      // queryParameters: {
      // // You can pass custom url parameters, such as token, etc.
      //   token: "mars3d"
      // },
      show: true
    }
  ],
  layers: [
    {
      name: "Shandong Electronics",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "http://service1.sdmap.gov.cn/tileservice/sdpubmap?layer=SDPubMap&style=default&tilematrixset=default028mm&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=2ec5b748cca9b24b6474d6857deec02e",
      crs: "EPSG:4490",
      rectangle: { xmin: 114.229839088925, xmax: 123.400530149205, ymin: 33.9389305555556, ymax: 38.9048194444444 },
      minimumLevel: 7,
      maximumLevel: 18,
      show: true
    }
    // {
    // "name": "arcgis service",
    //     "icon": "img/basemaps/google_vec.png",
    //     "type": "xyz",
    //     "url": "https://localhost:6080/arcgis/rest/services/test/MapServer/tile/{z}/{y}/{x}",
    //     "crs": "EPSG:4490",
    //     "minimumLevel": 0,
    //     "maximumLevel": 18
    // },
    // {
    //     "name": "WMTS",
    //     "icon": "img/basemaps/google_vec.png",
    //     "type": "xyz",
    //     "url": "http://47.106.133.145:20000/geowebcache/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=arcgis-China&STYLE=_null&FORMAT=image/jpeg&TILEMATRIXSET=EPSG:4326_arcgis-China&TILEMATRIX=EPSG:4326_arcgis-China:{z}&TILEROW={y}&TILECOL={x}",
    //     "crs": "EPSG:4490",
    //     "minimumLevel": 0,
    //     "maximumLevel": 18,
    // "proxy": "//server.mars3d.cn/proxy/", //Proxy service to solve cross-domain problems
    // }
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

// overlaid layers
let tileLayer

function addTileLayer() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.ArcGisLayer({
    url: "//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4490/MapServer", // Earth 2000 geographical coordinate system
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

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
