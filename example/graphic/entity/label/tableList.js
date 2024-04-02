function tabInit(data) {
  $("#graphicTable").bootstrapTable({
    data: data,
    pagination: false,
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
          },
          "click .edit": function (e, value, row, index) {
            const graphic = graphicLayer.getGraphicById(row.id)
            showEditor(graphic)
          }
        },
        formatter: function (value, row, index) {
          return [
            '<a class="edit" href="javascript:void(0)" title="Edit"><i class="fa fa-edit"></i></a> ',
            '<a class="remove" href="javascript:void(0)" title="Delete"><i class="fa fa-trash"></i></a>'
          ].join("")
        }
      }
    ],
    //Locate area
    onClickRow: function (row) {
      flyToModel(row.id)
    },
    //Check display
    onCheck: function (row) {
      onSelect(row.id, true)
    },
    //Uncheck display
    onUncheck: function (row) {
      onSelect(row.id, false)
    }
  })
}

//Delete the specified item in the table
function removeTableItem(id) {
  $("#graphicTable").bootstrapTable("remove", { field: "id", values: id })
}

function showEditor(graphic) {
  if (!graphic._conventStyleJson) {
    graphic.options.style = graphic.toJSON().style //Because the style in the example may have complex objects, it needs to be converted into a single json simple object
    graphic._conventStyleJson = true //Only process once
  }

  let plotAttr = es5widget.getClass("widgets/plotAttr/widget.js")
  if (plotAttr && plotAttr.isActivate) {
    plotAttr.startEditing(graphic, graphic.coordinates)
  } else {
    es5widget.activate({
      map: map,
      uri: "widgets/plotAttr/widget.js",
      name: "Property Edit",
      graphic: graphic,
      lonlats: graphic.coordinates
    })
  }
}

eventTarget.on("graphicList", function (event) {
  tabInit(event.graphicList)
})
eventTarget.on("removeGraphic", function (event) {
  removeTableItem(event.graphicId)
})

function flyToModel(id) {
  const graphic = graphicLayer.getGraphicById(id)
  if (graphic) {
    graphic.flyTo()
  }
}

function onSelect(id, selected) {
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
    eventTarget.fire("removeGraphic", { graphicId })
  })

  const graphics = graphicLayer.getGraphics()

  graphics.forEach((graphic) => {
    const itemObj = {
      id: graphic.id,
      name: getItemName(graphic),
      type: graphic.type,
      show: true
    }
    graphicList.push(itemObj)
  })
  eventTarget.fire("graphicList", { graphicList })
}

let graphicIndex = 0
function getItemName(graphic) {
  if (graphic?.style?.label?.text) {
    return `${graphic.type} - ${graphic.style.label.text}`
  }

  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`
  }

  graphic.name = `Unnamed${++graphicIndex}`
  return `${graphic.type} - ${graphic.name}`
}
