// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let measure

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Modify the edit point style, such as size
  mars3d.DrawUtil.setAllEditPointStyle({ pixelSize: 14 })

  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    }
  })
  map.addThing(measure)

  measure.on(mars3d.EventType.start, function (e) {
    console.log("Start asynchronous analysis", e)
    showLoading()
  })
  measure.on(mars3d.EventType.end, function (e) {
    console.log("Complete asynchronous analysis", e)
    hideLoading()
  })

  //Add some demo data
  addDemoGraphic1(measure.graphicLayer)
  addDemoGraphic2(measure.graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
}

function removeAll() {
  measure.clear()
}

// spatial distance
function measureLength() {
  measure.distance({
    showAddText: true,
    label: {
      // Customize the graphic type of display label
      type: "div",
      updateText: function (text, graphic) {
        // updateText is required and is used to dynamically update text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      //The following are the parameters of the graphic corresponding type itself
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      // pointerEvents: false
    }
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    // clampToGround: false // Whether to stick to the ground
    // }
  })
}
// ground distance
function measureSurfaceLength() {
  measure.distanceSurface({
    showAddText: true,
    exact: false // Whether to perform precise calculations. When false is passed, whether to use a quick rough calculation method. This method has lower calculation accuracy but fast calculation speed. It can only calculate the height of coordinates within the current field of view.
    // unit: 'm', //Supports passing in the specified unit of measurement
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    // clampToGround: true // Whether to stick to the ground
    // }
  })
}
// horizontal area
function measureArea() {
  measure
    .area({
      // style: {
      //   color: '#00fff2',
      //   opacity: 0.4,
      //   outline: true,
      //   outlineColor: '#fafa5a',
      //   outlineWidth: 1,
      // clampToGround: false //ClampToGround
      // }
    })
    .then(async (graphic) => {
      const oldPositions = graphic.positionsShow
      const rang = await mars3d.PolyUtil.getHeightRangeByDepth(oldPositions, map.scene)
      graphic.positions = mars3d.PointUtil.setPositionsHeight(oldPositions, rang.maxHeight)
    })
}
// Floor area
function measureSurfaceeArea() {
  measure.areaSurface({
    style: {
      color: "#ffff00"
    },
    splitNum: 10, //The number of step interpolation splits
    exact: false // Whether to perform precise calculations. When false is passed, whether to use a quick rough calculation method. This method has lower calculation accuracy but fast calculation speed. It can only calculate the height of coordinates within the current field of view.
  })
}
//height difference
function measureHeight() {
  measure.height()
}

// triangulation
function measureTriangleHeight() {
  measure.heightTriangle()
}

// azimuth
function measureAngle() {
  measure.angle()
}

// coordinate measurement
function measurePoint() {
  measure.point({
    // popup: function (point, graphic) {
    // return `<div class="mars3d-template-title">Location information</div>
    //   <div class="mars3d-template-content">
    // <div><label>Longitude</label>${point.lng}</div>
    // <div><label>Latitude</label>${point.lat}</div>
    // <div><label>Altitude</label>${point.alt} meters</div>
    //   </div>`
    // }
  })
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.DistanceMeasure({
    positions: [
      [116.193794, 30.994415, 654.8],
      [116.236077, 30.925154, 506.2],
      [116.314569, 30.864239, 408.7],
      [116.341924, 30.847984, 381.8],
      [116.392754, 30.854264, 581.7],
      [116.415222, 30.880092, 580.5],
      [116.567457, 30.85223, 314.6]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    showAddText: true,
    label: {
      // Customize the graphic type of display label
      type: "div",
      updateText: function (text, graphic) {
        // updateText is required and is used to dynamically update text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      //The following are the parameters of the graphic corresponding type itself
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.AreaMeasure({
    positions: [
      [116.361008, 31.128286, 802.2],
      [116.375784, 31.029192, 868.6],
      [116.497717, 31.063687, 497.5],
      [116.509114, 31.146745, 577.1],
      [116.425476, 31.184474, 676.2]
    ],
    style: {
      color: "#ff0000"
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function openJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json") {
    const reader = new FileReader()
    console.log("reader")
    console.log(reader)
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const geojson = JSON.parse(this.result)
      console.log("json file opened", geojson)

      if (geojson.type === "graphic" && geojson.data) {
        measure.graphicLayer.addGraphic(geojson.data)
        measure.graphicLayer.flyTo()
      } else {
        measure.graphicLayer.loadGeoJSON(geojson, { flyTo: true })
      }
    }
  } else {
    globalMsg("Data of " + fileType + " file type is not supported yet!")
  }
}

function saveJSON() {
  if (measure.graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  const geojson = measure.graphicLayer.toJSON()
  mars3d.Util.downloadFile("Measurement results.json", JSON.stringify(geojson))
}
