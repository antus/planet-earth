"use script"

const parentGlobal = window.parent || window

parentGlobal.mars3d = mars3d // used in widget

function init() {
  // Determine webgl support
  if (!mars3d.Util.webglreport()) {
    mars3d.Util.webglerror()
  }

  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMGQwMTlkZC05YTMxLTQ1NGEtOGYxNC04MjllYjRiYzI3MTAiLCJpZCI6NzgzNCwiaWF0IjoxNjk1NzQxOTYzfQ.QQmu2UkajQYQwuxRT8ZZaDCktUpPwYky29HVssDwklQ';
	Cesium.GoogleMaps.defaultApiKey = 'AIzaSyAcNw0OOHz0vG1HXZCaoRIG_XsVeCg6Dlg'

  //Read the config.json configuration file
  mars3d.Util.fetchJson({ url: "/config/config.json" })
    .then(function (json) {
      console.log("Reading the config.json", json) // Print test information
      // Get language from url params
      const urlParams = new URLSearchParams(window.location.search);
      var lang = urlParams.get('lang') || "en";

      mars3d.Util.fetchJson({ url: "/config/i18n/map/" + lang + ".json" })
        .then(function (lang) {
          console.log("Reading the en.json", json)
          //Set initial language
          setLang(json, lang);

          //Create a 3D Earth scene
          const initMapFun = window.initMap ? window.initMap : globalInitMap
          var map = initMapFun(json.map3d)

          if (window.onMounted) {
            window.onMounted(map)
          }

          if (window.initUI) {
            window.initUI()
          }

          if (window.es5widget) {
            initWidget(map)
          }

        })
        .catch(function (error) {
          console.log("Reading the en.json configuration file error", error)
          globalAlert(error ? error.message : "Error loading JSON")
        })
    })
    .catch(function (error) {
      console.log("Reading the config.json configuration file error", error)
      globalAlert(error ? error.message : "Error loading JSON")
    })
}

function setLang(json, lang) {
  json.map3d.lang = lang
  json.map3d.basemaps.forEach((item) => {
    item.name = lang[item.name] || item.name
  })
  if (json.map3d.control.locationBar) {
    json.map3d.control.locationBar.template =
      "<div>lon:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div><div class='hide700'> {fps} FPS</div>"
  }
}

// Construct the map main method [required]
function globalInitMap(options) {
  if (window.mapOptions) {
    if (typeof window.mapOptions === "function") {
      options = window.mapOptions(options) || options
    } else {
      window.mapOptions = options = mars3d.Util.merge(options, window.mapOptions)
    }
  }
  if ($("#mars3dContainer")[0])
    //Create a 3D earth scene
    return new mars3d.Map("mars3dContainer", options)
  else 
    toastr.error("mars3dContainer element not present in html document!")
}

//Initialize widget related
function initWidget(map) {
  //Initialize widget manager
  mars3d.Util.fetchJson({ url: "/config/widget.json" })
    .then(function (widgets) {
      console.log("Reading the widget.json", widgets) // Print test information
      if (window.mapWidgets) {
        window.widgets = widgets = mars3d.Util.merge(widgets, window.mapWidgets)
      }
      es5widget.init(
        map,
        window.widgets,
        "/"
      )
      window.widgetInit = true;
      initLayout();
    })
    .catch(function (error) {
      console.log("Reading the widget.json configuration file error", error)
      globalAlert(error ? error.message : "Error loading JSON")
    })
}

// if layout manager is present activate widgets if present
function initLayout() {
  if (window.layout && window.es5widget) {
    console.log("Activate layout widgets... ");
    const layout = window.layout;
    const mapWidgets = layout.root.getItemsByType("component").filter((item) => item.componentName=="map-widget");
    var mapWidgetList = {};
    for (var i=0; i < mapWidgets.length; i++) {
      const mapWidget = mapWidgets[i];
      if (mapWidget.config.componentState && mapWidget.config.componentState.uri) {
        var properties = mapWidget.config.componentState.properties || {};
        properties.id = mapWidget.config.id;
        if (mapWidgetList[mapWidget.config.componentState.uri]) {
          var conf = mapWidgetList[mapWidget.config.componentState.uri];
          if (!Array.isArray(conf.properties)) {
            conf.properties = [conf.properties];
          }
          conf.properties.push(properties)
        } else {
          let opt = {
            uri: mapWidget.config.componentState.uri,
            properties: properties
          }
          mapWidgetList[mapWidget.config.componentState.uri] = opt;
        }
      }
      else
        globalAlert("Layout map-widget item with id=" + config.id + " error: missing required param componentState.uri")    
    }
    for (const [key, value] of Object.entries(mapWidgetList)) {
      //console.log(key, value);
      es5widget.activate(value);
    }
    
  }
}



// Call the message prompt of the project (disappear automatically)
function globalMsg(content) {
  if (window.layer) {
    window.layer.msg(content) // This method needs to reference layer.js
  } else if (window.toastr) {
    window.toastr.info(content) // This method needs to reference toastr
  } else {
    window.alert(content)
  }
}

// Call the pop-up window prompt of the project (manually click OK to close the window)
function globalAlert(content, title) {
  if (window.layer) {
    // This method needs to reference layer.js
    window.layer.alert(content, {
      title: title || "Tip",
      skin: "layui-layer-lan layer-mars-dialog",
      closeBtn: 0,
      anim: 0
    })
  } else if (window.toastr) {
    window.toastr.info(content, title) // This method needs to reference toastr
  } else {
    window.alert(content)
  }
}

// Call the information prompt in the upper right corner of the project (can be turned off)
function globalNotify(title, content) {
  if (window.toastr) {
    window.toastr.warning(content, title) // This method needs to reference toastr
  } else if (window.layer) {
    // This method needs to reference layer.js
    window.layer.alert(content, {
      title: title || "Tip",
      skin: "layui-layer-lan layer-mars-dialog",
      closeBtn: 0,
      anim: 0
    })
  } else {
    window.alert(content)
  }
}

function showLoading() {
  haoutil.loading.show()
}

function hideLoading() {
  haoutil.loading.close()
}
