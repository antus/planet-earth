class LayerManager {
  
  listId                = "dlm-nestedDemo";
  toolbarId             = "dlm-toolbar";
  catalogSelId          = "dlm-catatalogSel"
  addFolderId           = "dlm-addFolder"
  addLayerId          = "dlm-addLayer"
  removeLayerId         = "dlm-removeLayer"
  showLayerDetailId     = "dlm-showLayerDetail"
  layerDetailPanelId    = "dlm-layerDetailPanel"
  layerDetailPanelNameId= "dlm-layerDetailPanelName"
  layerDataId           = "dlm-layerData"
  layerDimensionsId     = "dlm-layerDimensions"
  layerStyleId          = "dlm-layerStyle"
  layerStyleSelId       = "dlm-layerStyleSel"
  layerLegendId         = "dlm-layerLegend"
  legendImgId           = "dlm-legendImg"
  catalogPanelId        = "dlm-catalogPanel"
  closeLayerDetailId    = "dlm-closeLayerDetail"
  catalogLayersTableId  = "dlm-catalogLayersTable"

  selectedElement = null;
  prevChange = null;
  tileLayer = null;
  layersObj = {};
  catalogs = [];
  selectedCatalog = null;
  layersTable = null;

  constructor(widget, properties) {
      this.widget = widget;
      this.map = widget.map;
      this.properties = properties;
      this.init();
  }

  // Init component    
  init() {
    console.log("Init Component obj with id: " + this.properties.id)
      const id = this.properties.id;
      // get the reference div 
      var refDiv = $("#" + id)[0];
      if (refDiv) {
        // Load view
        fetch(this.widget.path + "view.html")
          .then((response) => response.text())
            .then((html) => {
              var id=this.properties.id;
              // Add html fragment
              $(refDiv).html( html);
              // init UI
              this.initUI();
            });
      }
  }
  
  // init UI
  initUI() {
    // init objects
    this.selectedElement = null;
    this.prevChange = null;
    this.tileLayer = null;
    this.layersObj = {};
    this.catalogs = [];
    this.selectedCatalog = null;
    this.layersTable = null;
    // Clear lists
    $( "#" + this.listId ).empty();
    $("#" + this.catalogSelId).empty();
    // Init lists
    this.loadLayers();
    this.initNestedList();
    this.initCatalogs();
    this.bindUIElements();
  }

  // load layers from map
  loadLayers() {
    let nodes = [];
    const layers = this.getLayers();
    // build hierarchical object
    for (let i = layers.length - 1; i >= 0; i--) {
        let node = this.getNodeConfig(layers[i]);
        nodes.push(node);
    }
    // create hierarchical node objects
    const nestedData = this.createHierachy(nodes);
    // create tree list
    nestedData.items.forEach((arrayItem) => {
      this.iterate(arrayItem);
    });
    this.initNestedList();
    this.listChanged();
  }

  
  // Get map layers
  getLayers() {
    return this.widget.map.getLayers({
      basemaps: false, //Whether to take the basempas in config.json, because it is controlled by the basemap, it can be changed to false as needed in specific projects
      layers: true //Whether to take the layers in config.json
    })
  }

  // get layer node configuration
  getNodeConfig(layer) {
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
    this.layersObj[node.id] = layer

    return node;
  }

  // Create hierarchical node objects
  createHierachy(nodes) {
    const buildTree = (parentId) => (item) => {
        const children = nodes.filter((child) => child.parentId === item.id);
        return {
            ...item,
            ...(children.length > 0 && { children: children.map(buildTree(item.id)) }),
        };
    };
    
    const nestedData = {
        items: nodes.filter((item) => !item.parentId).map(buildTree(undefined)),
    };
    
    //console.log(nestedData);
    return nestedData;
  }

  // Create tree list
  iterate(node) {
    // create element
    if (node.type=="folder" || node.type=="layer group") {
        // Add folder
        this.addFolder(node);
    } else {
        // Add Layer
        this.addLayer(node);
    }
    if (node.children) {
        for (let child of node.children) {
          this.iterate(child);
        }
    }
  }
  
  // Initialize list
  initNestedList() {
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
        onSort: (evt) => {
          // same properties as onEnd
          this.notifyChange(evt);
        }
      });
    }
  
    var layersObj = this.layersObj 
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

  // Manage list change event
  listChanged(evt) {
    var l = [];
    const total = $(".list-group-item").length;
    var layersObj = this.layersObj   
    
    $(".list-group-item").each(function( index ) {
        const id = $( this )[0].id.substring(3);
      l.push($( this )[0].id.substring(3) + "-" + (total-index+1) +"-" + layersObj[id].zIndex);
      layersObj[id].zIndex=(total-index+1);
    });
    //console.log("List changed: " + l);
  }
  
  // init catalog list
  initCatalogs() {
    var select = $("#" + this.catalogSelId);
    if (this.widget.catalogs) {
        for (var i=0; i< this.widget.catalogs.length; i++) {
            this.catalogs[i] = {id: i, name: this.widget.catalogs[i].name, url: this.widget.catalogs[i].url};
            var el = '<option value="catalog-' + i + '" >' + this.widget.catalogs[i].name + '</option>';
            var service = $($.parseHTML(el));		
            $(select).append(service);
        }
        if (this.widget.catalogs.length>0)
            this.selectedCatalog = this.catalogs[0];
    }
  }
  
  // Select catalog 
  connect(el) {
    var sel = $('#' + el)[0];
    const cataogId = sel.value.substring(8);
    if (cataogId!="") {
      this.selectedCatalog = this.catalogs[cataogId];
      console.log(this.selectedCatalog);
      this.readCatalogLayers();
    }
  }

  // Read catalog layers 
  readCatalogLayers() {
    if (this.selectedCatalog) {
        // read catalog layers
        const url= this.selectedCatalog.url;
        let layers = [];
        $.ajax({
        type: "get",
        dataType: "xml",
        url: url + "?request=GetCapabilities",
        timeout: 5000,
        success: (text, textStatus, request) => {
            var xml;
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
            this.showCatalogLayersTable(arr);
    
        },
        error: (request, textStatus) => {
            toastr.warning("Service access error!");
        }
        });
    }
  }

  // Create and show catalog layers table
  showCatalogLayersTable(data) {
    // set layers table 
    this.layersTable = $('#' + this.catalogLayersTableId); 
    const height = $('.catalog-layers-container').height()-40;
    this.layersTable.bootstrapTable({
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
              "click .add": (e, value, row, index) => {
                this.addTileLayer(row)
              },
            },
            formatter: (value, row, index) => {
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
    this.layersTable.bootstrapTable("load", data);
  }

  // Bind ui elements with controllers
  bindUIElements() {
    var obj = this;
    $("#" + this.addFolderId).click(function() { obj.addNewFolder()});
    $("#" + this.addLayerId).click(function() { obj.addNewLayer()});
    $("#" + this.removeLayerId).click(function() { obj.removeElement()});
    $("#" + this.showLayerDetailId).click(function() { obj.showLayerData()});
    $("#" + this.layerStyleSelId).change(function() { obj.selectLayerStyle(obj.layerStyleSelId)});
    $("#" + this.closeLayerDetailId).click(function() { obj.panelCloseButton()});
    $("#" + this.catalogSelId).change(function() { obj.connect(obj.catalogSelId)});
  }
  // Update node
  updateNode(layer) {
      const layers = this.getLayers();
  
      if (this.layersObj[layer.id]) {
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
          let node = this.getNodeConfig(layer);
  
          // if layer has name
          if (node) {
              this.layersObj[node.id] = layer;
  
              this.addLayer(node);
              this.initNestedList();
              this.listChanged();
          }
      }    
  }
  
  // Remove node
  removeNode(layer) {
      $('#el-' + layer.id).remove();
      this.selectedElement=null;
      $("#" + this.removeLayerId).prop('disabled', true);
      delete this.layersObj[" + layer.id + "];
      this.listChanged();
  }
  
  // Add new layer
  addNewLayer() {
      $("#" + this.listId).hide();		
      $("#" + this.toolbarId).hide();
      $('#' + this.catalogPanelId).show();
  
      this.readCatalogLayers();
  }
  
  
  addTileLayer(layer) {
      const url= this.selectedCatalog.url;
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
      if (this.selectedElement) {
          tileLayer.pid = this.selectedElement;
      }
      // add to map
      this.map.addLayer(tileLayer);
  }
      
  // Add Layer
  addLayer(node) {
    //console.log("Add Layer " + node.id);
    var el = 	'<div id="el-' + node.id + '" class="list-group-item" >' +
            '<div id="el-' + node.id + '-panel" class="panel-element m-left-10">' +	
                          '<span class="flex-container-1">' + 
                              '<span class="element-control-buttons">' +	
                                  '<i id="el-' + node.id + '-check" class="element-check far ' + (node.checked?"fa-check-square":"fa-square")+ ' p-right-10"></i>' +
                                  '<i class="fas fa-layer-group"></i>' +
                              '</span>' +
                              '<span class="element-info">' +
                                      '<span class="element-text d-inline-block text-truncate">' + node.name + '</span>' +
                                      '<span class="element-type">' + node.type + '</span>' +
                                      '<input class="element-range" id="el-' + node.id + '-opacity">' +
                              '</span>' +
                          '</span>' +
                          '<span class="flex-container-2">' +
                              '<span id="el-' + node.id + '-zoom" title="extent"><i class="zoom p-right-icon fas fa-expand"></i></span>' +
                              '<span id="el-' + node.id + '-detail" title="details"><i class="detail p-right-icon fas fa-list"></i></span>' +
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
    
    // Bind UI
    var obj = this;
    $('#el-' + node.id + '-panel').click(function() { obj.selectElement('el-' + node.id)});
    $('#el-' + node.id + '-check').click(function() { obj.checkElement('el-' + node.id)});
    $('#el-' + node.id + '-zoom').click(function() { obj.zoomToLayer('el-' + node.id)});
    $('#el-' + node.id + '-detail').click(function() { obj.layerDetail('el-' + node.id)});
  }
  
  // Add new folder
  addNewFolder() {
    let index = 1;
    while (this.layersObj[index]) {
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
    if (this.selectedElement) {
        node.parentId = this.selectedElement;
    }

    // TODO: replace the following line with the real new layer 
    this.layersObj[index] = new mars3d.layer.GroupLayer({
        id: node.id,
        name: node.name,
        pid: node.parentId?node.parentId:-1,
        });

    this.addFolder(node);
    this.initNestedList();
    this.listChanged();
  }
  
  // Add Folder
  addFolder(node) {
    //console.log("Add Folder " +node.id);
    var el = 	'<div id="el-' + node.id + '" class="list-group-item">' +
              '<div id="el-' + node.id + '-panel" class="panel-element">' +	
                  '<span class="flex-container-1">' +
                                '<span class="element-control-buttons">' +	
                                    '<i id="el-' + node.id + '-check" class="element-check far fa-square p-right-10"></i>' +
                                    '<i class="fas fa-folder"></i>' +
                                '</span>' +
                                '<span class="element-info">' +
                                    '<span class="element-text d-inline-block text-truncate">' + node.name + '</span>' +
                                    '<span class="element-type">' + node.type + '</span>' +
                                '</span>' +
                            '</span>' +
                                '<span class="flex-container-2">' +
                                    '<a id="el-' + node.id + '-expand" class="p-right-icon" data-toggle="collapse" aria-expanded="true" aria-controls="el-' + node.id + '-detail"><i id="el-' + node.id + '-caret" class="p-10 fas fa-caret-down"></i></a>' +
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
      $( "#"+ this.listId ).append( dom_nodes );
    
      // Bind UI
      var obj = this;
      $('#el-' + node.id + '-panel').click(function() { obj.selectElement('el-' + node.id)});
      $('#el-' + node.id + '-check').click(function() { obj.checkElement('el-' + node.id)});
      $('#el-' + node.id + '-expand').click(function() { obj.openCloseFolder('el-' + node.id)});
 
  }
  
  // Remove element
  removeElement() {
    //console.log("Remove Layer " + selectedElement);
    if (this.selectedElement!=null && this.layersObj[this.selectedElement]) {
          this.map.removeLayer(this.layersObj[this.selectedElement]);
          const layer = this.layersObj[this.selectedElement];
          if (layer.hasEmptyGroup || layer.hasChildLayer || layer.type=="group") {
              //folder
              var nested = $('#el-' + layer.id + '-detail .list-group-item');
              //console.log(nested);
              for (var i = 0; i < nested.length; i++) {
                  var el = nested[i];
                  // get element id
                  const nestedElId = el.id.substring(3);
                  this.map.removeLayer(this.layersObj[nestedElId]);
              }
              this.removeNode(layer);
          }
    }
  }
  
  // Select element
  selectElement(id) {
    const element = $("#" + id + '-panel');
    if (!element.hasClass("selected")) {
      this.selectedElement=id.substring(3);
      $('.panel-element').removeClass("selected");
      element.toggleClass("selected");
      $("#" + this.removeLayerId).prop('disabled', false);
      //console.log("Select element: " + this.selectedElement);
    } else {
      $('.panel-element').removeClass("selected");
      this.selectedElement=null;
      $("#" + this.removeLayerId).prop('disabled', true);
      //console.log("No element selected");
    }
  }
  
  // Show layer detail
  layerDetail(id) {
      const layerId = id.substring(3);
      $('#' + this.layerDetailPanelNameId).text(this.layersObj[layerId].name);
      $("#" + this.listId).hide();	
      $("#" + this.toolbarId).hide();		
      $('#' + this.layerStyleId).hide();
      $('#' + this.layerDimensionsId).empty();
      $('#' + this.layerDimensionsId).hide();
      $('#' + this.layerLegendId).hide();
      $('#' + this.layerDataId).hide();

      $("#" + this.layerDetailPanelId).show();
      this.selectedElement = layerId;
      /*
      const layerAttrWidget = {
          "name": "Layer attributes",
          "uri": "widgets/antus/layer-table/widget.js",
      }
      if (!es5widget.isActivate(layerAttrWidget.uri))
          es5widget.activate(layerAttrWidget);
      */
      this.checkWfsAvailability(layerId);

      if (this.layersObj[layerId].options.type=="wms") {
        // Set Layer styles
        this.setLayerStyles(layerId);
        // Set Dimensions
        this.setDimensions(layerId);
      }
  
  }
  
  // Is Wfs service available for layer
  checkWfsAvailability(layerId) {
      const layer = this.layersObj[layerId];
      $.ajax({
          type: "GET",
          url: layer.options.url + 
              "?service=wms" + 
              "&version=1.1.1" +
              "&request=DescribeLayer" +
              "&layers=" + layer.options.layers +
              "&outputFormat=application/json",
          success: (data) => {
              if (data.layerDescriptions.length==1 && data.layerDescriptions[0].owsType=="WFS") {
                  $('#' + this.layerDataId).show();
                  this.selectedElement = layerId;
              }
          }
      });
      
  }
  
  // Set layer styles
  setLayerStyles(layerId) {
      // allow jQuery to handle the elements like HTML
      var xml = $(this.layersObj[layerId].capabilities);
      //find <document> and get its name attribute
      var featureTypes = xml.find('Layer Layer');
      for (var i = 0; i < featureTypes.length; i++) {
          const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
          if (name==this.layersObj[layerId].options.layers) {
              var styles = featureTypes[i].getElementsByTagName('Style');
              if (styles.length>1) {
                  $('#' + this.layerStyleId).show();
                  var select = $('#' + this.layerStyleSelId);
                  $(select).empty();
                  var selectedStyle = this.layersObj[layerId].options.parameters.styles;
                  for (var j = 0; j < styles.length; j++) {
                      const style = styles[j].getElementsByTagName('Name')[0].textContent;
                      var selected = "";
                      if (!selectedStyle){
                          if (j==0) {
                              selected = "selected";    
                              // Set Layer Legend
                              this.setLayerLegend(layerId, style);
                          }
                      } else {
                          if (style==selectedStyle) {
                              selected = "selected";
                              this.setLayerLegend(layerId, style);
                          }
                      }
                      var el = '<option value="layer-style-' + layerId + '" ' + selected + '>' +  style + '</option>';
                      var styleOpt = $($.parseHTML(el));		
                      $(select).append(styleOpt);
                  }
              } else {
                  const style = styles[0].getElementsByTagName('Name')[0].textContent;
                  this.setLayerLegend(layerId, style);
              }
              break;
          }
      }
  }
  
  // Set layer legend
  setLayerLegend(layerId, selectedStyle) {
      // allow jQuery to handle the elements like HTML
      var xml = $(this.layersObj[layerId].capabilities);
      //find <document> and get its name attribute
      var featureTypes = xml.find('Layer Layer');
      for (var i = 0; i < featureTypes.length; i++) {
          const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
          if (name==this.layersObj[layerId].options.layers) {
              var styles = featureTypes[i].getElementsByTagName('Style');
              for (var j = 0; j < styles.length; j++) {
                  const style = styles[j].getElementsByTagName('Name')[0].textContent;
                  if (style==selectedStyle) {
                      const  url = styles[j].getElementsByTagName('OnlineResource')[0].attributes['xlink:href'].value + "&transparent=True";
                      //$('#' + this.legendImgId).html("<img src='" + this.layersObj[layerId].options.url + "?service=WMS&version=1.1.0&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=" + this.layersObj[layerId].options.layers + "&transparent=True'></img>");
                      $('#' + this.legendImgId).html("<img src='" + url + "&LEGEND_OPTIONS=forceLabels:on'></img>");
                      break;
                  }
              }
              break;
          }
      }
      $('#' + this.layerLegendId).show();
  }
  
  // Set WMS layer style
  selectLayerStyle(el)
  {
    var sel = $('#' + el)[0];
    if (sel.selectedOptions.length>0) {
      const layerId = sel.selectedOptions[0].value.substring(12);
      const style   = sel.selectedOptions[0].text;
      this.layersObj[layerId].options.parameters.styles = style;
      // set legend
      this.setLayerLegend(layerId, style)
      // reload layer
      this.layersObj[layerId].reload();
    }
  }
  
  setDimensions(layerId) {
        // allow jQuery to handle the elements like HTML
        var xml = $(this.layersObj[layerId].capabilities);
        //find <document> and get its name attribute
        var featureTypes = xml.find('Layer Layer');
        var select = $("#" + this.layerDimensionsId);
        for (var i = 0; i < featureTypes.length; i++) {
            const name = featureTypes[i].getElementsByTagName('Name')[0].innerHTML;
            if (name==this.layersObj[layerId].options.layers) {
                  var dimensions = featureTypes[i].getElementsByTagName('Dimension');
                  if (dimensions.length>0) {
                      for (var j = 0; j < dimensions.length; j++) {
                          const dimension = dimensions[j].attributes['name'].value;
                          const def = dimensions[j].attributes['default'].value;
                          const units = dimensions[j].attributes['units'].value;
                          const value = dimensions[j].textContent.split(',');
                          console.log(dimension);
                          var selectedDimensionValue = def;
                          const parameters = this.layersObj[layerId].options.parameters;
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
                                      '<select id="layer-' + dimension +'-sel" class="catalog-picker form-control">' +
                                          dimOpt + 
                                      '</select>';
                          
                          var dim = $($.parseHTML(el));		
                          $(select).append(dim);
                          // Bind UI
                          var obj = this;
                          $('#layer-' + dimension +'-sel').change(function() { obj.selectLayerDimension(dimension, 'layer-' + dimension +'-sel')});
                      }
                      $(select).show();
                  }
                  break;
            }
        } 
  }
  
  // select dimension
  selectLayerDimension(dimension, s) {
      var sel = $('#' + s)[0];
      const layerId = sel.selectedOptions[0].value.substring(6 + dimension.length + 1);
      const value   = sel.selectedOptions[0].text;
      var prefix = "dim_";
      if (dimension=="time")
          prefix="";
      if (!this.layersObj[layerId].options.parameters)
          this.layersObj[layerId].options.parameters={};
      this.layersObj[layerId].options.parameters[prefix + dimension] = value;
      if (!this.layersObj[layerId].options.getFeatureInfoParameters)
          this.layersObj[layerId].options.getFeatureInfoParameters={};
      this.layersObj[layerId].options.getFeatureInfoParameters[prefix + dimension] = value;
      
      // reload layer
      this.layersObj[layerId].reload();
  
  }
  
  // Zoom to layer
  zoomToLayer(elementId) {
      const id = elementId.substring(3);
      if (this.layersObj[id] && this.layersObj[id].isAdded && this.layersObj[id].show ) {
          this.layersObj[id].flyTo();
      }
      event.stopPropagation();
  }
  
  // Close layer detail panel
  panelCloseButton() {
    $("#" + this.layerDetailPanelId).hide();
    $('#' + this.catalogPanelId).hide();
    $("#"+ this.listId).show();
    $("#"+ this.toolbarId).show();	
  }
  
  // Check element
  checkElement(id) {
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
                  this.widget.updateLayerShow(this.layersObj[layerId], checked)
              }
      }
    } else {
          // Processing layer display (show/hide)
          const layerId = id.substring(3);
          this.widget.updateLayerShow(this.layersObj[layerId], checked)
      }
    event.stopPropagation();
  }
  
  // Open/Close Folder
  openCloseFolder(id) {
    //console.log("The caret was clicked: " + id);  
    if (!$('#' + id + '-detail').hasClass("show")) {
      $('#' + id + '-caret').removeClass("fa-caret-right");
      $('#' + id + '-caret').addClass("fa-caret-down");
    }
    else {
      $('#' + id + '-caret').removeClass("fa-caret-down");
      $('#' + id + '-caret').addClass("fa-caret-right");
    }
    $('#' + id + '-detail').collapse('toggle');
    event.stopPropagation();
  }
  
  // Manage list events
  notifyChange(evt) {
    if (evt.from.id != evt.to.id) {
      if (this.prevChange!=null) {
        if (evt.item.id != this.prevChange.dataId ||
          evt.from.id	!= this.prevChange.fromId ||
          evt.to.id	!= this.prevChange.toId) {
            this.listChanged(evt);
        }
      } else {
        this.listChanged(evt);	
      }
      this.prevChange = {
        dataId: evt.item.id,
        fromId: evt.from.id,
        toId: evt.to.id
      }
    } else {
      this.prevChange = null;
      this.listChanged(evt);
    }
  }
  
  showLayerData() {
      console.log("call layer-data");
      es5widget.fire("layer-data", {"layer": this.layersObj[this.selectedElement]});
  }

 
  resize() {}

    /********** End of Widget **********/
}