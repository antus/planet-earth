// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.818816, lng: 117.221131, alt: 2553, heading: 0, pitch: -55 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  map.basemap = 2017 // switch to blue basemap

  addTilesetLayer()
  addGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Hefei city building model
function addTilesetLayer() {
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    marsJzwStyle: true, // Turn on building special effects (built-in Shader code)
    style: {
      color: {
        conditions: [["true", "rgba(16, 119, 209, 1)"]]
      }
    },
    // crop area
    planClip: {
      positions: [
        [117.22648, 31.827441],
        [117.210341, 31.830612],
        [117.211311, 31.842438],
        [117.226091, 31.842885]
      ],
      clipOutSide: true // outer clipping
    }
  })
  map.addLayer(tiles3dLayer)
}

function addGraphics() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/hefei-shequ.json" })
    .then(function (geojson) {
      const arr = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]

        //polygon face
        const polygonEntity = new mars3d.graphic.PolygonEntity({
          positions: item.positions,
          style: {
            color: item.attr.color,
            opacity: 0.4
          },
          attr: { remark: "polygon face" }
        })
        graphicLayer.addGraphic(polygonEntity)

        // PolylineEntity line
        const graphicLine = new mars3d.graphic.PolylineEntity({
          positions: item.positions,
          style: {
            width: 4,
            closure: true,
            materialType: mars3d.MaterialType.LineTrail,
            materialOptions: {
              color: item.attr.color,
              speed: 4
            }
          },
          attr: { remark: "PolylineEntity line" }
        })
        graphicLayer.addGraphic(graphicLine)

        //Dynamic border text DIV
        const graphic = new mars3d.graphic.DivBoderLabel({
          position: polygonEntity.center,
          style: {
            text: item.attr.name,
            font_size: 15,
            font_family: "Microsoft Yahei",
            color: "#ccc",
            boderColor: "#15d1f2",
            addHeight: 100
          },
          attr: { remark: "DIV vector data" }
        })
        graphicLayer.addGraphic(graphic)
      }
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}
