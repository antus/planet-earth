"use script"; // It is recommended to enable strict mode in the development environment

// Corresponding to the object instantiated by MyWidget in widget.js
var thisWidget;
var url = "http://localhost:8080/geoserver/wms";
let tileLayer;
var map;

//Current page business
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget;
  map = thisWidget.map;

  let layers = [];
  $.ajax({
    type: "get",
    dataType: "xml",
    url: url + "?service=WMS&version=1.3.0&request=GetCapabilities",
    timeout: 5000,
    success: function (text, textStatus, request) {
      var arr = [];
      //allow jQuery to handle the elements like HTML
      var xml = $(text);
      //find <document> and get its name attribute
      var featureTypes = xml.find('Layer Layer');
      for (var i = 0; i < featureTypes.length; i++) {
        const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
        const title = featureTypes[i].getElementsByTagName('Title')[0].innerHTML;
        const abstract = featureTypes[i].getElementsByTagName('Abstract')[0].innerHTML;
        arr.push({"name": name,"title": title,"abstract": abstract});
      }
      console.log(arr);
      showTable(arr);

    },
    error: function (request, textStatus) {
      toastr.warning("Service access error!");
    }
  });
  
}

function showTable(data) {
  const height = $(".container").height();
  $("#layers_table").bootstrapTable({
    data: data,
    pagination: false,
    singleSelect: true,
    height: height,    
    columns: [
      {
        title: "Name",
        field: "title",
        align: "left",
        sortable: true,
        events: {
          "click .add": function (e, value, row, index) {
            addTileLayer(row)
          },
        },
        formatter: function (value, row, index) {
          return `<div title="${row.name}">
                      <table class="dataTable">
                        <tbody>
                          <tr>
                            <td>
                              <div>
                                <span class="processId text-truncate" style="max-width: 200px;">${row.title}</span>
                                <span>${row.abstract}</span>
                              </div>
                            </td>
                            <td style="padding-left:12px !important; width:37px;vertical-align:middle">
                              <a class="add" href="javascript:void(0)" title="Add layer to map"><i class="fa fa-plus"></i></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>`;
        }
      }
    ]
  })
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

function addTileLayer(layer) {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.WmsLayer({
    url: url,
    name: layer.title,
    layers: layer.name,
    crs: "EPSG:4326",
    clampToTileset: true,
    parameters: {
      transparent: true,
      format: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10
    },
    highlight: {
      type: "wallP",
      diffHeight: 100,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#ffff00",
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      }
    },
    zIndex: 2,
    popup: "all",
    // popupOptions: {
    //   autoClose: false,
    //   closeOnClick: false,
    //   checkData: function (attr, graphic) {
    //     if (Cesium.defined(attr.OBJECTID)) {
    //       return graphic.attr.OBJECTID === attr.OBJECTID
    //     }
    //     if (Cesium.defined(attr.NAME)) {
    //       return graphic.attr.NAME === attr.NAME
    //     }
    //     return false
    //   }
    // },
    flyTo: true
  })
  map.addLayer(tileLayer)

  // 单击事件
  tileLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("加载了GetCapabilities", event)
  })

  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了矢量数据，共" + event.features.length + "条", event)
  })

}





