"use script" //It is recommended to turn on strict mode in the development environment
;(function (window, mars3d) {
  //Create a widget class, which needs to inherit BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //Pop-up window configuration
    get view() {
      return {
        type: "window",
        url: "view.html",
        windowOptions: {
          "skin": "layer-mars-dialog animation-slide-top",
          // noTitle: true,
          closeBtn: 0,
          width: 350,
          height: 500,
          show: true
        }
      }
    }

    //Initialization [executed only once]
    create() {
      //Demo, listen for events
      // es5widget.on("checkLayer", (event) => {
      //   if (!this.isActivate || !this.viewWindow) {
      //     return;
      //   }
      //   var layer = event.layer;
      //   this.viewWindow.updateNode(layer);
      // });
    }
    //Called after each window is created
    winCreateOK(opt, result) {
      this.viewWindow = result
    }
    //Open activation
    activate() {
      //Listen to events and link the check status
      this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.on(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
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
          jQuery("#layui-layer" + viewopt._layerIdx).toggleClass("animation-slide-top");
        }, index)
      }

    //Close release
    disable() {
      this.viewWindow = null

      this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.off(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
    }
    _onAddLayerHandler(e) {
      if (!this.isActivate || !this.viewWindow) {
        return
      }
      console.log("Layer added", e)

      this.viewWindow.updateNode(e.layer)
    }
    _onRemoveLayerHandler(e) {
      if (!this.isActivate || !this.viewWindow) {
        return
      }
      console.log("Layer removed", e)

      this.viewWindow.removeNode(e.layer)
    }

    getLayers() {
      return this.map.getLayers({
        basemaps: true, //Whether to take the basempas in config.json, because it is controlled by the basemap, it can be changed to false as needed in specific projects
        layers: true //Whether to take the layers in config.json
      })
    }
    //Process the clicked layer (single)
    checkClickLayer(layer, show) {
      if (show) {
        if (this.config.autoCenter && !layer.options.noCenter) {
          //Configure noCenter:true in the corresponding config.json layer node and you can not position it.
          layer.readyPromise.then(function (layer) {
            layer.flyTo()
          })
        }

        //When there is an associated widget
        let item = layer.options
        if (item.onWidget) {
          if (this._lastWidget) {
            es5widget.disable(this._lastWidget)
            this._lastWidget = null
          }

          es5widget.activate({
            uri: item.onWidget,
            layerItem: item,
            disableOther: false
          })
          this._lastWidget = item.onWidget
        }
      } else {
        if (this.config.autoCenter && !layer.options.noCenter) {
          this.map.cancelFlight()
        }

        //When there is an associated widget
        let item = layer.options
        if (item.onWidget) {
          es5widget.disable(item.onWidget)
          if (this._lastWidget == item.onWidget) {
            this._lastWidget = null
          }
        }
      }
    }

    //Update layer: show hidden state (checked layer and its sub-layers, multiple)
    updateLayerShow(layer, show) {
      layer.show = show

      if (show) {
        if (!layer.isAdded) {
          this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
          this.map.addLayer(layer)
          this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
        }
      } else {
        // if (layer.isAdded) {
        //   this.map.removeLayer(layer)
        // }
      }
    }
  }

  //Register to the widget manager.
  es5widget.bindClass(MyWidget)

  //Each widet is directly introduced into index.html, and there will be naming conflicts with each other, so the closure is used.
})(window, mars3d)
