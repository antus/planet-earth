let selectedElement = null;
let prevChange = null;
let panel_widget = null;
const listId = "nestedDemo";
const toolbarId = "toolbar";
let tileLayer;
let layersObj = {};
let catalogs = [];
let selectedCatalog = null;
let layersTable = null;

function initPanel(_widget) {
    panel_widget = _widget;

    $( "#"+ listId ).empty();
    $("#catatalog-sel").empty();
    layersObj = {};
    catalogs = {};
    selectedElement = null;
    selectedCatalog = null;

    loadLayers();
    initNestedList();
    initCatalogs();

    /*
    const resizeObserver = new ResizeObserver((entries) => {
        //entries.forEach(console.log);
        console.log(entries[0].borderBoxSize[0].blockSize);
      })
    resizeObserver.observe(document.getElementById("test"));
    */
}

function initCatalogs() {
    var select = $("#catatalog-sel");
    if (panel_widget.catalogs) {
        for (var i=0; i< panel_widget.catalogs.length; i++) {
            catalogs[i] = {id: i, name: panel_widget.catalogs[i].name, url: panel_widget.catalogs[i].url};
            var el = '<option value="catalog-' + i + '" >' + panel_widget.catalogs[i].name + '</option>';
            var service = $($.parseHTML(el));		
            $(select).append(service);
        }
        if (panel_widget.catalogs.length>0)
            selectedCatalog = catalogs[0];
    }

}

function connect(sel)
{
    const cataogId = sel.value.substring(8);
    selectedCatalog = catalogs[cataogId];
    console.log(selectedCatalog);
    loadCatalogLayers();
}

function loadLayers() {
    let nodes = [];
    const layers = getLayers();
    // build hierarchical object
    for (let i = layers.length - 1; i >= 0; i--) {
        let node = getNodeConfig(layers[i]);
        nodes.push(node);
    }
    // create hierarchical object
    const nestedData = buildTree(nodes);
    // create tree list
    nestedData.items.forEach(function (arrayItem) {
        iterate(arrayItem);
    });
    initNestedList();
	listChanged();
}

function getNodeConfig(layer) {
    if (layer == null || !layer.options || layer.isPrivate || layer.parent) {
        return
    }
    let item = layer.options

    if (!item.name || item.name == "Unnamed") {
    console.log("Unnamed layers are not added to layer management", layer)
    return
    }

    let node = {
        id: layer.id,
        name: layer.name,
        checked: layer.isAdded && layer.show
    }

    if (layer.pid!=-1) {
        node.parentId = layer.pid;
    }

    if (layer.hasEmptyGroup) {
        //empty array
        node.icon = "img/folder.png"
        node.open = item.open == null ? true : item.open
        node.type = "folder";
    } else if (layer.hasChildLayer) {
        //Array with child nodes
        node.icon = "img/layerGroup.png"
        node.open = item.open == null ? true : item.open
        node.type = "layer group";
    } else {
        node.icon = "img/layer.png"
        if (layer.parent) {
            node._parentId = layer.parent.id
        }
        node.type = layer.options.type;
    }

    // save layer in the layerObj
    layersObj[node.id] = layer

    return node;
}

function buildTree(layers) {
    const buildTree = (parentId) => (item) => {
        const children = layers.filter((child) => child.parentId === item.id);
        return {
            ...item,
            ...(children.length > 0 && { children: children.map(buildTree(item.id)) }),
        };
    };
    
    const nestedData = {
        items: layers.filter((item) => !item.parentId).map(buildTree(undefined)),
    };
    
    //console.log(nestedData);
    return nestedData;
}

function iterate(node) {
    // create element
    if (node.type=="folder" || node.type=="layer group") {
        // Add folder
        addFolder(node);
    } else {
        // Add Layer
        addLayer(node);
    }
    if (node.children) {
        for (let child of node.children) {
        iterate(child);
        }
    }
  }

function getLayers() {
    return panel_widget.map.getLayers({
      basemaps: false, //Whether to take the basempas in config.json, because it is controlled by the basemap, it can be changed to false as needed in specific projects
      layers: true //Whether to take the layers in config.json
    })
}

// Initialize list
function initNestedList() {
	var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));
	// Loop through each nested sortable element
	for (var i = 0; i < nestedSortables.length; i++) {
		var list = new Sortable(nestedSortables[i], {
			group: 'nested',
			//handle: '.glyphicon-move',
			animation: 300,
			fallbackOnBody: true,
			swapThreshold: 0.65,
			// Called by any change to the list (add / update / remove)
			onSort: function (/**Event*/evt) {
				// same properties as onEnd
				notifyChange(evt);
			}
		});
	}

    $(".element-range").each(function( index ) {
        const elId = this.id.substring(3, this.id.length-8);
        const id = $( this ).slider({ id: "slider-" + elId , min: 0, max: 100, step: 1, value: (layersObj[elId].opacity || 1) * 100 })
        .on("change", (e) => {
          let opacity = e.value.newValue / 100
          let layer = layersObj[elId]
          layer.opacity = opacity
        })
    });

    

}

// Update node
function updateNode(layer) {
    const layers = getLayers();

    if (layersObj[layer.id]) {
        // layer already exists
        let show = layer.isAdded && layer.show;
        const element = $("#el-" + layer.id + "-check");
        var checked = false;
        if (show) {
            element.removeClass("fa-square");
            element.addClass("fa-check-square");
        } else {
            element.removeClass("fa-check-square");
            element.addClass("fa-square");
        }
    } else {
        // add new layer
        let node = getNodeConfig(layer);

        // if layer has name
        if (node) {
            layersObj[node.id] = layer;

            addLayer(node);
            initNestedList();
            listChanged();
        }
    }    
}


function removeNode(layer) {
    $('#el-' + layer.id).remove();
    selectedElement=null;
    $("#removeLayerBtn").prop('disabled', true);
    delete layersObj[" + layer.id + "];
	listChanged();
}

// Add new layer
function addNewLayer() {
    $("#"+ listId).hide();		
    $("#"+ toolbarId).hide();
    $("#catalogPanel").show();

    loadCatalogLayers();
    

}

function loadCatalogLayers() {
    if (selectedCatalog) {
        // load catalog layers
        const url= selectedCatalog.url;
        let layers = [];
        $.ajax({
        type: "get",
        dataType: "xml",
        url: url + "?request=GetCapabilities",
        timeout: 5000,
        success: function (text, textStatus, request) {
            var xml;
            if (window.DOMParser) {
            var parser = new DOMParser();
            xml = parser.parseFromString(text,"text/xml");
            } else { // Internet Explorer
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(text); 
            }
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
}

function showTable(data) {
    // set layers table 
    layersTable = $("#layers_table"); 
    const height = $(".catalog-layers-container").height()-40;
    layersTable.bootstrapTable({
        pagination: false,
        singleSelect: true,
        height: height,    
        columns: [
          {
            title: "Layer",
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
    layersTable.bootstrapTable("load", data);
}
  

function addTileLayer(layer) {
    const url= selectedCatalog.url;
    // Create layer  
    tileLayer = new mars3d.layer.WmsLayer({
      url: url,
      name: layer.title,
      layers: layer.name,
      type: "wms",
      parameters: {
        transparent: true,
        format: "image/png"
      },
      getFeatureInfoParameters: {
        feature_count: 10
      },
      popup: "all",
      
      flyTo: true
    });

    // Set parent id
    if (selectedElement) {
        tileLayer.pid = selectedElement;
    }
    // add to map
    map.addLayer(tileLayer);
}


// Add Layer
function addLayer(node) {
	//console.log("Add Layer " + node.id);
	var el = 	'<div id="el-' + node.id + '" class="list-group-item" >' +
					'<div id="el-' + node.id + '-panel" class="panel-element m-left-10" onclick="selectElement(\'el-' + node.id + '\')">' +	
                        '<span class="flex-container-1">' + 
                            '<span class="element-control-buttons">' +	
                                '<i id="el-' + node.id + '-check" class="element-check far ' + (node.checked?"fa-check-square":"fa-square")+ ' p-right-10" onclick="checkElement(\'el-' + node.id + '\')"></i>' +
                                '<i class="fas fa-layer-group"></i>' +
                            '</span>' +
                            '<span class="element-info">' +
                                    '<span class="element-text d-inline-block text-truncate">' + node.name + '</span>' +
                                    '<span class="element-type">' + node.type + '</span>' +
                                    '<input class="element-range" id="el-' + node.id + '-opacity">' +
                            '</span>' +
                        '</span>' +
                        '<span class="flex-container-2">' +
                            '<span onclick="zoomToLayer(\'el-' + node.id + '\')" title="extent"><i class="p-right-icon fas fa-expand"></i></span>' +
                            '<span onclick="layerDetail(\'' + node.id + '\')" title="details"><i class="p-right-icon fas fa-list"></i></span>' +
                        '</span>' +	
                    '</div>' +
				'</div>';
	
	var dom_nodes = $($.parseHTML(el));		
	if (node.parentId) {
        if ($("#el-" + node.parentId + "-detail").length>0)
		    $("#el-" + node.parentId + "-detail").last().append(dom_nodes);
        else
            $("#el-" + node.parentId ).after( dom_nodes );
	} else
		$( "#"+ listId ).append( dom_nodes );
}

// Add new folder
function addNewFolder() {
    let index = 1;
    while (layersObj[index]) {
        index++;
    }
    let node = {
        id: index,
        name: 'New folder' + index,
        checked: false,
        icon: "img/layerGroup.png",
        open: true,
        type: "folder"
    }
    if (selectedElement) {
        node.parentId = selectedElement;
    }

    // TODO: replace the following line with the real new layer 
    layersObj[index] = new mars3d.layer.GroupLayer({
        id: node.id,
        name: node.name,
        pid: node.parentId?node.parentId:-1,
        });

    addFolder(node);
    initNestedList();
	listChanged();
}

// Add Folder
function addFolder(node) {
	//console.log("Add Folder " +node.id);
	var el = 	'<div id="el-' + node.id + '" class="list-group-item">' +
					'<div id="el-' + node.id + '-panel" class="panel-element" onclick="selectElement(\'el-' + node.id + '\')">' +	
					    '<span class="flex-container-1">' +
                            '<span class="element-control-buttons">' +	
                                '<i id="el-' + node.id + '-check" class="element-check far fa-square p-right-10" onclick="checkElement(\'el-' + node.id + '\')"></i>' +
                                '<i class="fas fa-folder"></i>' +
                            '</span>' +
                            '<span class="element-info">' +
                                '<span class="element-text d-inline-block text-truncate">' + node.name + '</span>' +
                                '<span class="element-type">' + node.type + '</span>' +
                            '</span>' +
                        '</span>' +
                            '<span class="flex-container-2">' +
                                '<a onclick="openCloseFolder(\'' + node.id + '\')" class="p-right-icon" data-toggle="collapse" aria-expanded="true" aria-controls="el-' + node.id + '-detail"><i id="el-' + node.id + '-caret" class="p-10 fas fa-caret-down"></i></a>' +
					        '</span>' + 
                        '</div>' +
					'<div id="el-' + node.id + '-detail" class="list-group nested-sortable collapse show">' +
					'</div>' +
				'</div>'

	var dom_nodes = $($.parseHTML(el));		
	if (node.parentId) {
        if ($("#el-" + node.parentId + "-detail").length>0)
		    $("#el-" + node.parentId + "-detail").last().append(dom_nodes);
        else
            $("#el-" + node.parentId ).after( dom_nodes );
	} else
		$( "#"+ listId ).append( dom_nodes );
	

}

// Remove element
function removeElement() {
	//console.log("Remove Layer " + selectedElement);
	if (selectedElement!=null && layersObj[selectedElement]) {
        map.removeLayer(layersObj[selectedElement]);
        const layer = layersObj[selectedElement];
        if (layer.hasEmptyGroup || layer.hasChildLayer || layer.type=="group") {
            //folder
            var nested = $('#el-' + layer.id + '-detail .list-group-item');
            //console.log(nested);
            for (var i = 0; i < nested.length; i++) {
                var el = nested[i];
                // get element id
                const nestedElId = el.id.substring(3);
                map.removeLayer(layersObj[nestedElId]);
            }
            removeNode(layer);
        }
	}
}

// Select element
function selectElement(id) {
	const element = $("#" + id + '-panel');
	if (!element.hasClass("selected")) {
		selectedElement=id.substring(3);
		$('.panel-element').removeClass("selected");
		element.toggleClass("selected");
		$("#removeLayerBtn").prop('disabled', false);
		//console.log("Select element: " + selectedElement);
	} else {
		$('.panel-element').removeClass("selected");
		selectedElement=null;
		$("#removeLayerBtn").prop('disabled', true);
		//console.log("No element selected");
	}
}

// Show layer detail
function layerDetail(layerId) {
		$('#layerDetailPanelName').text(layersObj[layerId].name);
		$("#"+ listId).hide();	
        $("#"+ toolbarId).hide();		
        $('#layer-style').hide();
        $('#layer-legend').hide();
        $('#layer-data').hide();
        $("#layer-dimensions").empty();
        $("#layer-dimensions").hide();
		$("#layerDetailPanel").show();

        selectedElement = layerId;
        const layerAttrWidget = {
            "name": "Layer attributes",
            "uri": "widgets/antus/layer-table/widget.js",
        }
        if (!es5widget.isActivate(layerAttrWidget.uri))
            es5widget.activate(layerAttrWidget);

        checkWfsAvailability(layerId);

        if (layersObj[layerId].options.type=="wms") {
            // Set Layer styles
            setLayerStyles(layerId);
            // Set Dimensions
            setDimensions(layerId);
        }

}

// Is Wfs service available for layer
function checkWfsAvailability(layerId) {
    const layer = layersObj[layerId];
    $.ajax({
        type: "GET",
        url: layer.options.url + 
            "?service=wms" + 
            "&version=1.1.1" +
            "&request=DescribeLayer" +
            "&layers=" + layer.options.layers +
            "&outputFormat=application/json",
        success: function (data) {
            if (data.layerDescriptions.length==1 && data.layerDescriptions[0].owsType=="WFS") {
                $('#layer-data').show();
                selectedElement = layerId;
            }
        }
    });
    
}

// Set layer styles
function setLayerStyles(layerId) {
    // allow jQuery to handle the elements like HTML
    var xml = $(layersObj[layerId].capabilities);
    //find <document> and get its name attribute
    var featureTypes = xml.find('Layer Layer');
    for (var i = 0; i < featureTypes.length; i++) {
        const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
        if (name==layersObj[layerId].options.layers) {
            var styles = featureTypes[i].getElementsByTagName('Style');
            if (styles.length>1) {
                $('#layer-style').show();
                var select = $("#layer-style-sel");
                $(select).empty();
                var selectedStyle = layersObj[layerId].options.parameters.styles;
                for (var j = 0; j < styles.length; j++) {
                    const style = styles[j].getElementsByTagName('Name')[0].textContent;
                    var selected = "";
                    if (!selectedStyle){
                        if (j==0) {
                            selected = "selected";    
                            // Set Layer Legend
                            setLayerLegend(layerId, style);
                        }
                    } else {
                        if (style==selectedStyle) {
                            selected = "selected";
                            setLayerLegend(layerId, style);
                        }
                    }
                    var el = '<option value="layer-style-' + layerId + '" ' + selected + '>' +  style + '</option>';
                    var styleOpt = $($.parseHTML(el));		
                    $(select).append(styleOpt);
                }
            } else {
                const style = styles[0].getElementsByTagName('Name')[0].textContent;
                setLayerLegend(layerId, style);
            }
            break;
        }
    }
}

// Set layer legend
function setLayerLegend(layerId, selectedStyle) {
    // allow jQuery to handle the elements like HTML
    var xml = $(layersObj[layerId].capabilities);
    //find <document> and get its name attribute
    var featureTypes = xml.find('Layer Layer');
    for (var i = 0; i < featureTypes.length; i++) {
        const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
        if (name==layersObj[layerId].options.layers) {
            var styles = featureTypes[i].getElementsByTagName('Style');
            for (var j = 0; j < styles.length; j++) {
                const style = styles[j].getElementsByTagName('Name')[0].textContent;
                if (style==selectedStyle) {
                    const  url = styles[j].getElementsByTagName('OnlineResource')[0].attributes['xlink:href'].value + "&transparent=True";
                    //$("#legend-img").html("<img src='" + layersObj[layerId].options.url + "?service=WMS&version=1.1.0&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=" + layersObj[layerId].options.layers + "&transparent=True'></img>");
                    $("#legend-img").html("<img src='" + url + "&LEGEND_OPTIONS=forceLabels:on'></img>");
                    break;
                }
            }
            break;
        }
    }
    $('#layer-legend').show();
}

// Set WMS layer style
function selectLayerStyle(sel)
{
    const layerId = sel.selectedOptions[0].value.substring(12);
    const style   = sel.selectedOptions[0].text;
    layersObj[layerId].options.parameters.styles = style;
    // set legend
    setLayerLegend(layerId, style)
    // reload layer
    layersObj[layerId].reload();

}

function setDimensions(layerId) {
       // allow jQuery to handle the elements like HTML
       var xml = $(layersObj[layerId].capabilities);
       //find <document> and get its name attribute
       var featureTypes = xml.find('Layer Layer');
       var select = $("#layer-dimensions");
       for (var i = 0; i < featureTypes.length; i++) {
           const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
           if (name==layersObj[layerId].options.layers) {
                var dimensions = featureTypes[i].getElementsByTagName('Dimension');
                if (dimensions.length>0) {
                    for (var j = 0; j < dimensions.length; j++) {
                        const dimension = dimensions[j].attributes['name'].value;
                        const def = dimensions[j].attributes['default'].value;
                        const units = dimensions[j].attributes['units'].value;
                        const value = dimensions[j].textContent.split(',');
                        console.log(dimension);
                        var selectedDimensionValue = def;
                        const parameters = layersObj[layerId].options.parameters;
                        if (parameters && parameters[dimension])
                            selectedDimensionValue = parameters[dimension];
                        var dimOpt = "";
                        value.forEach((item) => {
                            var selected = "";
                            if (units!="" && units=="ISO8601") {
                                if (new Date(selectedDimensionValue).toISOString() == new Date(item).toISOString())
                                    selected="selected";
                            } else {
                                if (selectedDimensionValue==item)
                                selected="selected";
                            }
                            dimOpt += '<option value="layer-' + dimension + '-' + layerId + '" ' + selected + ' >' +  item + '</option>';   
                        });
                        var el = '<span>' + dimension + '</span>' +
                                    '<select id="layer-' + dimension +'-sel" class="catalog-picker form-control" onchange="selectLayerDimension(\'' + dimension + '\', this);">' +
                                        dimOpt + 
                                    '</select>';
                        
                        var dim = $($.parseHTML(el));		
                        $(select).append(dim);
                    }
                    $(select).show();
                }
                break;
           }
       } 
}

// select dimension
function selectLayerDimension(dimension, sel) {
    const layerId = sel.selectedOptions[0].value.substring(6 + dimension.length + 1);
    const value   = sel.selectedOptions[0].text;
    var prefix = "dim_";
    if (dimension=="time")
        prefix="";
    if (!layersObj[layerId].options.parameters)
        layersObj[layerId].options.parameters={};
    layersObj[layerId].options.parameters[prefix + dimension] = value;
    if (!layersObj[layerId].options.getFeatureInfoParameters)
        layersObj[layerId].options.getFeatureInfoParameters={};
    layersObj[layerId].options.getFeatureInfoParameters[prefix + dimension] = value;
    
    // reload layer
    layersObj[layerId].reload();

}

// Zoom to layer
function zoomToLayer(elementId) {
    const id = elementId.substring(3);
    if (layersObj[id] && layersObj[id].isAdded && layersObj[id].show ) {
        layersObj[id].flyTo();
    }
    event.stopPropagation();
}

// Close layer detail panel
function panelCloseButton() {
	$("#layerDetailPanel").hide();
    $("#catalogPanel").hide();
	$("#"+ listId).show();
    $("#"+ toolbarId).show();	
}

// Check element
function checkElement(id) {
	const element = $("#" + id + "-check");
	//console.log("Check element: " + id.substring(3));
	var checked = false;
	if (element.hasClass("fa-square")) {
		element.removeClass("fa-square");
		element.addClass("fa-check-square");
		checked = true;
	} else {
		element.removeClass("fa-check-square");
		element.addClass("fa-square");
	}

	if ($('#' + id + '-detail .list-group-item').length>0) {
		//folder
		var nested = $('#' + id + '-detail .list-group-item');
		//console.log(nested);
		for (var i = 0; i < nested.length; i++) {
			var el = nested[i];
            // get element id
            const nestedElId = el.id;
            const checkRef = '#' + nestedElId + '-check';
			if (checked) {
				$(checkRef).removeClass("fa-square");
				$(checkRef).addClass("fa-check-square");
			} else {
				$(checkRef).removeClass("fa-check-square");
				$(checkRef).addClass("fa-square");
			}
            
            if ($('#' + nestedElId + '-detail .list-group-item').length==0) {
                // Processing layer display (show/hide)
                const layerId = nestedElId.substring(3);
                panel_widget.updateLayerShow(layersObj[layerId], checked)
            }
		}
	} else {
        // Processing layer display (show/hide)
        const layerId = id.substring(3);
        panel_widget.updateLayerShow(layersObj[layerId], checked)
    }
	event.stopPropagation();
}

// Open/Close Folder
function openCloseFolder(id) {
	//console.log("The caret was clicked: " + id);  
	if (!$('#el-' + id + '-detail').hasClass("show")) {
		$('#el-' + id + '-caret').removeClass("fa-caret-right");
		$('#el-' + id + '-caret').addClass("fa-caret-down");
	}
	else {
		$('#el-' + id + '-caret').removeClass("fa-caret-down");
		$('#el-' + id + '-caret').addClass("fa-caret-right");
	}
	$('#el-' + id + '-detail').collapse('toggle');
	event.stopPropagation();
}

// Manage list events
function notifyChange(evt) {
	if (evt.from.id != evt.to.id) {
		if (prevChange!=null) {
			if (evt.item.id != prevChange.dataId ||
				evt.from.id	!= prevChange.fromId ||
				evt.to.id	!= prevChange.toId) {
					listChanged(evt);
			}
		} else {
			listChanged(evt);	
		}
		prevChange = {
			dataId: evt.item.id,
			fromId: evt.from.id,
			toId: evt.to.id
		}
	} else {
		prevChange = null;
		listChanged(evt);
	}
}

// Manage list change event
function listChanged(evt) {
	var l = [];
    const total = $(".list-group-item").length;
    
	$(".list-group-item").each(function( index ) {
      const id = $( this )[0].id.substring(3);
	  l.push($( this )[0].id.substring(3) + "-" + (total-index+1) +"-" + layersObj[id].zIndex);
      layersObj[id].zIndex=(total-index+1);
	});
	//console.log("List changed: " + l);
}

function showLayerData() {
    console.log("call layer-data");
    es5widget.fire("layer-data", {"layer": layersObj[selectedElement]});
}

