// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

const arrData = [
  { name: "Oil Tank One", position: [117.09521, 31.814404, 47.3] },
  { name: "Oil Tank Two", position: [117.095206, 31.814878, 47.3] },
  { name: "Oil Tank Three", position: [117.094653, 31.814428, 47.3] },
  { name: "Generator", position: [117.093428, 31.816959, 31.8] },
  { name: "Command Room", position: [117.093953, 31.814397, 36] },
  { name: "Heating tank", position: [117.09385, 31.815837, 36.9] },
  { name: "Cooling Room", position: [117.094662, 31.816403, 32.9] }
]

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.81226, lng: 117.096703, alt: 231, heading: 329, pitch: -28 }
  }
}

/**
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Load the oilfield joint station model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2020,
    type: "3dtiles",
    name: "Oilfield Union Station",
    url: "//data.mars3d.cn/3dtiles/max-ytlhz/tileset.json",
    position: { lng: 117.094224, lat: 31.815859, alt: 26.4 },
    rotation: { z: 116.2 },
    maximumScreenSpaceError: 1,
    center: { lat: 32.407076, lng: 117.459703, alt: 3361, heading: 358, pitch: -51 }
  })
  map.addLayer(tiles3dLayer)

  //Create DIV data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.

  // initial load
  divGraphicYellow()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// Effect one
function divGraphicYellow() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivGraphic({
      position: item.position,
      style: {
        html: `<div class="marsBlackPanel  animation-spaceInDown">
                <div class="marsBlackPanel-text" style="">
                  ${item.name} <span class="temperature"></span> ℃
                </div>
              </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      },
      attr: {
        index: i + 1,
        duNum: 0
      }
    })
    graphicLayer.addGraphic(divGraphic)

    // Refresh the local DOM without affecting the operations of other controls in the popup panel.
    divGraphic.on(mars3d.EventType.popupRender, function (event) {
      const container = event.container // DOM corresponding to popup
      const graphic = event.target

      const oldVal = graphic.attr.duNum

      const newVal = Number(mars3d.Util.formatDate(new Date(), "ss")) + graphic.attr.index
      if (oldVal !== newVal) {
        graphic.attr.duNum = newVal
        const temperatureDom = container.querySelector(".temperature")
        if (temperatureDom) {
          temperatureDom.innerHTML = newVal
        }
      }
    })
  }
}

// Effect two
function divGraphicBule() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivGraphic({
      position: item.position,
      style: {
        html: `<div class="marsBlueGradientPnl">
            <div>${item.name}</div>
        </div>`,
        offsetY: -60,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BTOOM
      }
    })
    graphicLayer.addGraphic(divGraphic)
  }
}

// Effect three
function divGraphicWhite() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivUpLabel({
      position: item.position,
      style: {
        text: item.name,
        color: "#fff",
        font_size: 16,
        font_family: "Microsoft Yahei",
        lineHeight: 50,
        circleSize: 8,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000) //Display according to sight distance
      }
    })
    graphicLayer.addGraphic(divGraphic)
  }
}

// Effect four
function divGraphicHotSpot() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivGraphic({
      position: item.position,
      style: {
        html: `<div class="mars-spot">
        <div class="mars-spot-board">
        <h5>${item.name}</h5>
        </div>
        <div class="mars-spot-line"></div>
      </div>`,
        offsetY: -60,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BTOOM
      }
    })
    graphicLayer.addGraphic(divGraphic)
  }
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}
