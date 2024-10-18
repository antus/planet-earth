
let layerDataWidget = null;
let selectedLayerData = null;

var SIZE_LD=10;
var columns = [];

function initTableDataPanel(_widget) {
    layerDataWidget = _widget;
}

function loadLayerData(layer) {
    // Set Panel name
    $("#layer-name").text(layer.options.name);
    selectedLayerData = layer;
    columns = [];

    // Read layer description
    describeFeatureType();
}


// Read layer description
function describeFeatureType() {
    const layer = selectedLayerData;
    var xhr = $.ajax({
        type: "GET",
        url: layer.options.url.replace("wms", "wfs") + 
            "?service=wfs&version=1.1.0" + 
            "&request=DescribeFeatureType" +
            "&typeName=" + layer.options.layers +
            "&outputFormat=application/json",
        success: function (data) {
            console.log("DescribeFeatureType of " +  + layer.layers + " result: " + data);
            columns = [];
            for (let i = 0; i < data.featureTypes[0].properties.length; i++) {
                if (!data.featureTypes[0].properties[i].type.startsWith("gml:")) {
                    const name = data.featureTypes[0].properties[i].name;
                    columns.push({
                        name: name, 
                        type: "text", 
                        width: 150, 
                        validate: "required", 
                        headercss: "header", 
                        filtercss: "filter" 
                    });
                }
            }
            $("#jsGrid").jsGrid("destroy");
			$("#jsGrid").jsGrid({
				width: "100%",
				height: "100%",
		 
				filtering: true,
				inserting: false,
				editing: false,
				sorting: true,
				paging: true,
				pageLoading:true,
				autoload: true,
                pageIndex: 1,
				pageSize: SIZE_LD,
				pageButtonCount: 5,
				deleteConfirm: "Do you really want to delete client?",
	 
                rowClick: function (row) {
                    console.log(row);
                    layerDataWidget.geoJsonLayer.clear()
                    layerDataWidget.geoJsonLayer.load({ data: row.item.geojson , flyTo: true});
                },
		        controller: {
					loadData: function(filter) {
						console.log(filter);
                        // filters
                        var cql_filter="";
                        for (var i=0; i< columns.length;i++) {
                            if (filter[columns[i].name]!="") {
                                var f = columns[i].name + " ilike '%25" + filter[columns[i].name] + "%25'";
                                if (cql_filter=="")
                                    cql_filter = f;
                                else 
                                    cql_filter += " AND " + f;
                            }
                        }
                        // sort
                        var sort = "";
                        if (filter.sortField && filter.sortField!="") {
                            sort = filter.sortField;
                            if (filter.sortOrder=="asc")
                                sort += "+A";
                            else
                                sort += "+D";
                        }
                        var url = layer.options.url.replace("wms", "wfs") + 
                        "?service=wfs" + 
                        "&version=2.0.0" +
                        "&request=GetFeature" +
                        "&typeNames=" + layer.options.layers +
                        "&outputFormat=application/json" +
                        "&count=" + SIZE_LD +"&startIndex=" + (SIZE_LD * (filter.pageIndex-1)) + 
                        "&sortBy=" + sort + 
                        "&CQL_FILTER=" + cql_filter;

						return fetch(url)
                        .then((res) => res.json())
                        .then((featureCollection) => {
                            var data = [];
                            for (var i=0; i<featureCollection.features.length; i++) {
                                var properties = featureCollection.features[i].properties;
                                // add geojson
                                properties.geojson= featureCollection.features[i];
                                data.push(featureCollection.features[i].properties);
                            }
                            $("#layer-totals").text(featureCollection.totalFeatures);
                          return {data:data, itemsCount: featureCollection.totalFeatures };
                        });
					}
				},
				
				fields: columns
			});
            layerDataWidget.setViewShow(true);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            toastr.error("Load " + layer.options.layers + " data error!");
            layerDataWidget.setViewShow(false);
        },
    });
}



