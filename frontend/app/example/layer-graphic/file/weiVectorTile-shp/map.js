// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.221078, lng: 117.305076, alt: 136530, heading: 10, pitch: -68 }
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
  showWeiVectorTileLayer()
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
 * Show national boundaries
 *
 * @returns {void}
 */
function showWeiVectorTileLayer() {
  // shp national boundary line

  Promise.all([
    Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.shp" }),
    Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.dbf" }),
    Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.prj" })
  ]).then(function (files) {
    files[0].name = "hefei.shp"
    files[1].name = "hefei.dbf"
    files[2].name = "hefei.prj"

    const tileLayer = new mars3d.layer.WeiVectorTileLayer({
      source: files,
      removeDuplicate: false,
      zIndex: 2,
      encoding: "utf-8",
      defaultStyle: {
        // Refer to the Cesium.VectorStyle class in the api documentation
        tileCacheSize: 200,

        fill: true, // Whether to fill or not, only surface data is valid.
        fillColor: "rgba(255,255,255,0.01)",

        outline: true, // Whether to display edges, only face data is valid.
        outlineColor: "rgba(209,204,226,1)",
        // lineDash: [3, 10],
        lineWidth: 2,

        showMaker: false, // Need to open when dotted
        // markerImage: "img/marker/lace-red.png",

        showCenterLabel: false
        // showCenterLabel: true, // Whether to display text, only valid for line and surface data
        // centerLabelPropertyName: "name",
        // fontColor: "rgba(255,255,255,0.8)",
        // fontSize: 16,
        // fontFamily: "楷体",
        // labelOffsetX: -10,
        // labelOffsetY: -5
      },
      maximumLevel: 20,
      minimumLevel: 1,
      simplify: false,
      allowPick: true, // Allow clicks
      //The following are mars3d parameters, API reference http://mars3d.cn/api/BaseTileLayer.html#.ConstructorOptions
      maxLength: -1,
      popup: "all",
      flyTo: true
    })
    map.addLayer(tileLayer)

    tileLayer.on(mars3d.EventType.load, function (event) {
      console.log("Loading completed", event)
    })

    tileLayer.on(mars3d.EventType.click, function (event) {
      console.log("Layer clicked", event)
    })
  })
}
