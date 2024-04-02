// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 24.688611, lng: 119.260277, alt: 1673759, heading: 348, pitch: -69 }
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

  // addGraphicLayer()
  addBusinessLayer()
}

// async function addGraphicLayer() {
//   graphicLayer = new mars3d.layer.GraphicLayer({
//     clustering: {
//       enabled: true,
//       pixelRange: 20,
//       clampToGround: false,
//       addHeight: 1000
//     },
//     popup: "all",
//     center: { lat: 31.639275, lng: 117.388877, alt: 52574.8, heading: 339.3, pitch: -65 },
//     flyTo: true
//   })
//   map.addLayer(graphicLayer)

// // Click event
//   graphicLayer.on(mars3d.EventType.click, function (event) {
// console.log("You clicked", event)
//   })

//   const res = await mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/hfty-point.json" })
//   for (let i = 0; i < res.features.length; i++) {
//     const item = res.features[i]
//     const label = new mars3d.graphic.LabelPrimitive({
//       position: item.geometry.coordinates,
//       style: {
//         show: true,
// text: "Test",
//         font_size: 14,
//         fill: true,
//         color: "#fcfa36",
// font_family: "楷体",
//         font_weight: "bold",
//         outline: true,
//         outlineColor: "rgba(0,0,0,0.8)",
//         outlineWidth: 3,
//         background: true,
//         backgroundColor: "#009476",
//         visibleDepth: false
//       }
//     })
//     graphicLayer.addGraphic(label)
//   }
// }

function addBusinessLayer() {
  const singleDigitPins = {}

  //Create vector data layer (business data layer)
  graphicLayer = new mars3d.layer.BusineDataLayer({
    url: "//data.mars3d.cn/file/apidemo/mudi.json",
    dataColumn: "data", //The name of the value field where the corresponding list is located in the data interface
    lngColumn: "lng",
    latColumn: "lat",
    altColumn: "z",
    //Point aggregation configuration
    clustering: {
      enabled: true,
      pixelRange: 20,
      clampToGround: false,
      addHeight: 1000,
      opacity: 1,
      // getImage is a completely customized method
      getImage: async function (count, result) {
        const key = "type1-" + count // Unique identifier, different layers need to be set differently

        let image = singleDigitPins[key]
        if (image) {
          return image //The current page variable has a record
        }

        image = await localforage.getItem(key)
        if (image) {
          singleDigitPins[key] = image
          return image // Browser client cache has records
        }

        image = await getClusterImage(count) // Generate image
        singleDigitPins[key] = image //Record to the current page variable, which can be used directly when the page is not refreshed.
        localforage.setItem(key, image) // Record to the browser client cache and can continue to be reused after refreshing the page.

        return image
      }
    },
    symbol: {
      type: "billboardP",
      styleOptions: {
        image: "img/marker/mark-blue.png",
        width: 25,
        height: 34, // billboard aggregation must have width and height
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(1000, 0.7, 5000000, 0.3),
        label: {
          text: "{text}",
          font_size: 19,
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(10, 0), // offset
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 80000)
        }
      }
    }
    // Custom created object, which can replace symbol,
    // onCreateGraphic: function (e) {
    //   const graphic = new mars3d.graphic.BillboardEntity({
    //     position: e.position,
    //     style: {
    //       image: "img/marker/lace-blue.png",
    //       width: 25,
    // height: 34, // Aggregation must have width and height
    //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //     },
    //     attr: e.attr
    //   })
    //   graphicLayer.addGraphic(graphic)
    // },
  })
  map.addLayer(graphicLayer)

  graphicLayer.on("clustering", function (event) {
    console.log("New aggregate object", event)
  })

  // click event
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("You clicked", event)

    if (map.camera.positionCartographic.height > 90000) {
      const graphic = event.graphic
      // graphic.closePopup()
      if (graphic?.cluster) {
        // Clicked on the aggregated point
        console.log("The aggregated point was clicked", graphic.getGraphics())
      } else {
        // Clicked on a specific point object
        const position = graphic.positionShow
        map.flyToPoint(position, {
          radius: 5000, // distance from the target point
          duration: 4,
          complete: function (e) {
            //Flight completion callback method
            // graphic.openPopup()
          }
        })
      }
    }
  })

  graphicLayer.bindPopup(function (event) {
    if (event.graphic.cluster && event.graphic.getGraphics) {
      const graphics = event.graphic.getGraphics() // The corresponding grpahic array can be customized for display
      if (graphics) {
        const inthtml = `The convergence point (${graphics.length}) was clicked`
        return inthtml
      }
    }

    const item = event.graphic?.attr
    if (!item) {
      return false
    }
    const inthtml = `<table style="width: auto;">
                  <tr>
                    <th scope="col" colspan="2" style="text-align:center;font-size:15px;">${item.text} </th>
                  </tr>
                  <tr>
                    <td>Province:</td><td>${item.province}</td>
                  </tr>
                  <tr>
                    <td>City:</td> <td>${item.city}</td>
                  </tr>
                  <tr>
                    <td>County/district:</td> <td>${item.district}</td>
                  </tr>
                  <tr>
                    <td>Address:</td> <td>${item.address}</td>
                  </tr>
                  <tr>
                    <td>Video:</td> <td><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video> </td>
                  </tr>
                </table>`
    return inthtml
  })
}

// Generate aggregation icons, support asynchronous
async function getClusterImage(count) {
  let colorIn
  if (count < 10) {
    colorIn = "rgba(110, 204, 57, 0.6)"
  } else if (count < 100) {
    colorIn = "rgba(240, 194, 12,  0.6)"
  } else {
    colorIn = "rgba(241, 128, 23,  0.6)"
  }

  const radius = 40
  const thisSize = radius * 2

  const circleCanvas = document.createElement("canvas")
  circleCanvas.width = thisSize
  circleCanvas.height = thisSize
  const circleCtx = circleCanvas.getContext("2d", { willReadFrequently: true })

  circleCtx.fillStyle = "#ffffff00"
  circleCtx.globalAlpha = 0.0
  circleCtx.fillRect(0, 0, thisSize, thisSize)

  // round background color
  circleCtx.globalAlpha = 1.0
  circleCtx.beginPath()
  circleCtx.arc(radius, radius, radius, 0, Math.PI * 2, true)
  circleCtx.closePath()
  circleCtx.fillStyle = colorIn
  circleCtx.fill()

  //numeric literal
  const text = count + "piece"
  circleCtx.font = radius * 0.6 + "px bold normal" // Set font
  circleCtx.fillStyle = "#ffffff" // Set color
  circleCtx.textAlign = "center" // Set horizontal alignment
  circleCtx.textBaseline = "middle" // Set vertical alignment
  circleCtx.fillText(text, radius, radius) // Draw text (parameters: word to be written, x coordinate, y coordinate)

  return circleCanvas.toDataURL("image/png") // The getImage method can return any canvas image
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  graphicLayer.remove()
  graphicLayer = null

  map = null
}

// The sample code for calculating the height of the ground can update the obtained height into the database, so there is no need to repeat the calculation in the future.
function getDataSurfaceHeight() {
  if (graphicLayer.length === 0) {
    globalMsg("The data has not been loaded successfully!")
    return
  }
  showLoading()

  // Perform the grounding operation on the data in the layer to automatically obtain the grounding height.
  graphicLayer.autoSurfaceHeight().then((graphics) => {
    hideLoading()

    const arr = []
    for (let i = 0, len = graphics.length; i < len; i++) {
      const graphic = graphics[i]
      const point = graphic.point
      arr.push({
        ...graphic.attr,
        lat: point.lat,
        lng: point.lng,
        z: point.alt
      })
    }
    mars3d.Util.downloadFile("point.json", JSON.stringify({ data: arr }))
  })
}

function enabledAggressive(val) {
  graphicLayer.clustering = val
}

function layerShowChange(val) {
  graphicLayer.show = val
}
