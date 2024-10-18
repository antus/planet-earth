"use script" 
;(function (window, mars3d) {
  
  class MyWidget extends es5widget.BaseWidget {
    
    get view() {
      return {
        type: "window",
        url: "view.html",
        windowOptions: {
          width: "400",
          height:"500",
          position: {
            top: "60",
            right: "10"
          }
        }
      }
    }
  
    create() {}
  
    winCreateOK(opt, result) {
      this.viewWindow = result
    }
  
    activate() {
        // this.viewWindow.testIframeFun();
    }
  
    disable() {
      this.viewWindow = null
    }

  }

  
  es5widget.bindClass(MyWidget)

  
})(window, mars3d)


