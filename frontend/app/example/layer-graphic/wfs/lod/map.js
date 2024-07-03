// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.563158, lng: 116.329235, alt: 16165, heading: 0, pitch: -45 }
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
  map.on(mars3d.EventType.load, () => {
    LodGraphicLayer()
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function LodGraphicLayer() {
  const lodGraphicLayer = new mars3d.layer.LodGraphicLayer({
    IdField: "id", // The unique primary key of the data field name
    minimumLevel: 11, //Limit the level and only load data under this level. [Important parameters related to efficiency]
    debuggerTileInfo: true,
    //Request the data in the corresponding Tile tile based on the LOD block information
    queryGridData: (grid) => {
      return mars3d.Util.fetchJson({
        url: "//server.mars3d.cn/server/pointRandom/",
        queryParameters: {
          xmin: grid.extent.xmin,
          ymin: grid.extent.ymin,
          xmax: grid.extent.xmax,
          ymax: grid.extent.ymax,
          count: 5
        }
      }).then(function (data) {
        grid.list = data //list identifies the returned data
        return grid
      })
    },
    //Create vector object based on attr attribute [Must return Graphic object]
    createGraphic(grid, attr) {
      const height = map.getHeight(Cesium.Cartesian3.fromDegrees(attr.x, attr.y))

      const graphic = new mars3d.graphic.ModelPrimitive({
        position: [attr.x, attr.y, height],
        style: {
          url: "//data.mars3d.cn/gltf/mars/leida.glb",
          scale: 1,
          minimumPixelSize: 40
        }
      })
      lodGraphicLayer.addGraphic(graphic)

      return graphic
    }
  })
  map.addLayer(lodGraphicLayer)

  lodGraphicLayer.on(mars3d.EventType.click, (event) => {
    console.log("You clicked the object", event)
  })
}
