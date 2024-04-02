// import * as mars3d from "mars3d"

function initMap() {
  //Configure basemaps parameters in the parameters before creating the earth
  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 14.029537, lng: 105.94238, alt: 4879779, heading: 0, pitch: -66 }
    },
    control: {
      baseLayerPicker: true, // basemaps basemap switching button
      homeButton: true, //View reset button
      sceneModePicker: true, // 2D and 3D switching button
      navigationHelpButton: true, // Help button
      fullscreenButton: true, // full screen button
      contextmenu: { hasDefault: true } // Right-click menu
    },
    basemaps: [
      {
        name: "Heaven Map Image",
        icon: "img/basemaps/tdt_img.png",
        type: "tdt",
        layer: "img_d",
        show: true
      },
      {
        name: "Offline Map",
        icon: "img/basemaps/mapboxSatellite.png",
        type: "xyz",
        url: "//data.mars3d.cn/tile/googleImg/{z}/{x}/{y}.jpg",
        maximumLevel: 12
      },
      {
        name: "Single picture",
        icon: "img/basemaps/offline.png",
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg"
      }
    ]
  })

  //According to the id or name attribute of the config configuration, update and display the specified map base map
  // map.basemap = 'Offline map'
}

//basemaps says supported layer types (tileLayer)
// "type": "image"
// "type": "xyz"
// "type": "wms"
// "type": "wmts"
// "type": "tms"
// "type": "arcgis"
// "type": "arcgis_cache"
// "type": "gee"

// "type": "tileinfo" tile information (generally used for testing)
// "type": "grid" grid lines (generally used in no-map mode)

// "type": "tdt"
// "type": "gaode"
// "type": "baidu"
// "type": "tencent"
// "type": "osm"
// "type": "google"
// "type": "bing"
// "type": "mapbox"
// "type": "ion"
