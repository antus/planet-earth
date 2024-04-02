// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 28.438455, lng: 119.479268, alt: 435.3, heading: 30.3, pitch: -53.6 },
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

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    luminanceAtZenith: 0.6
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const pointLight = new mars3d.graphic.PointLight({
    position: [119.48089, 28.440474, 150],
    style: {
      color: "#e3e238",
      intensity: 200,
      radius: 1000
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic2() {
  const pointLight = new mars3d.graphic.PointLight({
    position: [119.479116, 28.440628, 160],
    style: {
      color: "#e33838",
      intensity: 400,
      radius: 2000
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic3() {
  const pointLight = new mars3d.graphic.PointLight({
    position: [119.48157, 28.440346, 150],
    style: {
      intensity: 100
    }
  })
  graphicLayer.addGraphic(pointLight)

  map.viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {
      return pointLight.position
    }, false),
    point: {
      pixelSize: 10
    }
  })

  map.on(mars3d.EventType.mouseMove, function (event) {
    if (event.cartesian && pointLight.isAdded) {
      pointLight.position = mars3d.PointUtil.addPositionsHeight(event.cartesian, 10)
    }
  })
}

// Add to
function startDrawGraphic() {
  // Start drawing
  graphicLayer.startDraw({
    type: "pointLight",
    style: {
      intensity: 600
    }
  })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [119.474745, 28.436478, 119.484204, 28.444144]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 200)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.PointLight({
      position,
      style: {
        intensity: 3000,
        radius: 500
      },
      attr: { index },
      testPoint: true
    })
    graphicLayer.addGraphic(graphic)

    // test position
    // map.viewer.entities.add({
    //   position: graphic.position,
    //   point: {
    //     pixelSize: 10
    //   }
    // })
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
