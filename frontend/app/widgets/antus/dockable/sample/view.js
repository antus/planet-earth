class Sample {
    constructor(widget, properties) {
      this.widget = widget;
      this.properties = properties;
      this.init();
    }

    /********** Widget Initialization  **********/
    init() {
        const id = this.properties.id;
        // get the reference div 
        var refDiv = $("#" + id)[0];
        if (refDiv) {
          // Load view
          fetch(this.widget.path + "view.html")
            .then((response) => response.text())
              .then((htmlTemplate) => {
                var id=this.properties.id;
                // Substitute variables
                var html = htmlTemplate.replaceAll("${id}", id);
                $(refDiv).html( html);
                // Bind elements
                $("#test-" + id).click(function(){
                  console.log("ciao " + id);
                })
                $("#test-"+ id).text("Widget " + id + " connected!");
              });
        }
    }

    resize() {
      
    }
    /********** End of Widget Initialization  **********/
}