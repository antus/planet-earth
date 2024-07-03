// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.649617, lng: 117.081721, alt: 444, heading: 348, pitch: -25 }
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

  //Load the petrochemical plant model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "http://data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  //Create DIV data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("You clicked", event)
  })

  // Bind the right-click menu to the layer
  graphicLayer.bindContextMenu(
    [
      {
        text: "View camera",
        icon: "fa fa-trash-o",
        callback: (e) => {
          const graphic = e.graphic

          globalMsg("right-click menu example")
        }
      }
    ],
    { offsetY: -170 }
  )

  graphicLayer.bindPopup((event) => {
    const attr = event.graphic.attr || {}
    if (!attr) {
      return
    }

    return `<iframe style="width: 600px; height: 300px; border: none; "src="${attr.url}"></iframe> `
  })

  // adding data
  addRandomGraphicByCount(graphicLayer, [117.080397, 31.656139, 33.3])
  addRandomGraphicByCount(graphicLayer, [117.078006, 31.65649, 49.4])
  addRandomGraphicByCount(graphicLayer, [117.080571, 31.657898, 50.2])
  addRandomGraphicByCount(graphicLayer, [117.078331, 31.660016, 47.2])

  // console.log("Export data test", graphicLayer.toJSON())
  // const layer = mars3d.LayerUtil.create(json)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addRandomGraphicByCount(graphicLayer, position) {
  const graphic = new mars3d.graphic.BillboardEntity({
    position,
    style: {
      image: "img/marker/lace-blue.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { url: "https://www.720yun.com/vr/b32jOOkmvm5", name: "Shanghai Pujiang Country Park" }
  })
  graphicLayer.addGraphic(graphic)
}
