// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 26.163233, lng: 77.849567, alt: 17754541, heading: 0, pitch: -90 },
    sceneMode: 2
  },
  terrain: false
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  map.basemap = 2017 // blue basemap

  // Download Data
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/oneBeltOneRoad.json" })
    .then(function (res) {
      showRoad(res.data.land, {
        name: "Silk Road Economic Belt",
        color: Cesium.Color.CORAL
      })

      showRoad(res.data.sea, {
        name: "21st Century Maritime Silk Road",
        color: Cesium.Color.DEEPSKYBLUE
      })
    })
    .catch(function () {
      globalMsg("Real-time information query failed, please try again later")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showRoad(arr, options) {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  let arrPosition = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y)
    item.position = position

    arrPosition.push(position)

    //Create points
    if (item.icon) {
      const billboardPrimitive = new mars3d.graphic.BillboardPrimitive({
        name: item.name,
        position,
        style: {
          image: "img/country/" + item.icon,
          scale: 0.7,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          label: {
            text: item.name,
            font_size: 17,
            font_family: "楷体",
            color: Cesium.Color.WHITE,
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -30)
          }
        }
      })
      graphicLayer.addGraphic(billboardPrimitive)

      const html = `<div class="mars-load-location">
        ${item.continent} - ${item.country} - <span style="color: #00ffff;">${item.name}</span>
      </div>`
      billboardPrimitive.bindPopup(html)
    }
  }

  arrPosition = arrPosition.reverse()
  const positions = mars3d.PolyUtil.getBezierCurve(arrPosition)
  positions.push(arrPosition[arrPosition.length - 1])

  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions,
    style: {
      width: 4,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-pulse.png",
        color: options.color,
        repeat: new Cesium.Cartesian2(10.0, 1.0),
        speed: 2
      }
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindTooltip(options.name)
}
