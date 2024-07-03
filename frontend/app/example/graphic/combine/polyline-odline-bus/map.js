// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 39.564004, lng: 116.394499, alt: 55751, heading: 0, pitch: -56 }
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

  map.basemap = "Black basemap"

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/bjgj.json" }).then(function (data) {
    const busLines = []
    data.forEach(function (busLine, idx) {
      let prevPt
      const points = []
      for (let i = 0; i < busLine.length; i += 2) {
        let pt = [busLine[i], busLine[i + 1]]
        if (i > 0) {
          pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]]
        }
        prevPt = pt

        const longitude = pt[0] / 1e4
        const latitude = pt[1] / 1e4
        const cart = Cesium.Cartesian3.fromDegrees(longitude, latitude, 100.0)
        points.push(cart)
      }

      busLines.push({
        positions: points,
        color: new Cesium.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 0.0, 1.0),
        speed: 2 + 1.0 * Math.random()
      })
    })
    createLines(busLines)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createLines(arr) {
  const arrData = []
  arr.forEach(function (item, index) {
    arrData.push({
      positions: item.positions,
      style: {
        width: 2.0,
        materialType: mars3d.MaterialType.ODLine,
        materialOptions: {
          color: item.color,
          speed: item.speed,
          startTime: Math.random()
        }
      },
      attr: { index }
    })
  })

  // Combined rendering of multiple line objects.
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}
