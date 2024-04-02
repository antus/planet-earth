// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 3.74685, lng: 103.588387, alt: 14532035, heading: 0, pitch: -86 }
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

  map.basemap = 2017

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/population.json" })
    .then(function (data) {
      showData(data)
    })
    .catch(function (data) {
      console.log("ajax request error", data)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showData(data) {
  const heightScale = 2000000

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  // Bind the Popup window to the layer
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })

  for (let x = 0; x < 1; x++) {
    const series = data[x]
    const coordinates = series[1]

    // Now loop over each coordinate in the series and create
    for (let i = 0; i < coordinates.length; i += 3) {
      const latitude = coordinates[i]
      const longitude = coordinates[i + 1]
      const height = coordinates[i + 2]

      // Ignore lines of zero height.
      if (height === 0) {
        continue
      }

      const color = Cesium.Color.fromHsl(0.6 - height * 0.5, 1.0, 0.5)
      const surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0)
      const heightPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height * heightScale)

      const graphic = new mars3d.graphic.PolylineEntity({
        positions: [surfacePosition, heightPosition],
        style: {
          width: 4,
          color
        },
        attr: { gdp: height }
      })
      graphicLayer.addGraphic(graphic)
    }
  }
}
