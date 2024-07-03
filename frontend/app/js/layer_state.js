/* eslint-disable no-undef */
"use script" //It is recommended to turn on strict mode in the development environment

//Layer display and hiding
function isShowLayer(layer, val) {
  // const layer = getManagerLayer()
  layer.show = val
}

// Bind popup
// function bindPopup(layer, enabledPopup) {
// // const layer = getManagerLayer()
//   if (enabledPopup) {
//     bindLayerPopup(layer)
//   } else {
//     layer.unbindPopup()
//   }
// }

function bindTooltip(layer, enabledTooltip) {
  // const layer = getManagerLayer()
  if (enabledTooltip) {
    layer.bindTooltip(
      (event) => {
        const attr = getAttrForEvent(event)
        attr["type"] = event.graphic?.type
        attr["source"] = "I am the Toolip bound to the layer"
        attr["Remarks"] = "I support mouse movement interaction"

        return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr: attr })
      },
      { pointerEvents: true }
    )
  } else {
    layer.unbindTooltip()
  }
}

function bindRightMenu(layer, enabledRightMenu) {
  // const layer = getManagerLayer()
  if (enabledRightMenu) {
    bindLayerContextMenu(layery)
  } else {
    layer.unbindContextMenu(true)
  }
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  // const graphicLayer = getManagerLayer()
  graphicLayer.bindPopup(
    (event) => {
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

//Bind right-click menu
function bindLayerContextMenu() {
  // const graphicLayer = getManagerLayer()

  graphicLayer.bindContextMenu([
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
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        graphicLayer.removeGraphic(graphic)
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
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("The length of this object is:" + strDis)
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
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("The perimeter of the object is:" + strDis)
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
      callback: function (e) {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        $alert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}

function drawFile() {
  let file = this.files[0]

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
          // symbol: function (attr, style, featue) {
          //   let geoType = featue.geometry?.type
          //   if (geoType == 'Point') {
          //     return {
          //       image: 'img/marker/di3.png',
          //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          //       scale: 0.4,
          //       label: {
          //         text: attr.name,
          //         font_size: 18,
          // color: '#ffffff',
          //         outline: true,
          //         outlineColor: '#000000',
          // pixelOffsetY: -50,
          //         scaleByDistance: true,
          //         scaleByDistance_far: 990000,
          //         scaleByDistance_farValue: 0.3,
          //         scaleByDistance_near: 10000,
          //         scaleByDistance_nearValue: 1,
          //       },
          //     }
          //   }
          //   return style
          // },
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

//You can also perform personalized management and binding operations on a single Graphic
function initGraphicManager(graphic) {
  //3. Bind listening events to the graphic
  // graphic.on(mars3d.EventType.click, function(event) {
  // console.log('Listen to graphic, click on vector object', event)
  // })
  // graphic.on(mars3d.EventType.mouseOver, function(event) {
  // console.log('Listening to graphic, the mouse moved into the vector object', event)
  // })
  // graphic.on(mars3d.EventType.mouseOut, function(event) {
  // console.log('Listening to graphic, the mouse moved out of the vector object', event)
  // })

  //Bind Tooltip
  // graphic.bindTooltip('I am the Tooltip bound to graphic') //.openTooltip()

  //Bind Popup

  let inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">I am a Popup bound to the graphic </th>
            </tr>
            <tr>
              <td>Tips:</td>
              <td>This is just test information, you can use any html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  //Bind right-click menu
  graphic.bindContextMenu([
    {
      text: "Delete object [graphic-bound]",
      icon: "fa fa-trash-o",
      callback: function (e) {
        let graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  //Test color flash
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, //flash duration (seconds)
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        //Callback after completion
      }
    })
  }
}

//******************************Properties panel****************** ****** //
// Bind event and activate the property panel
function bindAttributePannel() {
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