// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 27.689337, lng: 118.112448, alt: 762174, heading: 358, pitch: -62 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340000_full.json" })
    .then(function (geojson) {
      showBJXLine(geojson.features[0])
    })
    .catch(function () {
      globalAlert("Json file loading failed!")
    })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340000_full.json" })
    .then(function (geojson) {
      showGeoJsonVectorTile(geojson)
    })
    .catch(function () {
      globalAlert("Json file loading failed!")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * API documentation, refer to lib\mars3d\thirdParty\weiVectorTile\Document.rar (unzip Document.rar)
 *
 * @param {Array} geojson obtains the data array object
 * @returns {void} None
 */
function showGeoJsonVectorTile(geojson) {
  const tileLayer = new mars3d.layer.WeiVectorTileLayer({
    source: geojson,
    zIndex: 2,
    removeDuplicate: false,
    allowPick: true, // Allow clicks
    defaultStyle: {
      // Refer to the Cesium.VectorStyle class in the api documentation
      tileCacheSize: 200,

      fill: true, // Whether to fill or not, only surface data is valid.
      fillColor: "rgba(0,255,255,0.1)",

      outline: true, // Whether to display edges, only face data is valid.
      outlineColor: "rgba(138,138,138,1)",
      lineWidth: 2,

      showMaker: false,

      showCenterLabel: true, // Whether to display text, only valid for line and surface data
      centerLabelPropertyName: "name",
      fontColor: "rgba(255,255,255,1)",
      fontSize: 23,
      fontFamily: "楷体",
      labelOffsetX: -10,
      labelOffsetY: -5
    },
    minimumLevel: 1,
    maximumLevel: 20,
    simplify: false,
    styleFilter: function (feature, style, x, y, level) {
      if (level < 6) {
        style.fontSize = level * 2
      } else {
        style.fontSize = 23
      }

      if (feature.properties && feature.properties.name && feature.properties.name === "Hefei City") {
        style.fillColor = Cesium.Color.YELLOW.withAlpha(0.2)
      }
      return style
    },
    //The following are mars3d parameters, API reference http://mars3d.cn/api/BaseTileLayer.html#.ConstructorOptions
    hasToGraphic: true,
    highlight: {
      crs: mars3d.CRS.EPSG4326, // When the data coordinate system is inconsistent with the layer coordinate system, you can additionally specify it like this
      clampToGround: true,
      color: "#2deaf7",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9"
    },
    popup: "all"
  })
  map.addLayer(tileLayer)

  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

function showBJXLine(feature) {
  // buffer
  let bufferedOuter = turf.buffer(feature, 2000, {
    units: "meters"
  })
  let bufferedInner = turf.buffer(feature, 1000, {
    units: "meters"
  })

  bufferedInner = turf.difference(bufferedInner, feature)

  bufferedOuter = turf.difference(bufferedOuter, bufferedInner)

  bufferedInner = turf.featureCollection([bufferedInner])
  bufferedOuter = turf.featureCollection([bufferedOuter])

  const tileLayer = new mars3d.layer.WeiVectorTileLayer({
    source: bufferedOuter,
    zIndex: 99,
    removeDuplicate: false,
    defaultStyle: {
      outlineColor: "rgba(209,204,226,1)",
      lineWidth: 2,
      outline: true,
      fill: true,
      fillColor: "rgba(209,204,226,1)",
      tileCacheSize: 200,
      showMaker: false,
      showCenterLabel: false
    },
    maximumLevel: 20,
    minimumLevel: 5,
    simplify: false
  })
  map.addLayer(tileLayer)

  const tileLayer2 = new mars3d.layer.WeiVectorTileLayer({
    source: bufferedInner,
    zIndex: 99,
    removeDuplicate: false,
    defaultStyle: {
      outlineColor: "rgba(185,169,199,1)",
      lineWidth: 2,
      outline: true,
      fill: true,
      fillColor: "rgba(185,169,199,1)",
      tileCacheSize: 200,
      showMaker: false,
      showCenterLabel: false
    },
    maximumLevel: 20,
    minimumLevel: 5,
    simplify: false
  })
  map.addLayer(tileLayer2)
}
