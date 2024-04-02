// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.816469, lng: 117.188323, alt: 6109.8, heading: 358.1, pitch: -64.6 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    // {
    // name: "Light Pollution Layer",
    //   icon: "img/basemaps/blackMarble.png",
    //   type: "wms",
    //   url: "//www.lightpollutionmap.info/geoserver/gwc/service/wms",
    //   layers: "PostGIS:VIIRS_2019",
    //   crs: "EPSG:3857",
    //   parameters: {
    //     transparent: true,
    //     format: "image/png"
    //   },
    // alpha: 0.6, // transparency
    // proxy: "//server.mars3d.cn/proxy/", // Proxy service to solve cross-domain problems
    //   show: true
    // },
    // {
    // // wms can also be written in a direct way of writing xyz
    // name: "Light pollution layer (XYZ mode)",
    //   icon: "img/basemaps/blackMarble.png",
    //   type: "xyz",
    //   url: "//www.lightpollutionmap.info/geoserver/gwc/service/wms?transparent=true&format=image%2Fpng&service=WMS&version=1.1.1&request=GetMap&styles=&layers=PostGIS%3AVIIRS_2019&bbox={westProjected},{southProjected},{eastProjected},{northProjected}&width={width}&height={height}&srs=EPSG%3A3857",
    // alpha: 0.6, // transparency
    // proxy: "//server.mars3d.cn/proxy/" // Proxy service to solve cross-domain problems
    // },
    {
      name: "Single picture",
      icon: "img/basemaps/offline.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg",
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
let tileLayer

//Change the case of wms request
// Cesium.Resource.ReplaceUrl = function (url) {
//   if (this._url.startsWith("//server.mars3d.cn/geoserver/mars/wms")) {
//     return url.replaceAll("bbox", "BBOX")
//   } else {
//     return url
//   }
// }

function addTileLayer() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.WmsLayer({
    url: "//server.mars3d.cn/geoserver/mars/wms",
    layers: "mars:hf",
    parameters: {
      transparent: true,
      format: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10
    },
    // Click highlight and its style
    highlight: {
      type: "wallP",
      diffHeight: 100,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#ffff00",
        speed: 10, // Speed, recommended value range 1-100
        axisY: true
      }
    },
    popup: "all"
    // popupOptions: {
    //   autoClose: false,
    //   closeOnClick: false,
    //   checkData: function (attr, graphic) {
    //     if (Cesium.defined(attr.OBJECTID)) {
    //       return graphic.attr.OBJECTID === attr.OBJECTID
    //     }
    //     if (Cesium.defined(attr.NAME)) {
    //       return graphic.attr.NAME === attr.NAME
    //     }
    //     return false
    //   }
    // },
    // flyTo: true
  })
  map.addLayer(tileLayer)

  // click event
  tileLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("GetCapabilities loaded", event)

    setTimeout(() => {
      map.mouseEvent.pickImageryLayerFeatures([117.169993, 31.842132, 214.6]).then((result) => {
        console.log("Manually simulated click and returned:", result)
      })
    }, 6000)
  })
  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("Clicked vector data, total" + event.features.length + "bar", event)
  })
}

function addTileLayer2() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.WmsLayer({
    url: "https://localhost/geoserver/wms",
    layers: "sz_building:building_plat",
    parameters: {
      tiled: true,
      VERSION: "1.1.1",
      transparent: true,
      FORMAT: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10,
      INFO_FORMAT: "text/plain"
    },
    // When the wms service in json format is not supported, you can customize the method to parse the data.
    featureToGraphic: (feature, event) => {
      const data = feature.data

      //Add the code to parse the data yourself. The following is a test demonstration
      const attr = {}
      attr["name"] = "Huanggang Village Cultural Square and Music Fountain"
      attr["street name"] = "Futian Street"
      attr["community name"] = "Huanggang Community"

      // Return the construction parameters corresponding to graphic
      return {
        type: "point",
        position: event.cartesian,
        style: {
          color: "#ff0000",
          pixelSize: 10,
          outlineColor: "#ffffff",
          outlineWidth: 2
        },
        attr
      }
    },
    popup: "all",
    flyTo: true,
    show: true
  })
  map.addLayer(tileLayer)

  // click event
  tileLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("GetCapabilities loaded", event)
  })
  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("Clicked vector data, total" + event.features.length + "bar", event)
  })
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
