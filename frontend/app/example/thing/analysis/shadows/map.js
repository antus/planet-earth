// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let shadows

var mapOptions = {
  scene: {
    center: { lat: 33.596051, lng: 119.031383, alt: 359, heading: 180, pitch: -43 },
    fxaa: true,
    globe: {
      baseColor: "#000"
    }
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

  globalNotify("Known Issue Tips", `The sun shadow on the model may have jagged edges.`)

  // let imageryLayer = map.scene.imageryLayers.get(0)
  // imageryLayer.dayAlpha = 0.1 // Daytime layer transparency value
  // imageryLayer.nightAlpha = 1.0 //Night layer transparency value

  //Add a model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    shadows: Cesium.ShadowMode.ENABLED
  })
  map.addLayer(tilesetLayer)

  shadows = new mars3d.thing.Shadows({
    darkness: 0.4, // Shadow transparency, 0-1, the larger the value, the more transparent it is
    multiplier: 1600
    // terrain: false,
    // lighting: false
  })
  map.addThing(shadows)


  shadows.on(mars3d.EventType.change, function () {
    const shadowTime = shadows.time
    eventTarget.fire("changeShadows", { shadowTime })
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function stopPlay() {
  if (shadows && shadows.isStart) {
    shadows.pause()
  }
}

/**
 * Start playing
 *
 * @export
 * @param {*} date year month day
 * @param {number} hours hours
 * @param {number} minutes minutes
 */
function startPlay(date, hours, minutes) {
  const currentTime = setShadows(date, hours, minutes)
  const startDate = new Date(date + " 00:00:00")
  const endDate = new Date(date + " 23:59:59")

  shadows.multiplier = 1600
  shadows.start(startDate, endDate, currentTime)
}

/**
 * Modify shadows current time
 *
 * @export
 * @param {*} date year month day
 * @param {number} hours hours
 * @param {number} minutes minutes
 */
function setShadows(date, hours, minutes) {
  const dateTime = new Date(`${date} ${hours}:${minutes}:00`)
  shadows.time = dateTime

  return dateTime
}

function clearArea() {
  map.graphicLayer.clear()
  shadows.clear()
}

function drawArea(date) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      // Find the maximum and minimum height values
      shadows.multiplier = 14400
      shadows
        .startRate({
          startDate: new Date(date + " 08:00:00"),
          endDate: new Date(date + " 18:00:00"),

          positions,
          step: 3,
          minHeight: 20
          // maxHeight: 30 //Can be multi-layered
        })
        .then((result) => {
          showRateResult(result)
        })
    }
  })
}

const colorRamp = new mars3d.ColorRamp({
  steps: [5, 15, 25, 35, 50, 80],
  colors: ["rgb(0, 228, 0)", "rgb(256, 256, 0)", "rgb(256, 126, 0)", "rgb(256, 0, 0)", "rgb(153, 0, 76)", "rgb(126, 0, 35)"]
})

function showRateResult(result) {
  console.log("Analysis results", result)

  map.graphicLayer.clear()

  result.positions.forEach((p, i) => {
    const rate = p.rate * 100 // Shadow rate, the value range is 0 to 1, 0 means there is always light, 1 means there is always no light
    const graphic = new mars3d.graphic.PointEntity({
      position: p,
      style: {
        pixelSize: 10,
        color: colorRamp.getColor(rate) // Calculate color, ribbon color
      },
      popup: `Shadow rate: ${rate.toFixed(2)}%`
    })
    map.graphicLayer.addGraphic(graphic)
  })
}

// // Get the ribbon
// function getImageData() {
//   const nWidth = 100
//   const canvas = document.createElement("canvas")
//   canvas.width = nWidth
//   canvas.height = nWidth
//   const ctx = canvas.getContext("2d")
//   ctx.beginPath()
// /* Specify the gradient area */
//   const grad = ctx.createLinearGradient(0, 0, nWidth, 0)
// /* Specify several colors */
//   grad.addColorStop(0.05, "rgb(0, 228, 0)") // green
//   grad.addColorStop(0.15, "rgb(256, 256, 0)") // yellow
//   grad.addColorStop(0.25, "rgb(256, 126, 0)") // orange
//   grad.addColorStop(0.35, "rgb(256, 0, 0)") // red
//   grad.addColorStop(0.5, "rgb(153, 0, 76)") // purple
//   grad.addColorStop(0.8, "rgb(126, 0, 35)") // maroon

// /* Set this gradient to fillStyle */
//   ctx.fillStyle = grad
// /* Draw a rectangle */
//   ctx.rect(0, 0, nWidth, nWidth)
//   ctx.fill()
//   return ctx.getImageData(0, 0, nWidth, 1).data
// }

// const imgData = getImageData()

// // Calculate color, ribbon color
// function getColor(rate) {
//   if (rate > 100) {
//     return "rgba(126,0,35,0.8)"
//   } else {
//     rate = Math.round(rate)
//     return `rgba(${imgData[rate * 4]},${imgData[rate * 4 + 1]},${imgData[rate * 4 + 2]},0.8)`
//   }
// }
