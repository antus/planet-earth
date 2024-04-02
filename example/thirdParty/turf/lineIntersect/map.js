// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let lineLayer
let pointLayer

var mapOptions = {
  scene: {
    center: { lat: 31.855058, lng: 117.312337, alt: 79936, heading: 0, pitch: -90 }
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

  //Add line vector data layer
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  lineLayer.bindContextMenu([
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
          pointLayer.clear()
        }
      }
    }
  ])

  //Add intersection point vector data layer
  pointLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(pointLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawLine() {
  // Start drawing
  lineLayer.startDraw({
    type: "polyline",
    style: {
      color: getColor(),
      width: 3,
      clampToGround: true
    }
  })
}

function crossPoint() {
  lineLayer.stopDraw()
  pointLayer.clear()

  if (lineLayer.length <= 1) {
    globalMsg("Please draw at least two lines")
    return
  }

  const geojson = lineLayer.toGeoJSON()
  const allCount = geojson.features.length

  for (let i = 0; i < allCount; i++) {
    const line1 = geojson.features[i]

    for (let j = i + 1; j < allCount; j++) {
      const line2 = geojson.features[j]

      // Calculate intersection point
      const intersects = turf.lineIntersect(line1, line2)

      if (intersects.features.length > 0) {
        const intersectsPointGrahic = mars3d.Util.geoJsonToGraphics(intersects.features, {
          style: {
            color: "#0000ff",
            pixelSize: 8,
            outlineColor: "#ffffff",
            outlineWidth: 2,
            clampToGround: true
          }
        })
        pointLayer.addGraphic(intersectsPointGrahic)
      }
    }
  }
}

function clearAll() {
  pointLayer.clear()
  lineLayer.clear()
}

// color
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#00FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}
