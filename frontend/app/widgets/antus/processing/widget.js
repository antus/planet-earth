"use script" //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ["view.css"]
    }
    //页面配置， append是添加DOM节点到html中的方式
    get view() {
      return {
        type: "append",
        url: "view.html"
      }
    }

    //初始化[仅执行1次]
    create() {}
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      //此处可以绑定页面dom事件
    }
    //激活插件
    activate() {
      toastr.info("Processing widget activated");
      $("#processing-close-button").click(() => {
        this.setViewShow(null, null);
      });
      es5widget.on("left-panel", (event) => {
        console.log("Processing widget - left-panel event fetched: " + event.panel);
        var panelName = event.panel;
        if (panelName!="processing")
          this.setViewShow(false, null);
      });
    }
    //释放插件
    disable() {
      toastr.info("Processing widget disabled")
    }

    /**
     * 设置view弹窗的显示和隐藏，基于修改css实现
     *
     * @param {boolean} show 是否显示
     * @param {number} [index] 当有多个view时，可以指定单个操作的view的index
     * @return {void}  无
     */
    setViewShow(show, index) {
      this.eachView(function (viewopt) {
        if (show==null){
          if (!jQuery(viewopt._dom).hasClass("panel-show"))
            es5widget.fire("left-panel", {"panel":"processing"});
          jQuery(viewopt._dom).toggleClass("panel-show");

        } else {
          if (show)
            jQuery(viewopt._dom).addClass("panel-show");
          else
          jQuery(viewopt._dom).removeClass("panel-show");
        }
      }, index)
    }

  }

  //注册到widget管理器中。
  es5widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
