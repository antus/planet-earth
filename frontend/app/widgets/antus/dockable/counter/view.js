class Counter {
    constructor(widget, properties) {
      this.widget = widget;
      this.properties = properties;
      this.init();
    }

    /********** Widget Initialization  **********/
    init() {
        console.log("Init Component obj with id: " + this.properties.id)
        if (this.widget.map) {
            // Set camera channge listener
            this.widget.map.on(mars3d.EventType.cameraChanged, this.refresh, this)
            this.widget.map.on(mars3d.EventType.cameraMoveEnd, this.refresh, this)
        }
        const id = this.properties.id;
        // get the reference div 
        var refDiv = $("#" + id)[0];
        if (refDiv) {
            // Load view
            fetch(this.widget.path + "view.html")
            .then((response) => response.text())
                .then((htmlTemplate) => {
                    var id = this.properties.id;
                    // Substitute variables
                    var html = htmlTemplate.replaceAll("${id}", id);
                    $(refDiv).html( html);
                    // init component              
                    this.initPayload();
                });
        }
    }
    
    // Init payload
    initPayload() {
        // load payload template
        fetch(this.widget.path+ "payload.xml")
        .then((response) => response.text())
        .then((xmlString) => {
            // Set payload template
            this.properties.payloadTemplate = xmlString;
            this.refresh();
            this.resize();
        });
    }
        
    // Call the WPS  
    refresh() {
        if (this.widget.map) {
            if (this.properties.payloadTemplate) {
                const properties = this.properties;
                const extent = this.widget.map.getExtent({scale:-0.1});
                const bbox =  extent.xmin + " " + extent.ymin + " " +
                            extent.xmin + " " + extent.ymax + " " + 
                            extent.xmax + " " + extent.ymax + " " + 
                            extent.xmax + " " + extent.ymin + " " + 
                            extent.xmin + " " + extent.ymin;
                var xmlString = properties.payloadTemplate;                
                xmlString = xmlString.replace("$layer", properties.layer);
                xmlString = xmlString.replace("$attribute", properties.attribute);
                xmlString = xmlString.replace("$function", properties.function);
                xmlString = xmlString.replace("$bbox", bbox);
                //console.log(xmlString);
                var url = properties.server + "?service=WPS&version=1.0.0&REQUEST=Execute"
                // Send the data using post
                $.ajax({
                url: 'http://localhost:8888/' + url,
                data: xmlString, 
                type: 'POST',
                contentType: "application/xml",
                dataType: "text",
                success : function(result) {
                    const res = JSON.parse(result);
                    $("#dcounter-result-" + properties.id).text(res.AggregationResults[0][0]);
                },
                error : function (xhr, ajaxOptions, thrownError){  
                    console.log(xhr.status);          
                    console.log(thrownError);
                } 
                }); 
            }
        }
    }

    resize(){
        var fontSize = parseInt($("#dcounter-" + this.properties.id).width()/4)+"px";
        $("#dcounter-result-" + this.properties.id).css('font-size', fontSize);
    };
    /********** End of Widget Initialization  **********/


  }