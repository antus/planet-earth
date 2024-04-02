// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 17.372658, lng: 109.327197, alt: 3459173, heading: 12, pitch: -69 },
    fxaa: true
  },
  terrain: false,
  basemaps: [
    {
      name: "Blue Basemap",
      icon: "//data.mars3d.cn/file/img/world/blue.jpg",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/blue.jpg",
      show: true
    }
  ],
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Geographical location of first-tier and above cities
  const arrStart = [
    { name: "Beijing", position: [116.395645038, 39.9299857781] },
    { name: "Shanghai", position: [121.487899486, 31.24916171] },
    { name: "Guangzhou", position: [113.307649675, 23.1200491021] },
    { name: "Shenzhen", position: [114.025973657, 22.5460535462] },
    { name: "Chengdu", position: [104.067923463, 30.6799428454] },
    { name: "Hangzhou", position: [120.219375416, 30.2592444615] },
    { name: "Chongqing", position: [106.530635013, 29.5446061089] },
    { name: "Suzhou", position: [113.64964385, 34.7566100641] },
    { name: "Wuhan", position: [114.316200103, 30.5810841269] },
    { name: "Nanjing", position: [118.778074408, 32.0572355018] },
    { name: "Tianjin", position: [117.210813092, 39.1439299033] },
    { name: "Zhengzhou", position: [113.64964385, 34.7566100641] },
    { name: "Changsha", position: [112.979352788, 28.2134782309] },
    { name: "Dongguan", position: [113.763433991, 23.0430238154] },
    { name: "Foshan", position: [113.134025635, 23.0350948405] },
    { name: "Ningbo", position: [121.579005973, 29.8852589659] },
    { name: "Qingdao", position: [120.384428184, 36.1052149013] },
    { name: "Shenyang", position: [123.432790922, 41.8086447835] },
    { name: "Shenzhen", position: [114.025973657, 22.5460535462] },
    { name: "Urumqi", position: [87.613307, 43.824787] }
  ]

  //Connection point location
  const arrEnd = [
    { name: "Xi'an", position: [108.953098279, 34.2777998978] },
    { name: "Nanjing", position: [118.778074408, 32.0572355018] },
    { name: "Wuhan", position: [114.316200103, 30.5810841269] }
  ]

  //Create vector data
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arrStart.length; i++) {
    const item = arrStart[i]
    const position = item.position

    //city name
    const graphic = new mars3d.graphic.DivGraphic({
      position,
      style: {
        html: `<div class ="textName">${item.name}</div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  for (let i = 0; i < arrEnd.length; i++) {
    const item = arrEnd[i]
    const endPoint = item.position

    //city name
    const graphic = new mars3d.graphic.DivGraphic({
      position: endPoint,
      style: {
        html: `<div class ="textName">${item.name}</div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    graphicLayer.addGraphic(graphic)

    for (let j = 0; j < arrStart.length; j++) {
      const item = arrStart[j]
      const startPoint = item.position

      // connect
      const line = new mars3d.graphic.PolylinePrimitive({
        positions: [startPoint, endPoint],
        style: {
          width: 2,
          materialType: mars3d.MaterialType.LineFlow,
          materialOptions: {
            color: "#3af2f3",
            image: "img/textures/line-pulse.png",
            speed: 1
          }
        }
      })
      graphicLayer.addGraphic(line)
    }
  }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
