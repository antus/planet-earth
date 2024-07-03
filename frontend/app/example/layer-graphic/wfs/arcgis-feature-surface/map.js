// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.838348, lng: 117.206494, alt: 752, heading: 359, pitch: -54 }
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

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei National University Science and Technology Park",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 80 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  const graphicLayer = new mars3d.layer.ArcGisWfsLayer({
    name: "Point of Interest",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/1",
    where: " NAME like '%University%' ",
    minimumLevel: 15,
    symbol: {
      type: "billboardP",
      styleOptions: {
        image: "img/marker/mark-blue.png",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        label: {
          text: "{NAME}",
          font_size: 15,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -30
        }
      }
    },
    popup: "Name: {NAME}<br />Address: {address}",
    show: true
  })
  graphicLayer.on(mars3d.EventType.addGraphic, function (event) {
    updateAutoSurfaceHeight(event.graphic)
  })

  map.on(mars3d.EventType.load, function (event) {
    map.addLayer(graphicLayer)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Automatically attach points to the ground
function updateAutoSurfaceHeight(graphic) {
  if (!graphic.position) {
    return
  }

  // Click and paste model test
  const position = graphic.position
  mars3d.PointUtil.getSurfaceHeight(map.scene, position, { has3dtiles: true }).then((result) => {
    console.log("Original height is: " + result.height_original.toFixed(2) + ", floor-mounted height: " + result.height.toFixed(2))

    graphic.position = result.position
  })
}
