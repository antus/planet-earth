// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.314417, lng: 118.82149, alt: 78939, heading: 358, pitch: -46 }
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
  map.basemap = 2017

  // show border
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Nanjing City",
    url: "//data.mars3d.cn/file/geojson/areas/320100_full.json",
    symbol: {
      type: "wall",
      styleOptions: {
        diffHeight: 800, // wall height
        outline: false,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          speed: 10, // speed
          image: "img/textures/fence.png", // image
          repeatX: 1, // number of repeats
          axisY: true, // vertical direction
          color: "#00ffff", // color
          opacity: 0.6 // transparency
        },
        label: {
          text: "{name}",
          font_size: 18,
          color: "#ffffff",
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 500000,
          distanceDisplayCondition_near: 0,

          position: "center",
          setHeight: 900
        }
      }
    },
    popup: "{name}"
  })
  map.addLayer(geoJsonLayer)

  //Create DIV data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  addDemoGraphic1(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Display college points
function addDemoGraphic1(graphicLayer) {
  const pointColorArr = ["#f33349", "#f79a2c", "#f2fa19", "#95e40c", "#1ffee6"]
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/gaoxiao.json" })
    .then(function (arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i]
        const positions = item["Longitude and Latitude"].split(",") // Get the latitude and longitude coordinates
        if (postions.length !== 2) {
          continue
        }

        const lng = Number(postions[0])
        const lat = Number(postions[1])
        const pointColor = pointColorArr[i % pointColorArr.length]

        const graphic = new mars3d.graphic.DivLightPoint({
          name: item["university name"],
          position: Cesium.Cartesian3.fromDegrees(lng, lat),
          style: {
            color: pointColor,
            size: item["Competent Department"] === "Ministry of Education" ? 15 : 10,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000) //Display according to sight distance
            // label: {
            // text: item["University Name"], // Content
            //   color: "#ffffff"
            // }
          },
          attr: item
        })
        graphicLayer.addGraphic(graphic)
      }
      eventTarget.fire("addTableData", { graphicLayer })
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

//BusineDataLayer business data (obtained through API interface) layer
// function addDemoGraphic2() {
//   const dataLayer = new mars3d.layer.BusineDataLayer({
//     url: "//data.mars3d.cn/file/apidemo/gaoxiao.json",
//     symbol: {
//       type: "divLightPoint",
//       styleOptions: {
//         color: "#f33349",
//         size: 10,
//         distanceDisplayCondition: true,
//         distanceDisplayCondition_far: 200000,
//         distanceDisplayCondition_near: 0
//       }
//     },
// // Custom analytical coordinates
//     formatPosition: (attr, graphic) => {
// const position = attr["latitude and longitude"].split(",") // Get the latitude and longitude coordinates
//       if (postion.length !== 2) {
//         return null
//       } else {
//         return postion
//       }
//     },
//     popup: "all"
//   })
//   map.addLayer(dataLayer)
// }

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

    const graphic = new mars3d.graphic.DivLightPoint({
      position,
      style: {
        color: "#f33349"
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "divLightPoint",
    style: {
      color: "#f33349"
    }
  })
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

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Start editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "Stop editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        graphic.stopEditing()
        graphicLayer.removeGraphic(graphic)
      }
    }
  ])
}
