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

  map.on(mars3d.EventType.tooltipOpen, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("Tooltip (global monitoring) is turned on", event)
  })
  map.on(mars3d.EventType.tooltipClose, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("Tooltip (global monitoring) is closed", event)
  })

  bindLayerDemo2()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
  removeDemoLayer()
}

function removeDemoLayer() {
  graphicLayer.clear()

  if (geoJsonLayer) {
    geoJsonLayer.remove(true)
    geoJsonLayer = null
  }
}

// 1. Bind the Tooltip on the map and move it into the information window
function bindMapDemo() {
  removeDemoLayer()

  //Close pop-up window
  map.closeTooltip()

  // Pass in the coordinates and content, and you can pop it up directly.
  const position = [116.328539, 30.978731, 1521]
  map.openTooltip(position, "I popped up directly on the map")
}

// 2. Bind the Tooltip pop-up window on the layer layer
function bindLayerDemo() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(geoJsonLayer)

  // Bind the Tooltip pop-up window on the layer
  geoJsonLayer.bindTooltip(function (event) {
    const attr = event.graphic.attr
    return attr.type + "I am the Tooltip bound to the layer"

    // return new Promise((resolve) => {
    // //Here you can request data from the backend interface, and setTimeout tests asynchronously
    //   setTimeout(() => {
    // resolve('Pop-up content information displayed by Promise asynchronous callback')
    //   }, 2000)
    // })
  })

  geoJsonLayer.on(mars3d.EventType.tooltipOpen, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("Tooltip is opened on the layer", container)
  })
  geoJsonLayer.on(mars3d.EventType.tooltipClose, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("tooltip removed from layer", container)
  })

  // geoJsonLayer.on(mars3d.EventType.popupOpen, function (event) {
  // const container = event.container // DOM corresponding to popup
  // console.log("popup is opened on the layer", container)
  // })
  // geoJsonLayer.on(mars3d.EventType.popupClose, function (event) {
  // const container = event.container // DOM corresponding to popup
  // console.log("popup removed from layer", container)
  // })
}

// 2. Predefine the Popup click pop-up window on the layer layer
function bindLayerDemo2() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
    //Tooltip is configured by attribute field, which can be a string template or array
    // tooltip: 'all', //Display all attributes, often used for testing
    // tooltip: '{name} {type}',
    tooltip: [
      { field: "id", name: "encoding" },
      { field: "name", name: "name" },
      { field: "type", name: "type" },
      {
        type: "html",
        html: "<label>Video</label><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style=\"width: 300px;\" ></video >"
      }
    ],
    tooltipOptions: {
      // direction: "top"
    }
  })
  map.addLayer(geoJsonLayer)
}

// 2. Bind the Tooltip pop-up window on the layer layer
function bindLayerTemplateDemo() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(geoJsonLayer)

  // Bind the Tooltip pop-up window on the layer
  geoJsonLayer.bindTooltip(
    function (event) {
      const attr = event.graphic.attr
      return "I am a custom template Tooltip bound to the layer<br />" + attr.type
    },
    {
      template: `<div class="marsBlackPanel">
                        <div class="marsBlackPanel-text">{content}</div>
                      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  )

  geoJsonLayer.on(mars3d.EventType.tooltipOpen, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("Tooltip is opened on the layer", container)
  })
  geoJsonLayer.on(mars3d.EventType.tooltipClose, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("tooltip removed from layer", container)
  })
}

// 3. Bind the Tooltip pop-up window to the graphic data
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
                <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">graphic.bindTooltip</th></tr>
                <tr><td >Instructions: </td><td >Move the Tooltip mouse into the information pop-up window </td></tr>
                <tr><td >Method: </td><td >Can bind any html </td></tr>
                <tr><td >Remarks:</td><td >I am a Tooltip bound to the graphic</td></tr>
              </table>`
    return inthtml
  }

  // Bind Tooltip
  graphic.bindTooltip(getInnerHtml, { direction: "right" }).openTooltip()

  graphic.on(mars3d.EventType.tooltipOpen, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("tooltip opened", container)
  })
  graphic.on(mars3d.EventType.tooltipClose, function (event) {
    const container = event.container // DOM corresponding to tooltip
    console.log("Tooltip removed", container)
  })
}

// 3. Bind the Tooltip pop-up window to the graphic data
function bindGraphicDemo2() {
  removeDemoLayer()

  const graphic = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.328539, 30.978731, 1521),
    style: {
      image: "img/marker/point-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        text: "Demonstration of Tooltip partial update binding",
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
                <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">graphic.bindTooltip partial refresh</th></tr>
                <tr><td >Instructions: </td><td >Move the Tooltip mouse into the information pop-up window </td></tr>
                <tr><td >Method: </td><td >Can bind any html </td></tr>
                <tr><td >Remarks:</td><td >I am a Tooltip bound to the graphic</td></tr>
                <tr><td >Time:</td><td id="tdTime"></td></tr>
                <tr><td colspan="4" style="text-align:right;cursor: pointer;"><button id="btnDetails">More</button></td></tr>
              </table>`

  graphic.on(mars3d.EventType.tooltipOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup opened", container)

    const btnDetails = container.querySelector("#btnDetails")
    if (btnDetails) {
      btnDetails.addEventListener("click", (e) => {
        showXQ()
      })
    }
  })

  // Refresh the local DOM without affecting other control operations of the tooltip panel
  graphic.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // DOM corresponding to tooltip

    const tdTime = container.querySelector("#tdTime")
    if (tdTime) {
      const date = mars3d.Util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss S")
      tdTime.innerHTML = date
    }
  })
  // Bind Tooltip
  graphic.bindTooltip(innerHtml, { offsetY: -30, pointerEvents: true }).openTooltip()
}

// Just for demonstration, you can click on details
function showXQ() {
  const showHistoryLayer = true
  eventTarget.fire("showWebsite", { showHistoryLayer })
}
