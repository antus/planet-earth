// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

let geoJsonLayerDTH

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 43.822109, lng: 125.14311, alt: 890, heading: 337, pitch: -50 }
  },
  control: {
    infoBox: false
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

  // 3D model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "campus",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 279.0 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tilesetLayer)

  //Single layer
  geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer({
    name: "Campus-Single",
    symbol: {
      type: "polygonP",
      styleOptions: {
        //Single default display style
        color: "rgba(255, 255, 255, 0.01)",
        clampToGround: true,
        classification: true,
        buffer: 1,
        // Singletify the style highlighted after the mouse is moved or clicked
        highlight: {
          type: mars3d.EventType.click,
          color: "rgba(255,255,0,0.4)"
        }
      }
    },
    popup: [
      { field: "name", name: "school place" },
      { field: "sfkf", name: "Is it open" },
      { field: "remark", name: "Remarks information" }
    ]
  })
  map.addLayer(geoJsonLayerDTH)

  mars3d.DrawUtil.setEditPointStyle(mars3d.EditPointType.Control, { has3dtiles: true }) // Edit point and paste model

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true, // Whether to automatically activate editing after drawing is completed
    symbol: {
      type: "polygon",
      merge: true, // Whether to merge and overwrite existing styles in json, not merged by default
      styleOptions: {
        color: "rgba(255, 255, 0, 0.4)",
        clampToGround: true
      }
    }
  })
  map.addLayer(graphicLayer)

  // Download Data
  const configUrl = "//data.mars3d.cn/file/geojson/dth-xuexiao-fd.json"
  mars3d.Util.fetchJson({ url: configUrl })
    .then(function (result) {
      graphicLayer.loadGeoJSON(result)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })

  bindLayerContextMenu()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Bind right-click menu functions to start editing, deleting, etc.
 *@returns {void} None
 */
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
      text: "Calculate perimeter",
      icon: "fa fa-medium",
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The perimeter of this object is:" + strDis)
      }
    },
    {
      text: "Calculate area",
      icon: "fa fa-reorder",
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}

//Switch to preview mode
function toYLMS() {
  const geojson = graphicLayer.toGeoJSON()

  geoJsonLayerDTH.load({ data: geojson })

  graphicLayer.hasEdit = false
  graphicLayer.show = false
}

//Switch to edit mode
function toBJMS() {
  geoJsonLayerDTH.clear()
  graphicLayer.hasEdit = true
  graphicLayer.show = true
}

function deleteAll() {
  graphicLayer.clear()
}

function drawPolygon() {
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#000000",
      clampToGround: true
    }
  })
}

/**
 *Open geojson file
 *
 * @export
 * @param {FileInfo} file file name
 * @returns {void} None
 */
function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const json = this.result
      graphicLayer.loadGeoJSON(json, {
        clear: true,
        flyTo: true
      })
    }
  } else {
    globalMsg("Data of " + fileType + " file type is not supported yet!")
  }
}

//Save JSON file
function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  const layers = map.getLayerById(graphicLayer.id)
  const geojson = layers.toGeoJSON()
  mars3d.Util.downloadFile("Single.json", JSON.stringify(geojson))
}
