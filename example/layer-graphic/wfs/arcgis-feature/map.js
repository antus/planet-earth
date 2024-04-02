// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.810597, lng: 117.220617, alt: 1038, heading: 13, pitch: -30 }
  },
  terrain: {
    show: false
  },
  // Method 1: Configure in the parameters before creating the earth
  layers: [
    {
      name: "Point of Interest",
      type: "arcgis_wfs",
      url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/1",
      where: " 1=1 ",
      minimumLevel: 16,
      symbol: {
        type: "billboardP",
        styleOptions: {
          image: "img/marker/mark-blue.png",
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
          label: {
            text: "{NAME}",
            font_size: 15,
            color: "#ffffff",
            outline: true,
            outlineColor: "#000000",
            pixelOffsetY: -30,
            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 1500,
            distanceDisplayCondition_near: 0
          }
        }
      },
      popup: "Name: {NAME}<br />Address: {address}",
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

  //Add presentation layer
  addArcGisWFSLayer1()
  addArcGisWFSLayer2()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
function addArcGisWFSLayer1() {
  const changeLevel = 15

  // Tile image, used for comparison reference
  const tileLayer = new mars3d.layer.ArcGisLayer({
    name: "tile layer",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer",
    layers: "37",
    popup: "Data: Tile Layer<br />Name: {NAME}<br />Number of layers: {floor}",
    maximumLevel: changeLevel - 1,
    maximumTerrainLevel: changeLevel - 1
  })
  map.addLayer(tileLayer)

  // dynamic vector graphics
  const wfsLayer = new mars3d.layer.ArcGisWfsLayer({
    name: "Building Floor Vector Layer",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/37",
    where: " NAME like '%Hefei%' ",
    minimumLevel: changeLevel,
    symbol: {
      type: "polygonP",
      styleOptions: {
        color: "#FED976",
        outline: false,
        opacity: 1
      }
    },
    buildings: {
      cloumn: "floor"
    },
    debuggerTileInfo: false,
    popup: "Data: Vector Layer<br />Name: {NAME}<br />Number of layers: {floor}"
  })
  map.addLayer(wfsLayer)

  //Bind event
  wfsLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("Loading completed service information", event)
  })

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

  setTimeout(function () {
    // Test replacement conditions
    wfsLayer.setWhere(" 1=1 ")
  }, 10000)
}

// Suitable for a small amount of data less than 1000, one-time request to load
function addArcGisWFSLayer2() {
  // One-time loaded wfs layer
  const wfsLayer = new mars3d.layer.ArcGisWfsSingleLayer({
    name: "Hefei Boundary Line",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/41",
    symbol: {
      type: "polyline",
      styleOptions: {
        color: "#39E09B",
        width: 8,
        opacity: 0.8
      }
    },
    popup: "all"
  })
  map.addLayer(wfsLayer)
}

//Layer state The layer managed in the component
function getManagerLayer() {
  return map.getLayerByAttr("Building surface vector layer", "name")
}
