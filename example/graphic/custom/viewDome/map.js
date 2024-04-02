// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 28.437359, lng: 119.478919, alt: 350.5, heading: 26.3, pitch: -21.6 },
    globe: {
      depthTestAgainstTerrain: true // Cannot be projected onto the terrain without adding
    }
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

  map.scene.globe.shadows = Cesium.ShadowMode.CAST_ONLY // When analyzing on terrain, you need to add this line of code

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    maximumScreenSpaceError: 1,
    position: { alt: 148.2 }
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const pointLight = new mars3d.graphic.ViewDome({
    position: [119.480936, 28.44019, 131],
    style: {
      radius: 90,
      visibleColor: "rgba(0,183,239, 0.5)",
      hiddenColor: "rgba(227,108,9, 0.5)"
    }
  })
  graphicLayer.addGraphic(pointLight)
}

// Add to
function startDrawGraphic() {
  // Start drawing
  graphicLayer.startDraw({
    type: "viewDome",
    style: {
      radius: 50
    }
  })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [119.474985, 28.436963, 119.483563, 28.442804]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 140)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ViewDome({
      position,
      style: {
        radius: 30
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}
function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
