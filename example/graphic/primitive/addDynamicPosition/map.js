// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 31.754913, lng: 117.248572, alt: 6220, heading: 357, pitch: -31 }
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

  map.basemap = 2017 // blue basemap

  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })
  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  addDemoGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.ModelPrimitive({
      // forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
      style: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        scale: 0.5,
        minimumPixelSize: 20,

        // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
        highlight: {
          type: mars3d.EventType.click,
          silhouette: true,
          silhouetteColor: "#ff0000",
          silhouetteSize: 4
        },

        label: {
          // When text is not needed, just remove the label configuration
          text: "WanA000" + i,
          font_size: 16,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -20,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 50000,
          distanceDisplayCondition_near: 0
        }
      },
      attr: { index: i, name: "ModelPrimitive" }
    })
    graphicLayer.addGraphic(graphic)
  }

  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.BillboardPrimitive({
      style: {
        image: "img/marker/mark-blue.png",
        scale: 0.6,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
      },
      attr: { index: i, name: "BillboardPrimitive" }
    })
    graphicLayer.addGraphic(graphic)
  }

  for (let i = 0; i < 10; i++) {
    const graphic = new mars3d.graphic.PointPrimitive({
      style: {
        color: "#00ffff",
        pixelSize: 6,
        outlineColor: "#ffffff",
        outlineWidth: 2
      },
      attr: { index: i, name: "PointPrimitive" }
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

// Get random points in the area
function randomPoint() {
  const jd = random(117.207666 * 1000, 117.287241 * 1000) / 1000
  const wd = random(31.817099 * 1000, 31.876848 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 30)
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
