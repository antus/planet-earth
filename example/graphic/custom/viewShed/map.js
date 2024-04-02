// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 28.440007, lng: 119.48322, alt: 424, heading: 282, pitch: -56 },
    fxaa: true, // If anti-aliasing is not turned on, the visual area will flicker
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

  globalNotify("Known Issue Tips", `(1) There may be aliasing in the visual field on the plane. (2) There may be aliasing jitter when the viewing angle changes.`)

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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const viewShed = new mars3d.graphic.ViewShed({
    position: [119.480878, 28.440286, 149],
    style: {
      angle: 60,
      angle2: 45,
      distance: 80,
      heading: 44,
      pitch: -12,
      addHeight: 0.5
    }
  })
  graphicLayer.addGraphic(viewShed)
}

//Add visible area
function startDrawGraphic() {
  // Start drawing
  graphicLayer.startDraw({
    type: "viewShed",
    style: {
      angle: 60,
      angle2: 45,
      distance: 80,
      heading: 44,
      pitch: -12,
      addHeight: 0.5 // The height value added at the coordinate point to avoid occlusion and the effect is more friendly
    }
  })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ViewShed({
      position,
      style: {
        angle: 60,
        angle2: 45,
        distance: 1880,
        heading: 44,
        pitch: -12,
        addHeight: 0.5
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

//Property editing
let selectedView
function getGraphic(graphicId) {
  selectedView = graphicLayer.getGraphicById(graphicId)
  return selectedView
}

function selCamera() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // Delete the drawn point

      selectedView.position = point
    }
  })
}

//Modify horizontal angle
function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

//Modify vertical angle
function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

// Modify the projection distance
function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

//Modify the surrounding distance value to the modified value
function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}

// Modify the pitch angle value value modified value
function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

// Whether the wireframe displays the modified value of isCheckde
function showFrustum(isCheckde) {
  if (selectedView) {
    selectedView.showFrustum = isCheckde
  }
}

// Modify the transparency of the video opacity transparency value
function onChangeOpacity(opacity) {
  if (selectedView) {
    selectedView.opacity = opacity
  }
}

//Select points from surrounding perspectives
function onClickSelView() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // Delete the drawn point

      selectedView.targetPosition = point
    }
  })
}
