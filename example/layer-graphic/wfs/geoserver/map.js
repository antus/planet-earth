// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.798703, lng: 117.207366, alt: 2033, heading: 31, pitch: -29 }
  },
  terrain: {
    show: false
  },
  layers: [
    {
      name: "Hefei Education Point",
      type: "wfs",
      url: "//server.mars3d.cn/geoserver/mars/wfs",
      layer: "mars:hfjy",
      parameters: {
        //Supports all wfs parameters
        maxFeatures: 500
      },
      minimumLevel: 13,
      debuggerTileInfo: false,
      symbol: {
        type: "billboardP",
        styleOptions: {
          image: "img/marker/mark-red.png",
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: true,
          scaleByDistance_far: 20000,
          scaleByDistance_farValue: 0.6,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
          clampToGround: true,
          label: {
            text: "{project name}",
            font_size: 15,
            color: "#ffffff",
            outline: true,
            outlineColor: "#000000",
            pixelOffsetY: -30,
            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 2000,
            distanceDisplayCondition_near: 0
          }
        }
      },
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
  map = mapInstance //Record the first created map
  map.basemap = 2017 // blue basemap

  addWmsLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
/**
 * WFS layer
 *
 * @returns {void} None
 */
function addWmsLayer() {
  const changeLevel = 15

  // Tile image, for reference
  const tileLayer = new mars3d.layer.WmsLayer({
    name: "Building Surface WMS",
    type: "wms",
    url: "//server.mars3d.cn/geoserver/mars/wms",
    layers: "mars:hfjzw",
    crs: "EPSG:4326",
    parameters: {
      transparent: "true",
      format: "image/png"
    },
    maximumLevel: changeLevel - 1,
    maximumTerrainLevel: changeLevel - 1,
    popup: "Name: {NAME}<br />Number of floors: {floor}",
    show: true
  })
  map.addLayer(tileLayer)

  const wfsLayer = new mars3d.layer.WfsLayer({
    name: "Building Surface WFS",
    url: "//server.mars3d.cn/geoserver/mars/wfs",
    layer: "mars:hfjzw",
    parameters: {
      //Supports all wfs parameters
      maxFeatures: 210
    },
    minimumLevel: changeLevel,
    symbol: {
      type: "polygonP",
      styleOptions: {
        color: "#00469c",
        outline: false,
        opacity: 1
      }
    },
    buildings: {
      cloumn: "floor"
    },
    debuggerTileInfo: false,
    popup: "Name: {NAME}<br />Number of floors: {floor}",
    show: true
  })
  map.addLayer(wfsLayer)

  //Bind event
  wfsLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })

  let timeTik
  wfsLayer.on(mars3d.EventType.update, function (event) {
    console.log(`Data in layer updated`, event)

    clearTimeout(timeTik)
    timeTik = setTimeout(() => {
      if (!wfsLayer.isLoading) {
        console.log(`This batch of data loading is completed`)
      }
    }, 1000)
  })
}

//Layer state The layer managed in the component
function getManagerLayer() {
  return map.getLayerByAttr("Building surface WFS", "name")
}
