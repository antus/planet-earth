"use script" //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //弹窗配置，2个弹窗的情形
    get resources() {
      return ["view.css"]
    }

    get view() {
      return [
        {
          type: "window",
          url: "viewLeftTop.html",
          name: "leftTop",
          windowOptions: {
            skin: "layer-mars-dialog fadein-left",
            noTitle: false,
            title: "Infrared cam 1",
            closeBtn: 1,
            width: "23%",
            height:"34%",
            position: {
              top: "7%",
              left: "1%"
            },
            show: false
          }
        },
        {
          type: "window",
          url: "viewLeftMiddle.html",
          name: "leftMiddle",
          windowOptions: {
            skin: "layer-mars-dialog fadein-left",
            noTitle: false,
            title: "Infrared cam 1",
            closeBtn: 1,
            width: "23%",
            height:"24%",
            position: {
              top: "42%",
              left: "1%"
            },
            show: false
          }
        },
        {
          type: "window",
          url: "viewLeftBottom.html",
          name: "leftBottom",
          windowOptions: {
            skin: "layer-mars-dialog fadein-left",
            noTitle: false,
            title: "Radar",
            closeBtn: 1,
            width: "20%",
            height:"32%",
            position: {
              top: "7%",
              right: "1%"
            },
            show: false
          }
        },
        {
          type: "window",
          url: "viewBottomLeft.html",
          name: "BottomLeft",
          windowOptions: {
            skin: "layer-mars-dialog fadein-up",
            noTitle: false,
            title: "Impact analysis",
            closeBtn: 1,
            width:"32%",
            height:"26%",
            position: {
              bottom: 57,
              left: "1%",
            },
            show: false
          }
        },
        {
          type: "window",
          url: "viewBottomRight.html",
          name: "bottomRight",
          windowOptions: {
            skin: "layer-mars-dialog fadein-up",
            noTitle: false,
            title: "Oil level",
            closeBtn: 1,
            width:"32%",
            height:"26%",
            position: {
              bottom: 57,
              left: "34%",
            },
            show: false
          }
        },
        {
          type: "window",
          url: "viewRight.html",
          name: "right",
          windowOptions: {
            skin: "layer-mars-dialog fadein-right",
            noTitle: false,
            title: "Wind",
            closeBtn: 1,
            width:"32%",
            height:"26%",
            position: {
              bottom: 57,
              right: "1%",
              left: "67%",
            },
            show: false
          }
        }
      ]
    }

    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
    }
    //打开激活
    activate() {

    }
    //关闭释放
    disable() {}

    setViewShow(show, index) {
      this.eachView(function (viewopt) {
        if (show==null){
          if (!jQuery(viewopt._dom).hasClass("dashboard-show"))
            es5widget.fire("left-panel", {"panel":"panel"});
          if (!jQuery(viewopt._dom).is(':visible')) 
            jQuery(viewopt._dom).show();
          else
            jQuery(viewopt._dom).hide();
        } else {
          if (show)
            jQuery(viewopt._dom).addClass("dashboard-show");
          else
          jQuery(viewopt._dom).removeClass("dashboard-show");
        }
      }, index)
    }

    testCenterAt1() {
      this.map.setCameraView({ y: 31.981816, x: 118.782446, z: 10607.4, heading: 5.5, pitch: -51.9, roll: 0 })
    }
    testCenterAt2() {
      this.map.setCameraView({ y: 31.686288, x: 117.229619, z: 11333.9, heading: 359.2, pitch: -39.5, roll: 360 })
    }
  }

  //注册到widget管理器中。
  es5widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
