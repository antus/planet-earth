// Define layout configuration
var config = {
    settings:{
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: true,
        selectionEnabled: true,
        popoutWholeStack: true,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: true
    },
    dimensions: {
        borderWidth: 5,
        minItemHeight: 10,
        minItemWidth: 10,
        headerHeight: 20,
        dragProxyWidth: 300,
        dragProxyHeight: 200
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        minimise: 'minimise',
        popout: 'open in new window'
    },
    content: [{
        type: "row",
        isClosable: false,
        content: [
            {
                id: "d-layer-manager-1",
                width:20,
                title: "Layers",
                type: 'component',
                componentName: "map-widget",
                componentState: { 
                    uri: "widgets/antus/dockable/layer-manager/widget.js",
                    properties: {
                        "catalogs": [
                            {
                                "name": "Geoserver local",
                                "url": "http://localhost:8080/geoserver/wms",
                                "type": "wms"
                            },
                            {
                                "name": "Geoserver GiottoLab",
                                "url": "http://10.100.208.140:8089/geoserver/wms",
                                "type": "wms"
                            },
                        ]
                    }
                }
            },
            {
                type: "column",
                content: [
                    {
                        id: 'mars3dContainer',
                        title: "Map",
                        isClosable: false,
                        type: "component",
                        componentName: "map"
                        
                    },
                    {
						id: "d-chart-1",
						title: "Distribuzione comuni (bar)",
						type: 'component',
						componentName: "map-widget",
						componentState: { 
							uri: "widgets/antus/dockable/chart/widget.js",
							properties: {
                                server: "http://localhost:8080/geoserver/wps",
                                layer: "monitoraggio-ambientale:Comuni",
                                type:"bar",
                                xAttribute: "regione",
                                yAttribute: "comune",
                                function: "Count"
                            }
						},
                        height:33
					}
                ]
            },
			{
				type: "column",
                width:20,
				content: [
					{
						id: "d-counter-1",
						title: "Comuni totali",
						type: 'component',
						componentName: "map-widget",
						componentState: { 
							uri: "widgets/antus/dockable/counter/widget.js",
							properties: {
                                server: "http://localhost:8080/geoserver/wps",
                                layer: "monitoraggio-ambientale:Comuni",
                                attribute: "comune",
                                function: "Count"
                            }
						},
                        height: 20
					},
                    {
						id: "d-chart-2",
						title: "Distribuzione comuni (line)",
						type: 'component',
						componentName: "map-widget",
						componentState: { 
							uri: "widgets/antus/dockable/chart/widget.js",
							properties: {
                                server: "http://localhost:8080/geoserver/wps",
                                layer: "monitoraggio-ambientale:Comuni",
                                type:"line",
                                xAttribute: "regione",
                                yAttribute: "comune",
                                function: "Count"
                            }
						}
					},
					{
						id: "d-chart-3",
						title: "Distribuzione comuni (pie)",
						type: 'component',
						componentName: "map-widget",
						componentState: { 
							uri: "widgets/antus/dockable/chart/widget.js",
							properties: {
                                server: "http://localhost:8080/geoserver/wps",
                                layer: "monitoraggio-ambientale:Comuni",
                                type:"pie",
                                xAttribute: "regione",
                                yAttribute: "comune",
                                function: "Count"
                            }
						}
					}
				]
            }
        ]
    }]
};

// Create layout
var myLayout = new GoldenLayout( config , "#layoutContainer");

// Register map component
myLayout.registerComponent( 'map', function( container, state ){
  container.getElement().html( '<div id="' + container._config.id + '" class="mars3d-container"></div>');
});

// Register widget component
myLayout.registerComponent( "map-widget", function( container, state ){
    container.getElement().html( '<div id="' + container._config.id + '" class="map-widget"></div>');
    container.on('resize', function() {
        if (es5widget)
            es5widget.fire("map-widget-resize", {"id": container._config.id});
    })
});

// Register example component
myLayout.registerComponent( 'example', function( container, state ){
    container.getElement().html( '<h2 id="' + container._config.id + '">' + state.text + '</h2>');
});

// Register close listerner on tab 
myLayout.on( 'tabCreated', function( tab ){
    if (tab.contentItem.componentName=="map-widget") {
        tab
        .closeElement
        .off( 'click' ) //unbind the current click handler
        .click(function(){
            window.es5widget.disable(tab.contentItem.config.componentState.uri);
        });
    }
});

// Register close listerner on stack 
/*
myLayout.on( 'stackCreated', function( stack ){
    stack
      .header
      .controlsContainer
      .find( '.lm_close' ) //get the close icon
      .off( 'click' ) //unbind the current click handler
      .click(function(){
        //add your own
        if( confirm( 'really close this?' ) ) {
          stack.remove();
        }
      });
    
  });
*/

// Init layout
myLayout.init();

myLayout.on('initialised', function() { 
    console.log('layout initialized');
    init();
})

// Define function to add components to the layout
var addMenuItem = function( text, icon ) {
    var element = $( '<li class="nav-item"><i class="fa ' + icon + '" title="' + text + '"></i></li>' );
    $( '#menuContainer' ).append( element );

    var newItemConfig = {
        id: text,
        title: text,
        type: 'component',
        componentName: 'example',
        componentState: { text: text },
        width: 20
    };
    
    element.click(function(){
        if (myLayout.root.contentItems[0].getItemsById( text ).length>0)
            myLayout.root.contentItems[0].getItemsById( text )[0].remove();	
        else {
            myLayout.root.contentItems[0].addChild( newItemConfig, 0);
            myLayout.root.contentItems[0].getItemsById( text )[0].container.setSize(300);
        }
    });
};

// Define function to add components to the layout by drag
var addMenuItemDrag = function( text, icon ) {
    var element = $( '<li class="nav-item" style="cursor: move;"><i class="fa ' + icon + '" title="' + text + '"></i></li>' );
    $( '#menuContainer' ).append( element );

   var newItemConfig = {
        title: text,
        type: 'component',
        componentName: 'example',
        componentState: { text: text }
    };
  
    myLayout.createDragSource( element, newItemConfig );
};

// Add samples menu items
addMenuItem( 'Layers', 'fa-table');
addMenuItem( 'Layer-Info', 'fa-phone' );

// Add samples menu items to drag
addMenuItemDrag( 'Temperature', 'fas fa-thermometer-half');
addMenuItemDrag( 'Snow', 'fas fa-snowflake');

// Add samples menu item to create element by widget activation
$("#user").click(function() {
    let opt = {
        uri: "widgets/antus/dockable/layer-manager/widget.js"
    }
    window.es5widget.activate(opt);
})

// Add samples menu item to create element by adding element to the layout and activate widget
$("#counter").click(function() {
    var newItemConfig = {
        id: mars3d.Util.createGuid(),
        title: "Counter",
        type: 'component',
        componentName: "map-widget",
        componentState: { 
            uri: "widgets/antus/dockable/counter/widget.js",
            properties: {
                server: "http://localhost:8080/geoserver/wps",
                layer: "monitoraggio-ambientale:Comuni",
                attribute: "comune",
                function: "Count"
            }
        },
        height:20
    };
    myLayout.root.contentItems[0].addChild( newItemConfig, 0);
    if (window.widgetInit) {
        console.log("Init widget with id: " + newItemConfig.id);
        var properties = newItemConfig.componentState.properties;
        properties.id = newItemConfig.id;
        let opt = {
            uri: newItemConfig.componentState.uri,
            properties: [properties]
        }
        // activate widget
        window.es5widget.activate(opt);
    }
    myLayout.root.contentItems[0].getItemsById( newItemConfig.id )[0].container.setSize(300);
})

window.addEventListener('resize', function(event) {
    myLayout.updateSize();
}, true);



window.layout = myLayout;

