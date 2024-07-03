// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var echartTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.526546, lng: 119.823425, alt: 803, heading: 178, pitch: -27 },
    fxaa: true
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

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tower.json" })
    .then(function (res) {
      showData(res.data)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showData(arrdata) {
  let polylines1 = []
  let polylines2 = []
  let polylines3 = []
  let polylines4 = []

  const polylinesTB = []
  for (let i = 0; i < arrdata.length; i++) {
    const item = arrdata[i]

    //Longitude and latitude coordinates and altitude
    const longitude = Number(item.longitude)
    const latitude = Number(item.latitude)
    const height = Number(item.height)

    const originPoint = {
      longitude,
      latitude,
      height
    }
    const position = Cesium.Cartesian3.fromDegrees(originPoint.longitude, originPoint.latitude, originPoint.height)

    // Calculate the corner angle of the wire tower
    const degree = parseInt(item.degree)

    //Coordinates of 5 lines
    const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(degree), 0, 0)
    const newPoint1 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, 9, 51.5), hpr)
    const newPoint2 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, -9, 51.5), hpr)

    const newPoint3 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, -12, 47.5), hpr)
    const newPoint4 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, 12, 47.5), hpr)

    polylinesTB.push(newPoint3) //The point displayed by the icon

    if (i === 0) {
      polylines1.push(newPoint1)
      polylines2.push(newPoint2)
      polylines3.push(newPoint3)
      polylines4.push(newPoint4)
    } else {
      const angularityFactor = -5000
      const num = 50
      let positions = mars3d.PolyUtil.getLinkedPointList(polylines1[polylines1.length - 1], newPoint1, angularityFactor, num) // Calculate curve points
      polylines1 = polylines1.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines2[polylines2.length - 1], newPoint2, angularityFactor, num) // Calculate curve points
      polylines2 = polylines2.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines3[polylines3.length - 1], newPoint3, angularityFactor, num) // Calculate curve points
      polylines3 = polylines3.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines4[polylines4.length - 1], newPoint4, angularityFactor, num) // Calculate curve points
      polylines4 = polylines4.concat(positions)
    }

    const html = mars3d.Util.getTemplateHtml({
      title: "Tower",
      template: [
        { field: "roadName", name: "Line to which it belongs" },
        { field: "towerId", name: "Tower number" },
        { field: "Tower model", name: "Tower model" },
        { field: "Pole and Tower Properties", name: "Pole and Tower Properties" },
        { field: "Tower Type", name: "Tower Type" },
        { field: "Commissioning date", name: "Commissioning date" },
        { field: "Total height of tower", name: "Total height of tower" },
        { field: "Design Unit", name: "Design Unit" },
        { field: "Construction Unit", name: "Construction Unit" },
        { field: "height", name: "elevation" }
      ],
      attr: item
    })

    drawWireTowerModel(position, degree, html)
  }

  // draw route
  drawGuideLine(polylines1, "#ffffff")
  drawGuideLine(polylines2, "#ffffff")
  drawGuideLine(polylines3, "#0000ff")
  drawGuideLine(polylines4, "#ff0000")

  //Draw the cross-section echarts chart
  computeSurfacePointsHeight(polylinesTB)
}

//Draw the wire tower model
function drawWireTowerModel(position, degree, inthtml) {
  const graphic = new mars3d.graphic.ModelPrimitive({
    position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/tower/tower.glb",
      heading: degree,
      scale: 1,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0)
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindPopup(inthtml)
}

function drawGuideLine(positions, color) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions,
    style: {
      width: 4,
      color
    }
  })
  graphicLayer.addGraphic(graphic)
}

//Draw the cross-section echarts chart
function computeSurfacePointsHeight(polylines) {
  //Draw cross-section diagram
  mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: polylines, // Array of source route coordinates to be calculated
    exact: true
  }).then((result) => {
    const heightArry = []
    const heightTDArray = []
    let distanceArray
    for (let i = 0; i < polylines.length; i++) {
      const item = polylines[i]
      const carto = Cesium.Cartographic.fromCartesian(item)

      const height = mars3d.Util.formatNum(carto.height) // Design height When the numbers after the decimal point are consistent, the decimal point will be omitted and not displayed.
      const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(result.positions[i]).height) // Ground height
      heightArry.push(height)
      heightTDArray.push(tdHeight)

      // distance array
      const positionsLineFirst = result.positions[0]
      distanceArray = result.positions.map(function (data) {
        return Math.round(Cesium.Cartesian3.distance(data, positionsLineFirst)) // Calculate the distance between two points and return the distance
      })
    }
    echartTarget.fire("addEchart", { heightArry, heightTDArray, distanceArray })
  })
}

// function downloadNewFile(res) {
//   const polylinesTB = []
//   for (let i = 0; i < res.data.length; i++) {
//     const item = res.data[i]
//     const longitude = Number(item.longitude)
//     const latitude = Number(item.latitude)
//     const height = Number(item.height)
//     const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
//     polylinesTB.push(position)
//   }
//   mars3d.PolyUtil.computeSurfacePoints({
//     scene: map.scene,
// positions: polylinesTB, // Array of source route coordinates to be calculated
//     exact: true
//   }).then((result) => {
//     for (let i = 0; i < result.positions.length; i++) {
// const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(result.positions[i]).height) // Ground height
//       res.data[i].height = tdHeight

//       delete res.data[i].heightCol
//       delete res.data[i].latCol
//       delete res.data[i].lonCol
//     }
//     mars3d.Util.downloadFile("tower.json", JSON.stringify(res))
//   })
// }
