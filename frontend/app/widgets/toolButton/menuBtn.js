;(function (window, mars3d) {
  //Create a widget class, which needs to inherit BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //Initialization [executed only once]
    create() {
      this.zommControl = new mars3d.control.ToolButton({
        title: "Layer Control",
        icon: "fa fa-tasks",
        insertIndex: 1, //Insertion position sequence, 1 is behind the home button
        click: (event) => {
          es5widget.activate({
            name: event.title,
            uri: "widgets/manageLayers/widget.js"
          })
        }
      })
      this.map.addControl(this.zommControl)
    }
    //Activate plugin
    activate() {}
    //Release the plug-in
    disable() {}
  }

  //Register to the widget manager.
  es5widget.bindClass(MyWidget)

  //Each widet is directly introduced into index.html, and there will be naming conflicts with each other, so the closure is used.
})(window, mars3d)
