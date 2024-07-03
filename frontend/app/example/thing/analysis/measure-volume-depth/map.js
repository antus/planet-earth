// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let measure
var measureVolume

var mapOptions = {
  scene: {
    center: { lat: 30.883785, lng: 116.230883, alt: 8121, heading: 266, pitch: -62 },
    globe: { depthTestAgainstTerrain: true }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Square quantity analysis based on depth map. Note:
  // 1. Analysis can only be done after the data corresponding to the area to be analyzed, such as terrain and models, is loaded.
  // 2. If there are any vector objects blocking the analysis area, they need to be hidden before analysis and then changed back to display after analysis.

  addMeasure()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addMeasure() {
  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  })
  map.addThing(measure)

  // Directly pass in coordinate analysis
  setTimeout(() => {
    measure
      .volume({
        positions: mars3d.PointTrans.lonlats2cartesians([
          [116.191817, 30.864845, 309.3],
          [116.192869, 30.8757, 521.81],
          [116.190478, 30.886266, 672.79],
          [116.19247, 30.893748, 448.91],
          [116.200836, 30.889954, 379.92],
          [116.204063, 30.882578, 532.5],
          [116.203027, 30.873828, 498.8],
          [116.201795, 30.865941, 443.06]
        ]),
        height: 450,
        depth: true, // Use off-screen rendering of depth map
        offsetHeight: 500 //Offset height to display
      })
      .then((e) => {
        measureVolume = e
        showHeightVal()
      })
  }, 3000)

  //When there is a model
  // tiles3dLayer.readyPromise.then((layer) => {
  // // Key code, execute volume after the model readyPromise is loaded.
  //   measureVolume = measure.volume({
  //     positions: mars3d.PointTrans.lonlats2cartesians([
  //       [119.033856, 33.591473, 14.5],
  //       [119.033098, 33.591836, 13.2],
  //       [119.033936, 33.592146, 16.9]
  //     ]),
  // depth: true, // Use off-screen rendering of depth map
  //     height: 150
  //   })
  // })

  measure.on(mars3d.EventType.start, function (event) {
    console.log("Start analysis", event)
    showLoading()
    console.log("The coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(event.positions))) // Convenient for testing copy coordinates
  })

  measure.on(mars3d.EventType.end, function (event) {
    console.log("Analysis completed", event)
    hideLoading()
  })
}

//Click height
function showHeightVal() {
  const baseHeight = measureVolume.height.toFixed(1)
  const minHeight = measureVolume.minHeight.toFixed(1)
  const maxHeight = getFixedNum(measureVolume.maxHeight)

  // Trigger the custom event heightVal and change the value in the component panel
  eventTarget.fire("heightVal", { baseHeight, minHeight, maxHeight })
}

function getFixedNum(val) {
  return Math.ceil(val * 10) / 10
}

// Square quantity analysis
function analysisMeasure() {
  // Analysis of manual drawing methods
  measure
    .volume({
      depth: true // Use off-screen rendering of depth map
      // minHeight: 50, //You can set a fixed minimum height
    })
    .then((e) => {
      measureVolume = e
      showHeightVal()
    })
}

// clear
function clear() {
  measure.clear()
  measureVolume = null
}

//Modify base height
function baseHeight(num) {
  measureVolume.height = num
  showHeightVal()
}

//Modify bottom height
function txtMinHeight(num) {
  if (num > measureVolume.height) {
    globalMsg("The bottom height of the wall cannot be higher than the height of the base plane")
    return
  }
  measureVolume.minHeight = num
}

//Modify top height
function txtMaxHeight(num) {
  const maxHeight = getFixedNum(measureVolume.polygonMaxHeight)
  if (num < maxHeight) {
    globalMsg("The height of the top of the wall cannot be lower than the surface height in the area" + maxHeight)
    measureVolume.maxHeight = Number(maxHeight)
    return
  }
  if (num < measureVolume.height) {
    globalMsg("The height of the top of the wall cannot be lower than the height of the base plane")
    return
  }
  measureVolume.maxHeight = num
}

function selHeight() {
  if (!measureVolume || !measure) {
    globalMsg("Please start the square analysis first")
    return
  }

  // Pick up height
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#00fff2"
    },
    success: (graphic) => {
      const height = graphic.point?.alt
      map.graphicLayer.removeGraphic(graphic)

      if (!height) {
        return
      }

      measureVolume.height = height

      showHeightVal(height)
    }
  })
}
