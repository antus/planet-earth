"use script" //It is recommended to turn on strict mode in the development environment

// Bind the Popup window to the layer
function bindLayerPopup2() {
  graphicLayer.bindPopup(
    function (event) {
      const attr = getAttrForEvent(event)
      attr["type"] = event.graphic?.type
      attr["source"] = "I am the Popup bound to the layer"
      attr["Remarks"] = "I support mouse interaction"

      return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr: attr })

      // return new Promise((resolve) => {
      // //Here you can request data from the backend interface, and setTimeout tests asynchronously
      //   setTimeout(() => {
      // resolve('Pop-up window content information displayed by Promise asynchronous callback')
      //   }, 2000)
      // })
    },
    { pointerEvents: true }
  )
}

//Bind right-click menu
function bindLayerContextMenu2() {
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
        haoutil.alert("The length of this object is:" + strDis)
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
        haoutil.alert("The perimeter of this object is:" + strDis)
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
        haoutil.alert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}

function getAttrForEvent(event) {
  if (event?.graphic?.attr) {
    return event.graphic.attr
  }
  if (!event.czmObject) {
    return {}
  }

  let attr = event.czmObject._attr || event.czmObject.properties || event.czmObject.attribute
  if (attr && attr.type && attr.attr) {
    attr = attr.attr // Compatible with historical data, geojson produced by V2 internal plotting
  }
  return attr ?? {}
}

//****************************** Data test****************** ****** //
// Generate big data
function onClickAddRandomGraohic(count) {
  haoutil.loading.show()
  const startTime = new Date().getTime()

  const result = addRandomGraphicByCount(count)

  haoutil.loading.close()
  const endTime = new Date().getTime()
  const usedTime = (endTime - startTime) / 1000 // The number of milliseconds between the two timestamps
  window.layer.msg(`Generating ${result || count} pieces of data, taking a total of ${usedTime.toFixed(2)} seconds`)

  graphicLayer.flyTo({ duration: 0, heading: 0, pitch: -40, scale: 1.2 })
}
// ***************************** Data output***************** ****** //
//Open geojson
function onClickImpFile(file) {
  let fileName = file.name
  let fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType == "json" || fileType == "geojson") {
    let reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      let geojson = JSON.parse(this.result)

      if (geojson.type == "graphic" && geojson.data) {
        graphicLayer.addGraphic(geojson.data)
        graphicLayer.flyTo()
      } else {
        geojson = simplifyGeoJSON(geojson) //Simplify geojson points
        graphicLayer.loadGeoJSON(geojson, { flyTo: true })
      }
      clearSelectFile()
      refreshTabel(graphicLayer)
    }
  } else if (fileType == "kml") {
    let reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      let strkml = this.result
      kgUtil.toGeoJSON(strkml).then((geojson) => {
        geojson = simplifyGeoJSON(geojson) //Simplify geojson points
        console.log("kml2geojson", geojson)

        graphicLayer.loadGeoJSON(geojson, {
          flyTo: true
        })
        clearSelectFile()
      })
      clearSelectFile()
    }
  } else if (fileType == "kmz") {
    //Load the binary stream of the input file control
    kgUtil.toGeoJSON(file).then((geojson) => {
      geojson = simplifyGeoJSON(geojson) //Simplify geojson points
      console.log("kmz2geojson", geojson)

      graphicLayer.loadGeoJSON(geojson, {
        flyTo: true
      })
      clearSelectFile()
    })
  } else {
    window.layer.msg("Not supported yet" + fileType + "data of file type!")
    clearSelectFile()
  }
}

function clearSelectFile() {
  if (!window.addEventListener) {
    document.getElementById("input_draw_file").outerHTML += "" //IE
  } else {
    document.getElementById("input_draw_file").value = "" //FF
  }
}

//Simplify the coordinates of geojson
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.000001, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

// save geojson
function expGeoJSONFile() {
  if (graphicLayer.length === 0) {
    window.layer.msg("No data is currently marked, no need to save!")
    return
  }

  let geojson = graphicLayer.toGeoJSON()
  haoutil.file.downloadFile("Vector data GeoJSON.json", JSON.stringify(geojson))
}

// save json
function expJSONFile() {
  if (graphicLayer.length === 0) {
    window.layer.msg("No data is currently marked, no need to save!")
    return
  }
  const geojson = graphicLayer.toJSON()
  mars3d.Util.downloadFile("Vector data construction parameters.json", JSON.stringify(geojson))
}

//******************************Properties panel****************** ****** //
// Bind event and activate the property panel
function bindAttributePannel() {
  //Initialize table data
  if ($("#graphicTable")) {
    graphicLayer.readyPromise.then(function (layer) {
      getTableData(graphicLayer)
    })
  }
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    let val = $("#hasEdit").is(":checked")
    if (val) {
      showEditor(e)
    }
  })
  //Modified vector data
  graphicLayer.on(
    [
      mars3d.EventType.editStart,
      mars3d.EventType.editStyle,
      mars3d.EventType.editAddPoint,
      mars3d.EventType.editMovePoint,
      mars3d.EventType.editRemovePoint
    ],
    function (e) {
      showEditor(e)
    }
  )

  // Stop editing
  graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    setTimeout(() => {
      if (!graphicLayer.isEditing) {
        stopEditing()
      }
    }, 100)
  })
}

//Additional: activate attribute editing widget [not required, you can comment the internal code of this method]
let timeTik

function showEditor(e) {
  const graphic = e.graphic
  clearTimeout(timeTik)

  if (!graphic._conventStyleJson) {
    graphic.options.style = graphic.toJSON().style //Because the style in the example may have complex objects, it needs to be converted into a single json simple object
    graphic._conventStyleJson = true //Only process once
  }

  let plotAttr = es5widget.getClass("widgets/plotAttr/widget.js")
  if (plotAttr && plotAttr.isActivate) {
    plotAttr.startEditing(graphic, graphic.coordinates)
  } else {
    // When there is no pop-up modification panel on the left, pop up the widget
    $("#infoview-left").length === 0 &&
      es5widget.activate({
        map: map,
        uri: "widgets/plotAttr/widget.js",
        name: "Property Edit",
        graphic: graphic,
        lonlats: graphic.coordinates
      })
  }
}

function stopEditing() {
  timeTik = setTimeout(function () {
    if (es5widget) {
      es5widget.disable("widgets/plotAttr/widget.js")
    }
  }, 200)
}
//Additional: activate attribute editing widget [not required, you can comment the internal code of this method]

// ***************************** Datasheets***************** ****** //

let tableEventTarget = new mars3d.BaseClass()

function tableInit(data) {
  $("#graphicTable").bootstrapTable({
    data: data,
    pagination: true,
    pageList: [3, 5, 10],
    singleSelect: false,
    checkboxHeader: false,
    columns: [
      {
        title: "Whether to display",
        field: "show",
        align: "center",
        checkbox: true,
        width: 50,
        formatter: function (value, row, index) {
          return {
            checked: true
          }
        }
      },
      {
        field: "name",
        title: "name"
      },
      {
        title: "Operation",
        align: "center",
        width: 80,
        events: {
          "click .remove": function (e, value, row, index) {
            const graphic = graphicLayer.getGraphicById(row.id)
            graphicLayer.removeGraphic(graphic)
            if ($("#infoview-left").length > 0) {
              $("#infoview-left").hide()
            }
          },
          "click .edit": function (e, value, row, index) {
            const graphic = graphicLayer.getGraphicById(row.id)
            // const graphic = getGraphic(row.id)
            // Vector data cannot be in editing state, otherwise the point light source example will lose light when you click to edit.
            // graphic.hasEdit && graphic.startEditing()
            if ($("#infoview-left").length > 0) {
              $("#infoview-left").show()
            } else {
              showEditor({ graphic })
            }
          }
        },
        formatter: function (value, row, index) {
          return [
            '<a class="edit" href="javascript:void(0)" title="编辑"><i class="fa fa-edit"></i></a>&nbsp;&nbsp;',
            '<a class="remove" href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>'
          ].join("")
        }
      }
    ],
    //Locate area
    onClickRow: function (row) {
      flyToTableItem(row.id)
    },
    //Check display
    onCheck: function (row) {
      onSelectTableItem(row.id, true)
    },
    //Uncheck display
    onUncheck: function (row) {
      onSelectTableItem(row.id, false)
    }
  })
}

//Update table data
function refreshTabel(layer) {
  const newData = getDataByLayer(layer)
  $("#graphicTable").bootstrapTable("load", newData)
}

//Delete the specified item in the table
function removeTableItem(id) {
  $("#graphicTable").bootstrapTable("remove", { field: "id", values: id })
}

// tableEventTarget.on("graphicList", function (event) {
// tableInit(event.graphicList)
// })
// tableEventTarget.on("removeGraphic", function (event) {
//   removeTableItem(event.graphicId)
// })

function flyToTableItem(id) {
  const graphic = graphicLayer.getGraphicById(id)
  if (graphic) {
    graphic.flyTo()
  }
}

function onSelectTableItem(id, selected) {
  const graphic = graphicLayer.getGraphicById(id)
  if (!graphic) {
    return
  }
  if (selected) {
    graphic.show = true
    graphic.flyTo()
  } else {
    graphic.show = false
  }
}

// Get layer data, fill in table data, and monitor layer operations at the same time
function getTableData(graphicLayer) {
  graphicLayer.on(mars3d.EventType.removeGraphic, function (event) {
    const graphicId = event.graphic.id
    removeTableItem(graphicId)
  })

  //Plot trigger events on the graph
  graphicLayer.on(mars3d.EventType.drawCreated, function (event) {
    refreshTabel(graphicLayer)
  })

  const graphicList = getDataByLayer(graphicLayer)
  tableInit(graphicList)
}

function getItemName(graphic) {
  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`
  }
  if (graphic.attr.index) {
    return `${graphic.type} - ${graphic.attr.index}`
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`
  }
  if (graphic?.style?.label?.text && graphic.style.label.text !== "0") {
    return `${graphic.type} - ${graphic.style.label.text}`
  }

  return `${graphic.type} - ${graphic.name || "Unnamed"}`
}

//Convert the data in the layer to the data in the table
function getDataByLayer(graphicLayer) {
  const graphics = graphicLayer.getGraphics()

  let graphicList = []

  graphics.forEach((graphic) => {
    const itemObj = {
      id: graphic.id,
      name: getItemName(graphic),
      type: graphic.type,
      show: true
    }
    graphicList.push(itemObj)
  })

  return graphicList
}