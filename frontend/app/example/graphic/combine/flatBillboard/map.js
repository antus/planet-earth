// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 28.18408, lng: 116.160667, alt: 1138597, heading: 1, pitch: -78 },
    globe: {
      baseColor: "#a3b3c2"
    }
  },
  control: {
    infoBox: false
  },
  terrain: false,
  layers: [
    {
      type: "geojson",
      name: "National Provincial Boundaries",
      url: "//data.mars3d.cn/file/geojson/areas/100000_full.json",
      symbol: {
        type: "polylineC",
        styleOptions: {
          width: 2,
          color: "#cccccc",
          opacity: 0.8
        }
      },
      allowDrillPick: true,
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = undefined

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    // let attr = event.graphic.attr
    console.log("The single value in the merged object was clicked", pickedItem)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.

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

//Load demo data
function addDemoGraphic1() {
  graphicLayer.clear()

  map.setCameraView({ lat: 28.18408, lng: 116.160667, alt: 1138597, heading: 1, pitch: -78 })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
    .then(function (result) {
      const arr = result.data
      globalMsg("Total loading" + arr.length + "data")

      const arrData = []
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i]
        arrData.push({
          position: Cesium.Cartesian3.fromDegrees(item.x, item.y, 1000),
          style: {
            angle: 360 - item.dir, // direction
            image: getImageBySpeed(item.speed), // Speed, use different images
            width: 30, // unit: pixels
            height: 60
          },
          attr: item
        })
      }

      const flatBillboard = new mars3d.graphic.FlatBillboard({
        instances: arrData
      })
      graphicLayer.addGraphic(flatBillboard)

      eventTarget.fire("addTableData", { graphicLayer })
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 1000)
  console.log("Generated test grid coordinates", result)

  const arrData = []
  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const angle = random(0, 360) // random direction
    const speed = random(0, 60) // random value

    arrData.push({
      position,
      style: {
        angle,
        image: getImageBySpeed(speed),
        width: 30, // unit: pixels
        height: 60
      },
      attr: { index }
    })
  }

  const flatBillboard = new mars3d.graphic.FlatBillboard({
    instances: arrData // can also be passed in through attributes later
  })
  graphicLayer.addGraphic(flatBillboard)

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}

function getImageBySpeed(speed) {
  let windVaneUrl = "img/windVane/01.svg"
  if (speed >= 0 && speed <= 2) {
    windVaneUrl = "img/windVane/01.svg"
  } else if (speed > 2 && speed <= 4) {
    windVaneUrl = "img/windVane/02.svg"
  } else if (speed > 4 && speed <= 6) {
    windVaneUrl = "img/windVane/03.svg"
  } else if (speed > 6 && speed <= 8) {
    windVaneUrl = "img/windVane/04.svg"
  } else if (speed > 8 && speed <= 10) {
    windVaneUrl = "img/windVane/05.svg"
  } else if (speed > 10 && speed <= 12) {
    windVaneUrl = "img/windVane/06.svg"
  } else if (speed > 12 && speed <= 14) {
    windVaneUrl = "img/windVane/07.svg"
  } else if (speed > 14 && speed <= 16) {
    windVaneUrl = "img/windVane/08.svg"
  } else if (speed > 16 && speed <= 18) {
    windVaneUrl = "img/windVane/09.svg"
  } else if (speed > 18 && speed <= 20) {
    windVaneUrl = "img/windVane/10.svg"
  } else if (speed > 20 && speed <= 22) {
    windVaneUrl = "img/windVane/11.svg"
  } else if (speed > 22 && speed <= 24) {
    windVaneUrl = "img/windVane/12.svg"
  } else if (speed > 24 && speed <= 26) {
    windVaneUrl = "img/windVane/13.svg"
  } else if (speed > 26 && speed <= 28) {
    windVaneUrl = "img/windVane/14.svg"
  } else if (speed > 28 && speed <= 30) {
    windVaneUrl = "img/windVane/15.svg"
  } else if (speed > 30 && speed <= 32) {
    windVaneUrl = "img/windVane/16.svg"
  } else if (speed > 32 && speed <= 34) {
    windVaneUrl = "img/windVane/17.svg"
  } else if (speed > 34 && speed <= 36) {
    windVaneUrl = "img/windVane/18.svg"
  } else if (speed > 36 && speed <= 38) {
    windVaneUrl = "img/windVane/19.svg"
  } else if (speed > 38 && speed <= 40) {
    windVaneUrl = "img/windVane/20.svg"
  } else if (speed > 40 && speed <= 42) {
    windVaneUrl = "img/windVane/21.svg"
  } else if (speed > 42 && speed <= 44) {
    windVaneUrl = "img/windVane/22.svg"
  } else if (speed > 44 && speed <= 46) {
    windVaneUrl = "img/windVane/23.svg"
  } else if (speed > 46 && speed <= 48) {
    windVaneUrl = "img/windVane/24.svg"
  } else if (speed > 48 && speed <= 50) {
    windVaneUrl = "img/windVane/25.svg"
  } else if (speed > 50 && speed <= 52) {
    windVaneUrl = "img/windVane/26.svg"
  } else if (speed > 52 && speed <= 54) {
    windVaneUrl = "img/windVane/27.svg"
  } else if (speed > 54 && speed <= 56) {
    windVaneUrl = "img/windVane/28.svg"
  } else if (speed > 56) {
    windVaneUrl = "img/windVane/29.svg"
  }
  return windVaneUrl
}
