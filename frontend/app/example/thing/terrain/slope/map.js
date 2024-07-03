// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let slope
let contourLine
let graphicLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addSlope()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addSlope() {
  // slope aspect
  slope = new mars3d.thing.Slope({
    arrow: {
      scale: 0.3, // Ratio of arrow length (range 0.1-0.9)
      color: Cesium.Color.YELLOW,
      width: 15, // Arrow width
      // materialType: mars3d.MaterialType.LineFlow,
      // materialOptions: {
      //   color: "#1a9850",
      //   image: "img/textures/line-arrow-right.png",
      //   speed: 10
      // },
      // clampToGround: true,
      show: true
    },
    tooltip: function (event) {
      const attr = event.graphic?.attr
      return `Slope: ${attr.slopeStr1} (${attr.slopeStr2})<br />Slope direction: ${attr.direction}°`
    }
  })
  map.addThing(slope)

  slope.on(mars3d.EventType.end, function (event) {
    console.log("Analysis completed", event)

    // event.data[0] Return value description in the array: {
    // position:position, // coordinate position
    // slope: slopeValDou, //degree method value, α (slope) = arc tan (elevation difference/horizontal distance)
    // slopeStr1: text1, //degree value string
    // slopeStr2: text2, //Percentage value string, slope = (elevation difference/horizontal distance)x100%
    // direction: slopeAngle //Slope value (0-360 degrees)
    // }
  })

  //Rendering effect
  contourLine = new mars3d.thing.ContourLine({
    contourShow: false, // Whether to display contour lines
    shadingType: "none", // Surface rendering effect type: none, elevation, slope, aspect
    shadingAlpha: 0.6 /// Transparency of surface rendering
  })
  map.addThing(contourLine)
}

// async function getSlope(positions) {
//   const result = await mars3d.thing.Slope.getSlope({
//     map,
//     positions,
// splitNum: 1, // The number of splitNum interpolation divisions
// radius: 1, // Buffer radius (affects the accuracy of slope aspect)
// count: 4 // The number of buffers (affecting the accuracy of slope and aspect) will calculate the surrounding (count*4) points
//   })
// console.log("Analysis completed", result)
// }

// add rectangle
function btnDrawExtent(splitNum) {
  clearAll()
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      contourLine.positions = positions
      slope.add(positions, {
        splitNum, //The number of splitNum interpolation divisions
        radius: 1, // Buffer radius (affects the accuracy of slope aspect)
        count: 4 //The number of buffers (affecting the accuracy of slope and aspect) will find surrounding (count*4) points
      })
    }
  })
}

// draw polygon
function btnDraw(splitNum) {
  clearAll()
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#29cf34",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      contourLine.positions = positions
      slope.add(positions, {
        splitNum, //The number of splitNum interpolation divisions
        radius: 1, // Buffer radius (affects the accuracy of slope aspect)
        count: 4 //The number of buffers (affecting the accuracy of slope and aspect) will find surrounding (count*4) points
      })
    }
  })
}

// add points
function btnDrawPoint() {
  clearAll()

  graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#ffff00"
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      graphicLayer.clear()

      slope.add(positions)
    }
  })
}
// change shadow
function changeShadingType(val) {
  contourLine.shadingType = val
}

function clearAll() {
  slope.clear()
  contourLine.clear()
}
