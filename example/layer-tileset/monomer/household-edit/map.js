// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let geoJsonLayerDTH

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 43.823957, lng: 125.136704, alt: 286, heading: 11, pitch: -24 }
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

  // Model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2030,
    type: "3dtiles",
    name: "campus",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 279.0 },
    maximumScreenSpaceError: 1,
    center: { lat: 43.821193, lng: 125.143124, alt: 990, heading: 342, pitch: -50 }
  })
  map.addLayer(tiles3dLayer)

  //Create a single layer
  geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer()
  map.addLayer(geoJsonLayerDTH)

  geoJsonLayerDTH.bindPopup((e) => {
    const item = e.graphic.attr
    const html = `Room number: ${item.name}<br/>
                Floor: Floor ${item.thisFloor} (Total ${item.allFloor})<br/>`
    return html
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Add singleton data
function addData() {
  return map.graphicLayer.startDraw({
    type: "polygonP",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      geoJsonLayerDTH.addGraphic(graphic)
    }
  })
}

let houseTypeCount = 0

// Generate table data and draw each layer
function produceData(drawGraphicId, dthPara, lastGraphicArrId) {
  if (dthPara.floorCount === 0) {
    globalMsg("The floor cannot be 0!")
    return
  } else if (dthPara.minHeight === 0) {
    globalMsg("The minimum height cannot be 0!")
    return
  } else if (dthPara.maxHeight === 0) {
    globalMsg("The maximum height cannot be 0!")
    return
  } else if (dthPara.maxHeight <= dthPara.minHeight) {
    globalMsg("The highest height cannot be less than or equal to the lowest height!")
    return
  }

  const floorHeight = (dthPara.maxHeight - dthPara.minHeight) / dthPara.floorCount

  // Clear the singleton data corresponding to the id
  if (lastGraphicArrId) {
    lastGraphicArrId.forEach((item) => {
      quitDraw(item)
    })
  }

  if (drawGraphicId) {
    quitDraw(drawGraphicId)
  }
  houseTypeCount++

  const generateGraphicIdArr = []

  for (let i = 0; i < dthPara.floorCount; i++) {
    const height = dthPara.minHeight * 1 + floorHeight * i
    const extrudedHeight = dthPara.minHeight * 1 + floorHeight * (i + 1)
    const color = i % 2 === 0 ? "red" : "#1e1e1e"
    // Data used for popup display. Any data can be added to be displayed in the popup.
    const attr = {
      name: i + 1,
      thisFloor: i + 1,
      houseType: `${houseTypeCount} house type`,
      floorHeight: floorHeight.toFixed(2),
      allFloor: dthPara.floorCount,
      positions: dthPara.positions,
      minHeight: dthPara.minHeight,
      maxHeight: dthPara.maxHeight,
      houseTypeCount
    }
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions: dthPara.positions,
      style: {
        height,
        extrudedHeight,
        //Single default display style
        color: getColor(),
        opacity: 0.3,
        classification: true,
        // Singletify the style highlighted after the mouse is moved or clicked
        highlight: {
          type: mars3d.EventType.click,
          color,
          opacity: 0.6
        }
      },
      attr
    })

    geoJsonLayerDTH.addGraphic(graphic)
    generateGraphicIdArr.push(graphic.id)
  }

  return {
    floorHeight,
    generateGraphicIdArr, //The total id of the singleton surface
    houseTypeCount
  }
}

function getBuildingHeight() {
  return map.graphicLayer.startDraw({
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
      return height
    }
  })
}

// Cancel drawing
function quitDraw(id) {
  const quitGraphic = geoJsonLayerDTH.getGraphicById(id)
  quitGraphic && geoJsonLayerDTH.removeGraphic(quitGraphic)
}

// color
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}

//Clear all graphic data
function clearAllData() {
  geoJsonLayerDTH.clear(true)
}

/**
 * Open geojson file
 *
 * @export
 * @param {FileInfo} file file
 * @returns {void} None
 */
function openGeoJSON(file, resolve) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const geojson = this.result
      geoJsonLayerDTH.loadGeoJSON(geojson)

      resolve(geoJsonLayerDTH.getGraphics())
    }
  } else {
    globalMsg("Data of " + fileType + " file type is not supported yet!")
  }
}

// Click to save GeoJSON
function saveGeoJSON() {
  if (geoJsonLayerDTH.length === 0) {
    globalMsg("There is currently no data, no need to save!")
    return
  }
  const geojson = geoJsonLayerDTH.toGeoJSON()
  mars3d.Util.downloadFile("Hierarchical household division vector singleton.json", JSON.stringify(geojson))
}
