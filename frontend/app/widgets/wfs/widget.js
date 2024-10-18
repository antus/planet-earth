"use script"; //开发环境建议开启严格模式

(function (window, mars3d) {

  var selectedItem = null; 
  //Widget
  class MyWidget extends es5widget.BaseWidget {
    
    // View
    get view() {
      return {
        type: "window",
        url: "view.html",
        windowOptions: {
          "maxmin": false,
          "resize": false
        },

      };
    }
    // Creation
    create() {
    }
    // After view creation
    winCreateOK(opt, result) {
      this.viewWindow = result;

    }


    activate() {
    }
    // de-activation
    disable() {
    }

  }
  

  // widget binding
  es5widget.bindClass(MyWidget);



  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d);