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

  globalNotify("Known Issue Tips", `(1) There will be aliasing at present. (2) There may be aliasing jitter when the viewing angle changes.`)

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
  // addDemoGraphic3()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const pointLight = new mars3d.graphic.PointVisibility({
    position: [119.481049, 28.440174, 145],
    style: {
      color: "#e3e238",
      radius: 100
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic2() {
  const pointLight = new mars3d.graphic.ConeVisibility({
    position: [119.481236, 28.439863, 142],
    targetPosition: [119.482314, 28.441137, 129.5],
    style: {
      color: "#e33838"
      // radius: 100
      // heading: 180
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic3() {
  const pointLight = new mars3d.graphic.PointVisibility({
    position: [119.48157, 28.440346, 150],
    style: {
      radius: 100
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
    type: "coneVisibility",
    style: {
      radius: 200,
      addHeight: 1
    }
  })
}

function startDrawGraphic2() {
  // Start drawing
  graphicLayer.startDraw({
    type: "pointVisibility",
    style: {
      radius: 200,
      addHeight: 1
    }
  })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [119.474745, 28.436478, 119.484204, 28.444144]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 140)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.PointVisibility({
      position,
      style: {
        radius: 100
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)

    // test position
    map.viewer.entities.add({
      position: new Cesium.CallbackProperty(() => {
        return graphic.position
      }, false),
      point: {
        pixelSize: 10
      }
    })
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}
function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
