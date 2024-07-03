// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 32.576038, lng: 118.586631, alt: 2296055.4, heading: 357.1, pitch: -88.5 }
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

  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer({
    clustering: {
      enabled: true, // Point aggregation configuration
      pixelRange: 20
    }
  })
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })
  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/ais.json" }).then(function (json) {
    const arr = []
    for (let i = 0; i < json.points.length; i++) {
      const item = json.points[i]
      if (item.lon < 90 || item.lon > 160 || item.lat < 0 || item.lat > 50) {
        continue
      }
      arr.push(item)
    }
    console.log("Loading AIS data", arr)

    addDemoGraphics(arr)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphics(points) {
  for (let i = 0; i < points.length; i++) {
    const item = points[i]
    const graphic = new mars3d.graphic.Route({
      point: {
        color: "#ff0000",
        pixelSize: 5,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: Number.MAX_VALUE,
        distanceDisplayCondition_near: 100000
      },
      model: {
        url: "//data.mars3d.cn/gltf/mars/ship/ship09.glb",
        minimumPixelSize: 40,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)

    const point = new mars3d.LngLatPoint(item.lon, item.lat)
    graphic.addDynamicPosition(point, 0)
  }

  // Update dynamic position regularly (setInterval is a demonstration)
  const interval = 3
  changePosition(interval)
  setInterval(() => {
    changePosition(interval)
  }, interval * 1000)
}

let offset = 0
// change position
function changePosition(time) {
  offset += 0.02
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.isPrivate) {
      return
    }

    const item = graphic.attr
    const point = new mars3d.LngLatPoint(item.lon + offset, item.lat + offset)
    graphic.addDynamicPosition(point, time)
  })
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

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // When the right click is the editing point
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}

function clearGraphic() {
  graphicLayer.clear(true)
}
