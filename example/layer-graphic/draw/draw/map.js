// import * as mars3d from "mars3d"
// // import kgUtil from "kml-geojson"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var mapOptions = {
  // scene: {
  //   center: { lat: 30.846849, lng: 116.335307, alt: 739, heading: 360, pitch: -45 }
  // },
  control: {
    infoBox: false
  },
  layers: [
    {
      name: "Hefei City",
      type: "geojson",
      url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
      symbol: {
        styleOptions: {
          fill: true,
          randomColor: true, // random color
          opacity: 0.3,
          outline: true,
          outlineStyle: {
            color: "#FED976",
            width: 3,
            opacity: 1
          },
          highlight: {
            opacity: 0.9
          }
        }
      },
      popup: "{name}",
      flyTo: true,
      show: true
    }
  ]
}

var eventTarget = new mars3d.BaseClass()

let keyDownCode //The code corresponding to the key that has been pressed

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Set edit point style
  // mars3d.DrawUtil.setEditPointStyle(mars3d.EditPointType.Control, {
  // type: mars3d.GraphicType.billboardP, // Support setting type to specify the edit point type
  //   image: "img/icon/move.png",
  //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //   verticalOrigin: Cesium.VerticalOrigin.CENTER
  // })

  graphicLayer = new mars3d.layer.GraphicLayer({
    // isRestorePositions: true,
    hasEdit: true,
    isAutoEditing: true // Whether to automatically activate editing after drawing is completed
    // drawAddEventType: false,
    // drawEndEventType: mars3d.EventType.rightClick,
    // drawDelEventType: mars3d.EventType.middleClick
  })
  map.addLayer(graphicLayer)

  //Modify text
  // map.setLangText({
  // _Double-click to complete drawing: "Right-click to complete drawing",
  // _Right-click to delete point: "Middle-click to complete drawing"
  // })

  // map.on(mars3d.EventType.mouseOver, function (event) {
  //   console.log("mouseover")
  // })
  map.on(mars3d.EventType.mouseOut, function (event) {
    map.closeSmallTooltip()
  })

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  // Bind layer plotting related event monitoring (you can add relevant code yourself to achieve business needs, here are mainly examples)
  graphicLayer.on(mars3d.EventType.drawStart, function (e) {
    console.log("Start drawing", e)
  })
  graphicLayer.on(mars3d.EventType.drawAddPoint, function (e) {
    console.log("Points added during drawing", e)
  })
  graphicLayer.on(mars3d.EventType.drawRemovePoint, function (e) {
    console.log("Point deleted during drawing", e)
  })
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    console.log("Creation completed", e)
  })
  graphicLayer.on(mars3d.EventType.editStart, function (e) {
    console.log("Start editing", e)
  })
  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    console.log("The editor modified the point", e)
  })
  graphicLayer.on(mars3d.EventType.editAddPoint, function (e) {
    console.log("The editor added a new point", e)
  })
  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    console.log("Edit deleted the point", e)
  })
  graphicLayer.on(mars3d.EventType.editStop, function (e) {
    console.log("Stop editing", e)
  })
  graphicLayer.on(mars3d.EventType.removeGraphic, function (e) {
    console.log("Object deleted", e)
  })

  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  loadDemoData()

  // map.on(mars3d.EventType.keyup, function (e) {
  // console.log("Keyboard pressed", e)

  // // ESC button
  //   if (e.keyCode === 27) {
  // graphicLayer._graphic_drawing._positions_draw.pop() // Delete the last point
  //   }
  // })

  // button pressed
  map.on(mars3d.EventType.keydown, function (e) {
    keyDownCode = e.keyCode //The code corresponding to the key that has been pressed
  })

  // Release the button after pressing it
  map.on(mars3d.EventType.keyup, function (e) {
    keyDownCode = undefined
  })

  //Custom prompt
  // map.setLangText({
  // _Double-click to complete drawing: "",
  // _Click to start drawing: "New prompt content",
  // _Click to add a point, right-click to delete a point: "New prompt content"
  // })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawPoint() {
  // graphicLayer.isContinued = true
  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 12,
      color: "#3388ff",
      label: {
        // When text is not needed, just remove the label configuration
        text: "can support text at the same time",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
}

function drawMarker() {
  graphicLayer.startDraw({
    type: "billboard",
    style: {
      image: "img/marker/mark-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        // When text is not needed, just remove the label configuration
        text: "can support text at the same time",
        font_size: 26,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -60
      }
    }
  })
}

function drawLabel() {
  graphicLayer.startDraw({
    type: "label",
    style: {
      text: "Mars Technology 3D Earth",
      color: "#0081c2",
      font_size: 50,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    }
  })
}

function startDrawModel() {
  graphicLayer.startDraw({
    type: "model",
    style: {
      scale: 10,
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche.gltf"
    }
  })
}

function drawPolyline(clampToGround) {
  // map.highlightEnabled = false
  // map.popup.enabled = false

  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    },
    // When drawing, externally customized update coordinates can be customized to handle special business and return modified new coordinates.
    updateDrawPosition: function (position, graphic) {
      if (keyDownCode === 67) {
        // Press the C key to limit it to the latitude line
        position = updateDrawPosition(position, graphic.lastDrawPoint, 1)
      } else if (keyDownCode === 86) {
        // Press the V key to limit it to the longitude line
        position = updateDrawPosition(position, graphic.lastDrawPoint, 2)
      }
      return position
    }
    // External custom verification coordinates. When false is returned, the coordinates are invalid and will not participate in drawing.
    // validDrawPosition: function (position, graphic) {
    //   const point = mars3d.LngLatPoint.fromCartesian(position)
    //   return (point.lng > 115 && point.lng < 117)
    // }
  })

  // .then(() => {
  //   map.highlightEnabled = true
  //   map.popup.enabled = true
  // })
}

function updateDrawPosition(thisPoint, lastPoint, type) {
  if (!lastPoint || !thisPoint) {
    return thisPoint
  }
  thisPoint = mars3d.LngLatPoint.fromCartesian(thisPoint)
  lastPoint = mars3d.LngLatPoint.fromCartesian(lastPoint)

  if (type === 1) {
    thisPoint.lat = lastPoint.lat
  } else {
    thisPoint.lng = lastPoint.lng
  }
  return thisPoint.toCartesian()
}

function drawBrushLine(clampToGround) {
  graphicLayer.startDraw({
    type: "brushLine",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    }
  })
}

function drawPolygon(clampToGround) {
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
}

function drawCurve(clampToGround) {
  graphicLayer.startDraw({
    type: "curve",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    }
  })
}

function drawCorridor(clampToGround) {
  graphicLayer.startDraw({
    type: "corridor",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      width: 500,
      clampToGround
    }
  })
}

function drawEllipse(clampToGround) {
  graphicLayer.startDraw({
    type: "circle",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
}

function drawRectangle(clampToGround) {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
}

function draPlane() {
  graphicLayer.startDraw({
    type: "plane",
    style: {
      color: "#00ff00",
      opacity: 0.8,
      plane_normal: "x",
      dimensions_x: 1000.0,
      dimensions_y: 1000.0
    }
  })
}

function draWall(closure) {
  graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#00ff00",
      opacity: 0.8,
      diffHeight: 400,
      closure // whether to close
    }
  })
}

function drawBox() {
  graphicLayer.startDraw({
    type: "box",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      dimensions_x: 1000.0,
      dimensions_y: 1000.0,
      dimensions_z: 1000.0
    }
  })
}

function drawCylinder() {
  graphicLayer.startDraw({
    type: "cylinder",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6,
      length: 1000
    }
  })
}

function drawEllipsoid() {
  graphicLayer.startDraw({
    type: "ellipsoid",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6
    }
  })
}

function drawExtrudedPolygon() {
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
}

function drawExtrudedRectangle() {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
}

function drawExtrudedCircle() {
  graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
}

function drawSatellite() {
  graphicLayer
    .startDraw({
      type: "satellite",
      style: {
        tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
        tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
        path_show: true,
        path_color: "#00ff00",
        path_width: 1,
        model_show: true,
        model_url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
        model_scale: 1,
        model_minimumPixelSize: 90
      }
    })
    .then((graphic) => {
      setTimeout(() => {
        graphic.flyToPoint()
      }, 100)
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
        const parent = graphic.parent // When the right click is the editing point
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "Calculate length",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The length of this object is:" + strDis)
      }
    },
    {
      text: "Calculate perimeter",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The perimeter of this object is:" + strDis)
      }
    },
    {
      text: "Calculate area",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP" ||
          graphic.type === "scrollWall" ||
          graphic.type === "water"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}

function updateonlyVertexPosition(value) {
  map.onlyVertexPosition = value
}

/**
 * Open geojson file
 *
 * @export
 * @param {FileInfo} file file
 * @returns {void} None
 */
function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      let geojson = this.result
      geojson = simplifyGeoJSON(geojson) // Simplify geojson points
      graphicLayer.loadGeoJSON(geojson, {
        flyTo: true
      })
    }
  } else if (fileType === "kml") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const strkml = this.result
      kgUtil.toGeoJSON(strkml).then((geojson) => {
        geojson = simplifyGeoJSON(geojson) // Simplify geojson points
        console.log("kml2geojson", geojson)

        graphicLayer.loadGeoJSON(geojson, {
          flyTo: true
        })
      })
    }
  } else if (fileType === "kmz") {
    //Load the binary stream of the input file control
    kgUtil.toGeoJSON(file).then((geojson) => {
      geojson = simplifyGeoJSON(geojson) // Simplify geojson points
      console.log("kmz2geojson", geojson)

      graphicLayer.loadGeoJSON(geojson, {
        flyTo: true
      })
    })
  } else {
    globalMsg("Data of " + fileType + " file type is not supported yet!")
  }
}

// Simplify geojson coordinates
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.000001, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

// Click to save GeoJSON
function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("My annotation.json", JSON.stringify(geojson))
}

// Click to save KML
function saveKML() {
  if (graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  let geojsonObject = graphicLayer.toGeoJSON()
  if (geojsonObject == null) {
    return null
  }

  geojsonObject = JSON.parse(JSON.stringify(geojsonObject))

  const kml = kgUtil.toKml(geojsonObject, {
    name: "Mars3D plotting data",
    documentName: "Mars3D plotting data file",
    documentDescription: "Plotting data by mars3d.cn",
    simplestyle: true
  })

  mars3d.Util.downloadFile("My annotation.kml", kml)
}

// Click to save WKT
function saveWKT() {
  if (graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  let geojsonObject = graphicLayer.toGeoJSON()
  if (geojsonObject == null) {
    return null
  }
  geojsonObject = JSON.parse(JSON.stringify(geojsonObject))

  const arrWKT = []
  let index = 0
  geojsonObject.features.forEach((feature) => {
    const attr = feature.properties
    const style = feature.properties.style

    const wkt = Terraformer.WKT.convert(feature.geometry) // geojson converts WKT format, terraformer library
    arrWKT.push({
      id: ++index,
      name: attr.name || "",
      remark: attr.remark || "",
      style,
      wkt
    })
  })
  mars3d.Util.downloadFile("My annotation wkt.txt", JSON.stringify(arrWKT))
}

//Load demo data
function loadDemoData() {
  // if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  // //Do not display historical data locally
  //   return
  // }

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/mars3d-draw.json" }).then(function (json) {
    graphicLayer.loadGeoJSON(json, { clear: true, flyTo: true })
  })
}
