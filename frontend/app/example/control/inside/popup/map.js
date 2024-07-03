// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let geoJsonLayer // Vector layer object, used for layer binding display
let graphicLayer // Vector layer object, used for graphic binding display

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  map.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup (global monitoring) is turned on", event)
  })
  map.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup (global listening) is closed", event)
  })

  bindLayerDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeDemoLayer() {
  graphicLayer.clear()

  if (geoJsonLayer) {
    geoJsonLayer.remove(true)
    geoJsonLayer = null
  }
}

// 1. Bind the Popup click pop-up window on the map
function bindMapDemo() {
  removeDemoLayer()

  //Close pop-up window
  map.closePopup()

  // Pass in the coordinates and content, and you can pop it up directly.
  const position = [116.328539, 30.978731, 1521]
  map.openPopup(position, "I pop up directly on the map")
}

// 2. Bind Popup to the layer layer and click the pop-up window.
function bindLayerDemo() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(geoJsonLayer)

  // Bind the Popup click popup window to the layer
  geoJsonLayer.bindPopup(
    function (event) {
      const attr = event.graphic.attr
      return attr.type + "I am the Popup bound on the layer" + new Date().toLocaleTimeString()

      // return new Promise((resolve) => {
      // // Here you can request data from the backend interface, and setTimeout tests asynchronously
      //   setTimeout(() => {
      // resolve("Pop-up content information displayed by Promise asynchronous callback")
      //   }, 2000)
      // })
    },
    { timeRender: true, closeButton: false } // timeRender refreshes in real time
  )

  // geoJsonLayer.on(mars3d.EventType.click, function (event) {
  //   setTimeout(() => {
  //     const popup = event.graphic.getPopup()
  // console.log("Test to get popup", popup)
  //   }, 1000)
  // })

  geoJsonLayer.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup is opened on the layer", container)
  })
  geoJsonLayer.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup removed from layer", container)
  })
}

// 2. Predefine the Popup click pop-up window on the layer layer
function bindLayerDemo2() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
    // Popup is configured by attribute field, which can be a string template or array
    // popup: 'all', //Display all attributes, often used for testing
    // popup: '{name} {type}',
    popup: [
      { field: "id", name: "encoding" },
      { field: "name", name: "name" },
      { field: "type", name: "type" },
      {
        type: "html",
        html: "<label>Video</label><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style=\"width: 300px;\" ></video >"
      }
    ],
    popupOptions: {
      autoCenter: true
    }
  })
  map.addLayer(geoJsonLayer)
}

// 2. Bind Popup to the layer layer and click the pop-up window.
function bindLayerTemplateDemo() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(geoJsonLayer)

  // Bind the Popup click popup window to the layer
  geoJsonLayer.bindPopup(
    function (event) {
      const attr = event.graphic.attr
      return "I am a custom template Popup<br /> bound to the layer" + attr.type
    },
    {
      template: `<div class="marsBlackPanel animation-spaceInDown">
                        <div class="marsBlackPanel-text">{content}</div>
                        <span class="mars3d-popup-close-button closeButton" >×</span>
                      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  )

  geoJsonLayer.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup is opened on the layer", container)
  })
  geoJsonLayer.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup removed from layer", container)
  })
}

// 3. Bind Popup to the graphic data and click the pop-up window to partially refresh.
function bindGraphicDemo1() {
  removeDemoLayer()

  const graphic = new mars3d.graphic.BoxEntity({
    position: new mars3d.LngLatPoint(116.328539, 30.978731, 1521),
    style: {
      dimensions: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      fill: true,
      color: "#00ff00",
      opacity: 0.9,
      label: {
        text: "Demonstration of graphic binding",
        font_size: 19,
        pixelOffsetY: -45,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)

  function getInnerHtml(event) {
    // let attr = event.graphic.attr
    const inthtml = `<table style="width:280px;">
                <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">graphic.bindPopup</th></tr>
                <tr><td >Instructions: </td><td >Popup mouse click information pop-up window 1 </td></tr>
                <tr><td >Method: </td><td >Can bind any html </td></tr>
                <tr><td >Remarks:</td><td >I am a Popup bound to the graphic</td></tr>
                <tr><td colspan="4" style="text-align:right;cursor: pointer;"><button id="btnDetails">More</button></td></tr>
              </table>`
    return inthtml
  }

  graphic.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup opened", container)

    const btnDetails = container.querySelector("#btnDetails")
    if (btnDetails) {
      btnDetails.addEventListener("click", (e) => {
        showXQ()
      })
    }
  })
  graphic.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup removed", container)
  })

  // Bind Popup
  graphic.bindPopup(getInnerHtml).openPopup()
}

// 4. Bind the Popup click pop-up window to the graphic data
function bindGraphicDemo2() {
  removeDemoLayer()

  const graphic = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.328539, 30.978731, 1521),
    style: {
      image: "img/marker/point-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        text: "Demonstration of Popup partial update binding",
        font_size: 18,
        font_family: "楷体",
        pixelOffsetY: -45,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)

  const innerHtml = `<table style="width:280px;">
                <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">graphic.bindPopup partial refresh</th></tr>
                <tr><td >Instructions: </td><td >Popup mouse click information pop-up window 2 </td></tr>
                <tr><td >Method: </td><td >Can bind any html </td></tr>
                <tr><td >Remarks:</td><td >I am a Popup bound to the graphic</td></tr>
                <tr><td >Time:</td><td id="tdTime"></td></tr>
                <tr><td colspan="4" style="text-align:right;cursor: pointer;"><button id="btnDetails">More</button></td></tr>
              </table>`

  graphic.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    const btnDetails = container.querySelector("#btnDetails")
    if (btnDetails) {
      btnDetails.addEventListener("click", (e) => {
        showXQ()
      })
    }
  })

  // Refresh the local DOM without affecting the operations of other controls in the popup panel.
  graphic.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // DOM corresponding to popup
    const tdTime = container.querySelector("#tdTime")
    if (tdTime) {
      const date = mars3d.Util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss S")

      tdTime.innerHTML = date
    }
  })

  // Bind Popup
  graphic.bindPopup(innerHtml, { offsetY: -30, closeOnClick: false, autoClose: false }).openPopup()
}

// Just for demonstration, you can click on details
function showXQ() {
  const showHistoryLayer = true
  eventTarget.fire("showWebsite", { showHistoryLayer })
}

// Bind popup to the original ceisum object
function bindCesiumEntityDemo() {
  const blueBox = map.viewer.entities.add({
    name: "Blue box",
    position: Cesium.Cartesian3.fromDegrees(116.316945, 30.893873, 1000),
    box: {
      dimensions: new Cesium.Cartesian3(4000.0, 3000.0, 5000.0),
      material: Cesium.Color.BLUE
    }
  })

  const innerHtml = `<table style="width:280px;">
    <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">Bind popup to the original ceisum object</th></tr>
    <tr><td >Description: </td><td >Bind popup to the original ceisum object </td></tr>
    <tr><td >Method: </td><td >Can bind any html </td></tr>
    <tr><td >Remarks:</td><td>I am binding the popup in the original ceisum object</td></tr>
  </table>`

  blueBox._popupConfig = {
    content: innerHtml, // Support callback method, same as the first parameter of bindPopup
    options: { offsetY: -30, closeOnClick: false, autoClose: false } // Same as the second parameter of bindPopup
  }
}
