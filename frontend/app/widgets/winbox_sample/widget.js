"use script";
(function (window, mars3d) {
  class MyWidget extends es5widget.BaseWidget {
    
    get resources() {
      return ["/widgets/winbox_sample/view.css"
			 ];
    }
	
	get view() {
      return {
        type: "append",
        url: "/widgets/winbox_sample/view.html",
      };
    }
	
    create() {}
	
    winCreateOK(opt, result) {
    }
	
    activate() {
		this.closing = false;
		this.winbox = new WinBox("Windows With Options", {
			// unique ID
			//id: "my-window",
			// root element
			root: this.config.parent!=null?document.getElementById(this.config.parent):"body",
			// modal mode
			modal: false,
			// background color
			background: this.config.properties.background || "#1e243299",
			// margin width
			border: this.config.properties.border || 0,
			// width/height
			width: this.config.properties.width || 400,
			height: this.config.properties.height || 300,
			// x/y position
			x: this.config.properties.x || "center",
			y: this.config.properties.y || "center",
			top:this.config.properties.top || 50,
			left:this.config.properties.left || 0,
			bottom:this.config.properties.bottom || 26,
			right:this.config.properties.right || 0,
		    onclose: function(){
				if (!winbox_widget.closing) {
					winbox_widget.closing = true;
					mars3d.widget.disable("widgets/winbox_sample/widget.js");
					winbox_widget.closing = false;
				}
				
			},
			class: this.config.properties.class || [
				//"no-min",
				//"no-max",
				//"no-full",
				//"no-close"
			],
			// maximize the dialog on init
			max: false,
			//mount: document.getElementById("winbox_element")
			url: "https://nextapps-de.github.io/winbox/"
		});
		$("#winbox_element").css("display", "block");
		//toastr.info("winbox sample activate");
    }
    disable() {
		//toastr.info("winbox sample disable");
		$("#view_winbox_sample").toggleClass('fa-eye-slash');
		$("#view_winbox_sample").toggleClass('fa-eye');
		if (!this.closing) {
			this.closing = true;
			this.winbox.close();
			this.closing = false;
		}
    }
  }

  winbox_widget = es5widget.bindClass(MyWidget);

})(window, mars3d);
