// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.309522, lng: 116.275765, alt: 69659, heading: 0, pitch: -45 },
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true // When the screenshot is black, this item needs to be set to true
      }
    }
  },
  layers: [
    {
      type: "geojson",
      name: "Sample data",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "Test Model",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
      show: true
    }
  ]
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // 3D model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tilesetLayer)

  globalNotify(
    "Known Issue Tips",
    `(1) Contains DIV partial download function. Because the current example’s special mechanism uses iframe and browser security requirements cannot download it, it can be run locally or used normally in projects without ifarme;
    `
  )

  //Create DIV data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addGraphic_06(graphicLayer)
  addGraphic_08(graphicLayer)
  addGraphic_09(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// View the scene map
function showMapImg(options = {}) {
  return map.expImage({ download: false, ...options }).then((result) => {
    return result.image
  })
}

//Download scene pictures
function downLoad() {
  map.expImage()
}

// Download scene thumbnail
function downLoad2() {
  map.expImage({
    height: 300, // Specify height or width (just specify one, the corresponding one will automatically scale)
    //width: 300, //Crop the middle part after specifying it at the same time
    download: true
  })
}

async function downLoadDiv() {
  // webgl of map DIV
  const mapImg = await map.expImage({ download: false })
  console.log("downLoadDiv: 1. Screenshot of map part successful")

  const filterNode = map.container.getElementsByClassName("cesium-viewer-cesiumWidgetContainer")

  // For other DIVs, use lib/dom2img/dom-to-image.js
  const divImg = await window.domtoimage.toPng(map.container, {
    filter: function (node) {
      return node !== filterNode[0]
    }
  })
  console.log("downLoadDiv: Partial screenshot of 2.DIV successful")

  // For other DIVs, use lib/dom2img/html2canvas.js
  // const divImg = await window.html2canvas(map.container, {
  //   ignoreElements: function (node) {
  //     return node !== filterNode[0]
  //   },
  //   backgroundColor: null,
  //   allowTaint: true
  // })
  // console.log("downLoadDiv: Partial screenshot of 2.DIV successful")

  // merge
  const newImg = await mergeImage(mapImg.image, divImg, mapImg.width, mapImg.height)
  console.log("downLoadDiv: 3. Merging 2 pictures completed")

  mars3d.Util.downloadBase64Image("Scene image_including DIV.png", newImg) // Download image
}

// Merge 2 pictures
function mergeImage(base1, base2, width, height) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    const image = new Image() // MAP image
    image.crossOrigin = "Anonymous" // Support cross-domain images
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height)

      const image2 = new Image() // div image
      image2.crossOrigin = "Anonymous" // Support cross-domain images
      image2.onload = () => {
        ctx.drawImage(image2, 0, 0, width, height)

        // Merged images
        const base64 = canvas.toDataURL("image/png")
        resolve(base64)
      }
      image2.src = base2
    }
    image.src = base1
  })
}

// Built-in extended dynamic text DivBoderLabel
function addGraphic_06(graphicLayer) {
  const graphic = new mars3d.graphic.DivBoderLabel({
    position: [116.460722, 31.140888, 781],
    style: {
      text: "Mars Technology Mars3D Platform",
      font_size: 15,
      font_family: "Microsoft Yahei",
      color: "#ccc",
      boderColor: "#15d1f2"
    }
  })
  graphicLayer.addGraphic(graphic)
}

// Custom html similar to popup/toolitp
function addGraphic_08(graphicLayer) {
  const graphic = new mars3d.graphic.Popup({
    position: [116.146461, 31.380152, 395.1],
    style: {
      html: `You can put any html code here<br /> Popup and Tooltip are also inherited from DivGraphic`,
      closeButton: false,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // Display according to viewing distance

      // Style when highlighted
      highlight: {
        type: mars3d.EventType.click,
        className: "mars-popup-highlight"
      }
    }
  })
  graphicLayer.addGraphic(graphic)
}

//Panel style tilted to the lower left corner
function addGraphic_09(graphicLayer) {
  const graphic = new mars3d.graphic.DivGraphic({
    position: [116.138686, 31.101009, 1230],
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-red">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">Mars Water Plant</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">Real-time traffic:</div>
                              <div class="data-value"><span id="lablLiuliang" class="label-num">39</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Sink level:</div>
                              <div class="data-value"><span id="lablYeWei"  class="label-num">10.22</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water pump status:</div>
                              <div class="data-value">
                                <span id="lablSBZT1" class="label-tag data-value-status-1" title="Intermediate status">No. 1</span>
                                <span id="lablSBZT2" class="label-tag data-value-status-0" title="Close status">No. 2</span>
                                </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water outlet valve:</div>
                              <div class="data-value">
                                <span id="lablCSFM1" class="label-tag data-value-status-1" title="Intermediate status">No. 1</span>
                                <span id="lablCSFM2" class="label-tag data-value-status-2" title="Open status">No. 2</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // Display according to viewing distance
      scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
      clampToGround: true
    },
    attr: { remark: "Example 9" },
    pointerEvents: false // When false, no mouse events are allowed to be picked up and triggered, but the earth can be zoomed through the div.
  })
  graphicLayer.addGraphic(graphic)

  // Refresh the local DOM without affecting the operation of other controls on the panel
  // [It is recommended to actively modify the DOM after reading the back-end interface data, which is more efficient than the real-time refresh demonstrated below]
  graphic.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // DOM corresponding to popup

    const lablLiuliang = container.querySelector("#lablLiuliang")
    if (lablLiuliang) {
      lablLiuliang.innerHTML = (Math.random() * 100).toFixed(0) // Random number for testing
    }

    const lablYeWei = container.querySelector("#lablYeWei")
    if (lablYeWei) {
      lablYeWei.innerHTML = mars3d.Util.formatDate(new Date(), "ss.S") // Random number for testing
    }
  })
}
