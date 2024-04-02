// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 30.990185, lng: 116.341991, alt: 2465.9, heading: 224.8, pitch: -23.5 }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
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

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.PointEntity({
    position: new mars3d.LngLatPoint(116.329102, 30.977955, 1548.6),
    style: {
      color: "#0000ff",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)

  const pointEdit = new mars3d.thing.MatrixMove2({
    position: graphic.position
  })
  map.addThing(pointEdit)

  pointEdit.on(mars3d.EventType.change, (event) => {
    graphic.position = event.position
  })
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PointEntity({
    position: new mars3d.LngLatPoint(116.317108, 30.974377, 1528.3),
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)

  const pointEdit = new mars3d.thing.MatrixMove({
    position: graphic.position
  })
  map.addThing(pointEdit)

  pointEdit.on(mars3d.EventType.change, (event) => {
    graphic.position = event.position
  })
}
