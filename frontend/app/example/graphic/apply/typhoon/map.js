// import * as mars3d from "mars3d"
// import { Typhoon, PlayTyphoon } from "./Typhoon"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 8.560501, lng: 111.849127, alt: 10725692, heading: 358, pitch: -87 }
  }
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Draw 24/48 hour warning line
  drawWarningLine()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Collection of all constructed typhoons
const typhoonListObj = {}

//The currently selected typhoon
let selectTyphoon

// Check Typhoon
function selectOneTyphoon(row) {
  stopPlay()

  const id = row.id
  if (!typhoonListObj[id]) {
    typhoonListObj[id] = new Typhoon({ ...row }, map)
  }

  const typhoon = typhoonListObj[id]
  typhoon.show = true
  typhoon.flyTo()

  selectTyphoon = typhoon
}

// Uncheck Typhoon
function unSelectOneTyphoon(id) {
  const typhoon = typhoonListObj[id]
  if (!typhoon) {
    return
  }

  if (typhoon.playTyphoon) {
    typhoon.playTyphoon.stop()
  }
  typhoon.show = false

  selectTyphoon = null
}

// Locate the typhoon
function clickTyRow(row) {
  const typhoon = typhoonListObj[row.id]
  if (typhoon) {
    typhoon.flyTo()
  }
}

// Locate the track point
function clickPathRow(row) {
  selectTyphoon.showPointFQ(row)
  const graphic = selectTyphoon.getPointById(row.id)
  if (graphic) {
    graphic.flyTo({
      radius: 1600000,
      complete() {
        graphic.openTooltip()
      }
    })
  }
}

// Start playing
function startPlay() {
  if (!selectTyphoon) {
    return
  }

  if (!selectTyphoon.playTyphoon) {
    selectTyphoon.playTyphoon = new PlayTyphoon(selectTyphoon.options, map)
  }

  selectTyphoon.playTyphoon.start()
  selectTyphoon.show = false
}

// Stop play
function stopPlay() {
  if (selectTyphoon?.playTyphoon) {
    selectTyphoon.playTyphoon.stop()
    selectTyphoon.show = true
  }
}

//Draw a warning line
function drawWarningLine() {
  //Draw a 24-hour warning line
  const lineWarning24 = new mars3d.graphic.PolylineEntity({
    positions: [
      [127, 34],
      [127, 22],
      [119, 18],
      [119, 11],
      [113, 4.5],
      [105, 0]
    ],
    style: {
      color: "#828314",
      width: 2,
      zIndex: 1
    }
  })
  map.graphicLayer.addGraphic(lineWarning24)

  // Annotation text
  const textWarning24 = new mars3d.graphic.RectangleEntity({
    positions: [
      [128.129019, 29.104287],
      [125.850451, 28.424599]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "24-hour cordon",
        font: "80px regular script",
        color: "#828314",
        backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0)
      },
      rotationDegree: 90
    }
  })
  map.graphicLayer.addGraphic(textWarning24)

  //Draw a 48-hour warning line
  const lineWarning48 = new mars3d.graphic.PolylineEntity({
    positions: [
      [132, 34],
      [132, 22],
      [119, 0],
      [105, 0]
    ],
    style: {
      width: 2,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        dashLength: 20.0,
        color: "#4dba3d"
      }
    }
  })
  map.graphicLayer.addGraphic(lineWarning48)

  // Annotation text
  const textWarning48 = new mars3d.graphic.RectangleEntity({
    positions: [
      [130.502492, 25.959716],
      [133.423638, 26.772991]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "48-hour cordon",
        font: "80px regular script",
        color: "#4dba3d",
        backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0)
      },
      rotationDegree: 90,
      zIndex: 4
    }
  })
  map.graphicLayer.addGraphic(textWarning48)
}

var formatDate = mars3d.Util.formatDate
