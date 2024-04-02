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
  ],
  layers: [
    {
      name: "Hefei City",
      type: "geojson",
      url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
      allowDrillPick: true, // Allow penetration, wms can pop up normally
      symbol: {
        styleOptions: {
          fill: true,
          color: "#ffffff",
          opacity: 0.1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 500000,
          distanceDisplayCondition_near: 0,
          outline: true,
          outlineStyle: {
            color: "#FED976",
            width: 3,
            opacity: 1
          },
          label: {
            // Center point of the surface, display text configuration
            text: "{name}", // Corresponding attribute name
            opacity: 1,
            font_size: 40,
            color: "#ffffff",

            font_family: "楷体",
            outline: true,
            outlineColor: "#000000",
            outlineWidth: 3,

            background: false,
            backgroundColor: "#000000",
            backgroundOpacity: 0.1,

            font_weight: "normal",
            font_style: "normal",

            scaleByDistance: true,
            scaleByDistance_far: 20000000,
            scaleByDistance_farValue: 0.1,
            scaleByDistance_near: 1000,
            scaleByDistance_nearValue: 1,

            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 200000,
            distanceDisplayCondition_near: 0,
            visibleDepth: false
          }
        }
      },
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

  addTileLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// overlaid layers
let arcGisLayer
function addTileLayer() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  arcGisLayer = new mars3d.layer.ArcGisLayer({
    name: "Hefei Building",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/guihua/MapServer",
    // layerDefs: `{ 0: "Land number = 'R2'" }`,

    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4326/MapServer',
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4490/MapServer', //Earth 2000 geographical coordinate system
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4548/MapServer', //Earth 2000 Gaussian projection coordinate system
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw2000/MapServer', //Earth 2000 Gaussian projection coordinate system
    // usePreCachedTilesIfAvailable: false, //When using the Earth 2000 Gaussian projection coordinate system, if it is a tile, please turn on this parameter
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

function removeTileLayer() {
  if (arcGisLayer) {
    map.removeLayer(arcGisLayer, true)
    arcGisLayer = null
  }
}


//Special custom parameter loading method.
// function addTileLayer2() {
//   arcGisLayer = new mars3d.layer.XyzLayer({
//     url: "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_map_2023/MapServer/tile/{custom_z}/{y}/{x}",
//     // minimumLevel: 4,
//     // maximumLevel: 18,
//     customTags: {
//       custom_z: function (imageryProvider, x, y, level) {
//         return level - 3
//       }
//     },
//     flyTo: true
//   })
//   map.addLayer(arcGisLayer)
// }
