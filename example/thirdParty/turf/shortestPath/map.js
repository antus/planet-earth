// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object
let shortestPathLayer

let polygonZAM
let pointQD
let pointZD

var mapOptions = {
  scene: {
    center: { lat: 31.871794, lng: 116.800468, alt: 57020, heading: 0, pitch: -90 }
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

  shortestPathLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(shortestPathLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Draw the obstacle surface
function drawPolygon() {
  if (polygonZAM) {
    polygonZAM.remove()
    polygonZAM = null
  }
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ffff",
      opacity: 0.4,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff"
    },
    success: (graphic) => {
      polygonZAM = graphic
    }
  })
}
// draw starting point
function startPoint() {
  if (pointQD) {
    pointQD.remove()
    pointQD = null
  }
  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red",
      label: {
        text: "starting point",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    },
    success: (graphic) => {
      pointQD = graphic
    }
  })
}

// draw end point
function endPoint() {
  if (pointZD) {
    pointZD.remove()
    pointZD = null
  }
  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red",
      label: {
        text: "end",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    },
    success: (graphic) => {
      pointZD = graphic
    }
  })
}

// Calculate the shortest path
function shortestPath() {
  if (!polygonZAM) {
    globalMsg("Please draw the obstacle surface")
    return
  }
  if (!pointQD) {
    globalMsg("Please draw the starting point")
    return
  }
  if (!pointZD) {
    globalMsg("Please draw the end point")
    return
  }

  shortestPathLayer.clear()

  const polygon = polygonZAM.toGeoJSON() // Obstacle surface
  const startPoint = pointQD.toGeoJSON() // starting point
  const endPoint = pointZD.toGeoJSON() // end point

  const options = {
    obstacles: polygon
  }
  const path = turf.shortestPath(startPoint, endPoint, options)

  const positions = path.geometry.coordinates
  const polyonLine = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      color: " #55ff33"
    }
  })
  shortestPathLayer.addGraphic(polyonLine)
}

function clearLayer() {
  polygonZAM = null
  pointQD = null
  pointZD = null

  graphicLayer.clear()
  shortestPathLayer.clear()
}
