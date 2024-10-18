(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //弹窗配置
    get view() {
      return {
        type: "window",
        url: "view.html",
        windowOptions: {
          width: 250,
        },
      };
    }
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      this.viewWindow = result;
    }

    activate() {}

    disable() {
      this.viewWindow = null;
    }
    showExtent(options) {
      this.map.setCameraView(options);

      console.log("视角定位：" + JSON.stringify(options));
    }
    getThisExtent(callback) {
      var bookmark = this.map.getCameraView();

      haoutil.loading.show();
      this.map.expImage({
        download: false,
        width: 250, 
        callback: function (base64, size) {
          haoutil.loading.close();

          if (callback) {
            callback(bookmark, base64);
          }
        },
      });
      return bookmark;
    }
  }


  mars3d.widget.bindClass(MyWidget);


})(window, mars3d);
