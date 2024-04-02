// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.548343, lng: 104.372096, alt: 8226.5, heading: 342.8, pitch: -43.1 }
  }
}

let colorRamp

function onMounted(mapInstance) {
  map = mapInstance // record map

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer) // Bind listening events on the layer

  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    console.log("The single value in the merged object was clicked", pickedItem)
  })

  colorRamp = new mars3d.ColorRamp({
    steps: [0, 30],
    colors: ["rgb(33, 113, 181)", "rgb(8, 48, 107)"]
  })

  let progressValue = 0 // current progress
  const intervalId = setInterval(() => {
    progressValue++
    if (progressValue < 216) {
      loadAndRenderGeoJSON(progressValue)
    } else {
      clearInterval(intervalId)
    }
  }, 200)
}

function onUnmounted() {
  map = null
}

const floods = []

//Load flood data
async function loadAndRenderGeoJSON(fileIndex) {
  const url = `//data.mars3d.cn/file/apidemo/floods/${fileIndex}.json`
  const features = await mars3d.Util.sendAjax({ url })
  const instances = []
  features.forEach((feature) => {
    const coordinates = feature.c
    instances.push({
      positions: coordinates[0],
      style: {
        color: colorRamp.getColor(feature.d)
      },
      attr: { depth: feature.d }
    })
  })

  const graphic = new mars3d.graphic.PolygonCombine({
    instances: instances, // style when highlighted
    popup: `depth:{depth} meters`
  })
  graphicLayer.addGraphic(graphic)

  await graphic.readyPromise

  // Avoid flickering + occupying memory. Take all factors into consideration and retain the transitional graphics.
  if (floods.length > 3) {
    const a = floods.shift()
    a.remove()
  }
  floods.push(graphic)
}
