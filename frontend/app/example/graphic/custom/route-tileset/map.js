// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.588405, lng: 119.031988, alt: 336, heading: 359, pitch: -37 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  },
  layers: [
    {
      name: "Confucian Temple",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 120 },
      maximumScreenSpaceError: 2,
      show: true
    }
  ]
}

function onMounted(mapInstance) {
  map = mapInstance // record map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  graphicLayer.on(mars3d.EventType.dblClick, function (event) {
    const graphic = event.graphic
    if (graphic) {
      map.flyToPoint(graphic.position, {
        radius: Cesium.Cartesian3.distance(graphic.position, map.camera.positionWC),
        complete: (e) => {
          graphic.setCameraOptions({
            type: "gs",
            radius: Cesium.Cartesian3.distance(graphic.position, map.camera.positionWC)
          })
        }
      })
    }
  })

  map.on(mars3d.EventType.click, function (event) {
    if (!event.graphic) {
      mars3d.graphic.Route.clearLastCamera()
    }
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.Route({
      model: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        scale: 0.1,
        roll: 0,
        pitch: 0
        // clampToGround: true // Supports pasting model + terrain
      },
      //Processing parameters of real-time pasting model
      clampToTileset: true // Paste the model, but the efficiency is not high. If there are too many cars, it will get stuck.
      // frameRate: 3, // Control the efficiency of pasting the model, how many frames are calculated once
    })
    graphicLayer.addGraphic(graphic)
  }

  //Set dynamic position
  changePosition(0)

  // Update dynamic position regularly (setInterval is a demonstration)
  const interval = 30
  changePosition(interval)
  setInterval(() => {
    changePosition(interval)
  }, interval * 1000)
}

// change position
function changePosition(time) {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.isPrivate) {
      return
    }
    graphic.addDynamicPosition(randomPoint(), time) // Move to the specified position in time seconds
  })
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

// Get random points in the area
function randomPoint() {
  const jd = random(119.028631 * 1000, 119.034843 * 1000) / 1000
  const wd = random(33.589624 * 1000, 33.594783 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 0)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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
