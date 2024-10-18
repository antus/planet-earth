"use script"; // It is recommended to enable strict mode in the development environment

// Corresponding to the object instantiated by MyWidget in widget.js
var thisWidget;
var $illegal_building_table;
var drawGraphic;
var result;
var page=0;
var pages=0;
var total=0;
var polling;
const SIZE=10;
var needToZoom = true;
var deleteClick=false;


//Current page business
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget;
  
  //Initialize Select2 Elements
  $('.select2').select2()

  //Date range picker
  $('#reservation').daterangepicker()

  // Result table
  $illegal_building_table = $("#illegal_building_table");
  $illegal_building_table.bootstrapTable({
    singleSelect: true, //单选
    pagination: false,
    pageSize: 6,
    iconsPrefix: "fa",
    showHeader: false,
    columns: [
      {
        title: "",
        sortable: true,
        editable: false,
        align: "center",
        events: {
          "click .remove": function (e, value, row, index) {
            deleteProcess(row.id);
          },
        },
        formatter: function (value, row, index) {
          return `<div style="border-bottom:1px solid white;" class="" title="${row.projectName}">
                      <!--img src="${row.icon}" style="width:100%;" /-->
                      <table class="dataTable">
                        <tbody>
                          <tr>
                            <td>
                              <span class="processId">${row.id}</span>
                              <!--span style="float:right">${row.author}</span-->
                            </td>
                            <td rowspan="2" style="padding-left:12px !important; width:37px;vertical-align:middle">
                              <a class="remove" href="javascript:void(0)" title="Delete"><i class="fa fa-trash"></i></a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span>${row.projectName}</span>
                              <span class="btn btn-sm label-loading label-${row.status}" style="float:right">${row.status}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>`;
        },
      },
    ],
    onClickRow: function (item, $element, field) {
      if (!deleteClick) {
        for (const graphic of thisWidget.graphicLayer.graphics) {
          if (graphic.attr.id == item.id) {
            graphic.flyTo({
              radius: 1000, //点数据：radius控制视距距离
              scale: 1.5, //线面数据：scale控制边界的放大比例
              duration: 0.5,
              complete: () => {
                graphic.openPopup();
              },
            });
            break;
          }
        }
      }
    }
  });

  // landslides
  $("#landslides-button").click(function() {
    $("#geo-processessing-tools").hide();
    $("#illegal_building_detail").show();
  });

  // search keyup
  $("#illegal_building_search").keyup(function() {
    loadIllegalBuildingData();
  });

  // draw rectangle click
  $("#drawRectangle_illegalBuilding").click(function () {
    drawRectangle();
  });

  // project name keyup
  $("#illegal_building_processname").keyup(function() {
    inputDataChange();
  });

  // Load illegal building process data
  loadIllegalBuildingData();

  startPolling();
    
}

function zoomToLayer() {
  if (needToZoom) {
    thisWidget.graphicLayer.flyTo(
      {
        radius: 1000, //点数据：radius控制视距距离
        scale: 1.5, //线面数据：scale控制边界的放大比例
        duration: 0.5
      }
    );
    needToZoom = false;
  }
}

// draw rectangle area
function drawRectangle() {
  clearDrawingArea();
  inputDataChange();
  thisWidget.map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      fill: true,
      color: "#00FF00",
      opacity: 0.1,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      clampToGround: true,
    },
    success: function (graphic) {
      drawGraphic = graphic;
      console.log("Rectangle: ", drawGraphic.toJSON({ outline: true }));
      inputDataChange();
    },
  });
}

// start polling illegal building processes
function startPolling() {
  /*
  polling = setInterval(() => {
    loadIllegalBuildingData();
  }, 5000);
  */
}

// stop polling illegal building processes
function stopPolling() {
  clearInterval(polling);
}



function  openGeoProcessingTools() {
  $("#illegal_building").hide();
  $("#geo-processessing-tools").show();
}

function  closeGeoProcessingTools() {
  $("#illegal_building").show();
  $("#geo-processessing-tools").hide();
}

// open detail panel
function openDetail() {
  stopPolling();
  $("#illegal_building_processname").val("");
  $("#illegal_building").hide();
  $("#illegal_building_detail").show();
  $("#save_button").hide();
}

// close detail panel
function closeDetail() {
  clearAll(); 
  $("#illegal_building_detail").hide();
  loadIllegalBuildingData();
  $("#geo-processessing-tools").show();
  startPolling();
}


// close detail panel
function closeLandslides() {
  $("#illegal_building").hide();
  $("#geo-processes").show();

}


// check if the data form is complete
function inputDataChange() {
  if ($("#illegal_building_processname").val() != "" && drawGraphic!=undefined && drawGraphic.toGeoJSON({ outline: true })!=null) {
    $("#save_button").show();
  } else 
    $("#save_button").hide();
}

// get all
function loadIllegalBuildingData() {
  const query = $("#illegal_building_search").val();
  var querystring = "";
  if (query!=null && query!="") {
    querystring = "query=" + query + "&";
  }
  $.ajax({
    type: "get",
    dataType: "json",
    url: `${location.origin}` + "/services/illegalbuilding/api/illegal-building-processes?" + querystring + "page=" + this.page +"&size=" + SIZE + "&sort=id,desc",
    timeout: 3000,
    success: function (data, textStatus, request) {
      if (data.length == 0) {
        // haoutil.msg("No records found!");
        page=0;
        pages=0;
        total=0;
      } else {
        total = request.getResponseHeader('X-Total-Count');
        //haoutil.msg("Totally queried " + total + " records！");
        pages = Math.ceil(total/SIZE);
        
      }

      // check if the wms layer needs to reload
      var needToReloadWMS = false;
      for (const item of data) {
        for (const graphic of thisWidget.graphicLayer.graphics) {
          if (graphic.attr.id == item.id && graphic.attr.status != item.status) {
            needToReloadWMS = true;
            break;
        }
        if (needToReloadWMS)
          break;
      }
      // check if there is a selected item to refresh
      var needToRefreshSelectedItem = false;
      if (thisWidget.getSelectedGraphic()!=null) {
        var isPresent = false;
        // check if present
        for (const item of data) {
          if (item.id == thisWidget.getSelectedGraphic().attr.id)
            if (item.status!=thisWidget.getSelectedGraphic().attr.status ) {
              needToRefreshSelectedItem = true;
            }
            isPresent = true;
            break;
          }
        }
        if (!isPresent)
          thisWidget.setSelectedGraphic(null); 
      }

      // mark the object (reset name value)
      for (const graphic of thisWidget.graphicLayer.graphics) 
        graphic.name= "";
      // update attribute of present data  
      for (const item of data) {
        item.creation = moment(item.creation).format('YYYY/MM/DD, hh:mm:ss');
        var found = false;
        for (const graphic of thisWidget.graphicLayer.graphics) {
          if (graphic.attr.id == item.id) {
            found = true;
            if (graphic.attr.status != item.status)
              graphic.setStyle(thisWidget.getStyle(item.status));
            graphic.attr = item;
            graphic.name = "updated";
            break;
          }
        } 
        if (!found) {
          thisWidget.addPolygon(item);
        }
      }
      // Find the object to remove
      var objectsToRemove = [];
      for (const graphic of thisWidget.graphicLayer.graphics) {
        if (graphic.name == "") 
          objectsToRemove.push(graphic);
      }
      // Remove objects no more present
      for (const graphic of objectsToRemove) 
        thisWidget.graphicLayer.removeGraphic(graphic);
            
      // Refresh selected item
      if (needToRefreshSelectedItem) {
        for (const graphic of thisWidget.graphicLayer.graphics) {
          if (graphic.attr.id == thisWidget.getSelectedGraphic().attr.id) {
            graphic.closePopup();
            graphic.openPopup();
            break;
          }
        }
      }

      // Reload WMS layer
      if (needToReloadWMS){
        thisWidget.refreshBuildingsLayer();
      }
      

      $illegal_building_table.bootstrapTable("load", data);
      refreshResult();

      // zoom to layer
      // zoomToLayer();
    },
    error: function (request, textStatus) {
      //toastr.warning("Service access error!");
      total=0;
      page=0;
      pages=0;
      refreshResult();
    }
  });
  
}

// save
function save() {
  $("#save_button").hide();
  var data = 
  {
    "projectName": $("#illegal_building_processname").val(),
    "geom": drawGraphic.toGeoJSON().geometry,
    "source": $("#source-select").val()
  };
  $.ajax({
    data: JSON.stringify(data),
    type: "post",
    dataType: "json",
    contentType: "application/json",
    url: `${location.origin}` + "/services/illegalbuilding/api/illegal-building-processes",
    timeout: 3000,
    success: function (data) {
      haoutil.msg("Record with id " + data.id + " created!");
      $("#save_button").show();
      closeDetail();
    },
    error: function (request, textStatus) {
      toastr.warning("Service access error!");
      $("#save_button").show();
      closeDetail();
    }
  });
}

// delete
function deleteProcess(id) {
  deleteClick=true;
  $.ajax({
    type: "delete",
    dataType: "json",
    contentType: "application/json",
    url: `${location.origin}` + "/services/illegalbuilding/api/illegal-building-processes/" + id,
    timeout: 3000,
    success: function (data) {
      deleteClick=false;
      haoutil.msg("Record " + id + " deleted!");
      loadIllegalBuildingData();
      thisWidget.refreshBuildingsLayer();
    },
    error: function (request, textStatus) {
      deleteClick=false;
      toastr.warning("Service access: " + textStatus);
    }
  });
}

// refresh the result of the request on the table foter
function refreshResult() {
  $("#lbl-allCount").text(total);
  $("#lbl-pageIndex").text(page+1);
  $("#lbl-allPage").text(pages);
}
// first page
function showFirstPage() {
  page=0;
  needToZoom = true;
  loadIllegalBuildingData();
}
// previous page
function showPretPage() {
  page = page==0?0:page-1;
  needToZoom = true;
  loadIllegalBuildingData();
}
// next page
function showNextPage() {
  page = page==pages-1?pages-1:page+1;
  needToZoom = true;
  loadIllegalBuildingData();
}
// last page
function showLastPage() {
  page=pages-1;
  needToZoom = true;
  loadIllegalBuildingData();
}

// clear all data
function clearAll(noClearDraw) {
  $("#resultView").hide();
  clearDrawingArea();
  thisWidget.graphicLayer.clear();
}

// clear drawing area
function clearDrawingArea() {
  if (drawGraphic!=null) {
    thisWidget.map.graphicLayer.removeGraphic(drawGraphic);
    drawGraphic = null;
  }
} 






