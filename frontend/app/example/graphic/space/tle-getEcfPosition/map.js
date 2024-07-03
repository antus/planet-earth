// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

let tleArr
let drawGraphic
let tableList = []

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 21.105826, lng: 108.202174, alt: 4426845, heading: 0, pitch: -77 },
    cameraController: {
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  queryTleChinaApiData()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Access the backend interface and get data
function queryTleChinaApiData() {
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle-china.json" })
    .then(function (data) {
      tleArr = data.data
      console.log("Number of satellites: " + tleArr.length)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

// Frame selection query rectangle

function drawRectangle() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    allowDrillPick: true,
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}

// Frame selection query multi-edge
function drawPolygon() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    allowDrillPick: true,
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}

// Frame selection query circle
function drawCircle() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "circle",
    allowDrillPick: true,
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}

function drawClear() {
  map.graphicLayer.clear()
  drawGraphic = null
}

// clear effect
function clearResult() {
  tableList = []
  drawClear()
}

//= ===============Satellite transit============================== =====

// color
const pointClr = Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.7)
/**
 *
 * @export
 * @param {time} startTimes start time
 * @param {time} endTimes end time
 * @returns {void}
 */
function startFX(startTimes, endTimes) {
  if (!drawGraphic) {
    globalMsg("Please draw an area on the map first")
    return
  }

  //Scope related information
  const options = {
    startTimes,
    endTimes,
    graphic: drawGraphic
  }

  //Analyze satellite position
  const newSatelliteArr = [] //Storage data of satellites flying through the specified range
  for (let ind = 0; ind < tleArr.length; ind++) {
    const item = tleArr[ind]
    const arr = fxOneSatellite(item, options)

    if (arr.length === 0) {
      continue
    }

    item.inAreaPath = arr
    newSatelliteArr.push(item)
  }

  showResult(newSatelliteArr)
}

function fxOneSatellite(item, options) {
  const inAreaPath = []
  let lastObj = null

  const graphic = options.graphic
  const startTimes = options.startTimes
  const endTimes = options.endTimes
  const step = 10 * 1000 // Number of interpolations

  let nowTime = startTimes

  let position
  while (nowTime <= endTimes) {
    // Calculate satellite position based on time
    const position = mars3d.Tle.getEcfPosition(item.tle1, item.tle2, nowTime)
    if (!position) {
      break
    }
    //Display points [refer to whether the comparison result is correct]
    // let timeStr = new Date(nowTime).format("yyyy-MM-dd HH:mm:ss")
    const pointPrimitive = new mars3d.graphic.PointPrimitive({
      position,
      style: {
        color: pointClr,
        pixelSize: 3
      },
      attr: item
      // tooltip: `Number: ${item.norad} <br />Satellite: ${item.name} <br />Time: ${timeStr}`
    })
    map.graphicLayer.addGraphic(pointPrimitive)

    // Determine whether the satellite is in the buffer zone
    const isInPoly = graphic.isInPoly(position)

    // console.log(`${item.name}, time: ${timeStr}, result: ${isInPoly}`);

    if (lastObj && !lastObj.isInPoly && isInPoly) {
      //Indicates entering the range
      inAreaPath.push({
        lastPosition: lastObj.position,
        lastTime: lastObj.time,
        time: nowTime,
        position,
        inOrOut: "in"
      })
    }

    if (lastObj && lastObj.isInPoly && !isInPoly) {
      // show range
      inAreaPath.push({
        position,
        lastPosition: lastObj.position,
        lastTime: lastObj.time,
        time: nowTime,
        inOrOut: "out"
      })
      break
    }

    lastObj = {
      position,
      isInPoly,
      time: nowTime
    }
    nowTime += step
  }

  if (lastObj && lastObj.isInPoly) {
    // show range
    inAreaPath.push({
      position,
      lastPosition: lastObj.position,
      lastTime: lastObj.time,
      time: nowTime,
      inOrOut: "out"
    })
  }

  return inAreaPath
}

//= ====================Result display========================== =========

function showResult(newSatelliteArr) {
  // Display satellite strips

  for (let ind = 0; ind < newSatelliteArr.length; ind++) {
    const item = newSatelliteArr[ind]
    const inAreaPath = item.inAreaPath
    if (inAreaPath.length < 2) {
      continue
    }

    let index = 0
    if (inAreaPath[0].inOrOut === "out") {
      // Guaranteed to start counting from entry
      index = 1
    }

    for (let i = index; i < inAreaPath.length; i = i + 2) {
      const positions = []
      let inTime
      let outTime
      if (inAreaPath[i].inOrOut === "in" && inAreaPath[i + 1].inOrOut === "out") {
        const inAttr = inAreaPath[i]
        const outAttr = inAreaPath[i + 1]
        if (inAttr?.lastPosition) {
          inTime = mars3d.Util.formatDate(new Date(inAttr.lastTime), "yyyy-M-d HH:mm:ss")
          positions.push(inAttr.lastPosition)
        }
        if (outAttr?.position) {
          positions.push(outAttr.position)
          outTime = mars3d.Util.formatDate(new Date(outAttr.time), "yyyy-M-d HH:mm:ss")
        }
        if (positions.length > 1) {
          const data = {
            positions,
            name: item.name,
            inTime,
            outTime,
            often: mars3d.Util.formatTime((outAttr.time - inAttr.lastTime) / 1000),
            distance: mars3d.MeasureUtil.formatDistance(Cesium.Cartesian3.distance(positions[1], positions[0]))
          }
          tableList.push(data)


          showCorridor(data)
        }
      }
    }
  }
  eventTarget.fire("dataList", { tableList })

  globalMsg("Analysis completed, total" + tableList.length + "transit records")
}

function showCorridor(data) {
  const graphic = new mars3d.graphic.CorridorPrimitive({
    positions: data.positions,
    style: {
      width: 6000,
      cornerType: Cesium.CornerType.MITERED, // Specify the corner style
      color: "#00ff00"
    }
  })
  map.graphicLayer.addGraphic(graphic)

  const inthtml =
    '<table style="width:280px;">' +
    '<tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">Information</th></tr>' +
    "<tr><td >Satellite name:</td><td >" +
    data.name +
    " </td></tr>" +
    "<tr><td >Entry time:</td><td >" +
    data.inTime +
    " </td></tr>" +
    "<tr><td >Flyout time:</td><td >" +
    data.outTime +
    " </td></tr>" +
    "<tr><td >Transit duration:</td><td >" +
    data.often +
    " </td></tr>" +
    "<tr><td >Transit distance:</td><td >" +
    data.distance +
    " </td></tr>" +
    "</table>"
  graphic.bindPopup(inthtml)

  data._graphic = graphic
}
