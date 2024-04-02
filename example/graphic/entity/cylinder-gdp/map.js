// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.286465, lng: 117.620524, alt: 510892, heading: 358, pitch: -50 }
  },
  layers: [
    {
      id: 1987,
      type: "geojson",
      name: "Huaihai Economic Zone 11 Cities",
      url: "//data.mars3d.cn/file/geojson/huaihai.json",
      symbol: {
        styleOptions: {
          materialType: mars3d.MaterialType.PolyGradient,
          materialOptions: {
            color: "#3388cc",
            opacity: 0.7,
            alphaPower: 1.3,
            isInner: false
          },
          height: 0,
          diffHeight: "{gdp}"
        },
        styleField: "Name",
        styleFieldOptions: {
          Jining City: { materialOptions: { color: "#D4AACE" } },
          Linyi City: { materialOptions: { color: "#8DC763" } },
          Heze City: { materialOptions: { color: "#F7F39A" } },
          Zaozhuang City: { materialOptions: { color: "#F7F39A" } },
          Xuzhou City: { materialOptions: { color: "#96F0F1" } },
          Suqian City: { materialOptions: { color: "#EAC9A8" } },
          Lianyungang City: { materialOptions: { color: "#F7F39A" } },
          Shangqiu City: { materialOptions: { color: "#D4AACE" } },
          Suzhou City: { materialOptions: { color: "#8DC763" } },
          Bozhou City: { materialOptions: { color: "#96F0F1" } },
          Huaibei City: { materialOptions: { color: "#EAC9A8" } }
        }
      },
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  map.basemap = 2017 // blue basemap

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/huaihai-jj.json" })
    .then(function (res) {
      conventChartsData(res.data) // Click the displayed popup
      showYearZT(res.data) // Histogram
      bindHaihuaiPopup()
    })
    .catch(function () {
      globalMsg("Failed to obtain information, please try again later")
    })

  map.on(mars3d.EventType.load, function (event) {
    console.log("Vector data object loading completed", event)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Show the vertebrae of a certain year
 *
 * @param {object} data Data obtained through JSON
 * @returns {void} None
 */
function showYearZT(data) {
  const yearArr = Object.keys(data)
  const arr = data[yearArr[0]]

  for (let i = 0; i < arr.length; i += 1) {
    const attr = arr[i]
    const jwd = getJWDByName(attr.name)

    const num1 = attr["Primary Industry"]
    const num2 = attr["Second Industry"]
    const num3 = attr["Third Industry"]
    const numall = Number(num1 + num2 + num3).toFixed(2)
    const html = `${attr.name}<br/>
                  <span style="color:#FF6D5D">Primary industry: ${num1}</span><br/>
                  <span style="color:#FFB861">Second industry: ${num2}</span><br/>
                  <span style="color:#63AEFF">Tertiary industry: ${num3}</span>`

    const height1 = Math.floor(num1 * 10)
    const height2 = Math.floor(num2 * 10)
    const height3 = Math.floor(num3 * 10)

    const p1 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 / 2)
    const p2 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 + height2 / 2)
    const p3 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 + height2 + height1 / 2)

    //Add cylinder
    createZT(p1, height3, "#63AEFF", html)
    createZT(p2, height2, "#FFB861", html)
    createZT(p3, height1, "#FF6D5D", html)

    // add text
    const graphic = new mars3d.graphic.LabelPrimitive({
      position: Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height1 + height2 + height3),
      style: {
        text: numall,
        font_size: 18,
        font_family: "楷体",
        color: "#00ff00",
        outline: true,
        outlineColor: "#000000",
        outlineWidth: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20)
      }
    })
    graphicLayer.addGraphic(graphic)
    graphic.bindTooltip(html)
  }
}

//Create cylinder
function createZT(position, len, color, html) {
  const graphic = new mars3d.graphic.CylinderEntity({
    position,
    style: {
      length: len,
      topRadius: 6000.0,
      bottomRadius: 6000.0,
      color
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindTooltip(html)

  // graphic._position_show = position
  // graphic._length_show = len
  return graphic
}

const cityPosition = [
  { name: "Bozhou", jwd: [116.203602, 33.496075] },
  { name: "Shangqiu", jwd: [115.871509, 34.297084] },
  { name: "Huaibei", jwd: [116.688413, 33.689214] },
  { name: "Suzhou", jwd: [117.234682, 33.740035] },
  { name: "Xuzhou", jwd: [117.70509, 34.350708] },
  { name: "Suqian", jwd: [118.559349, 33.807355] },
  { name: "Lianyungang", jwd: [118.875445, 34.619808] },
  { name: "Linyi", jwd: [118.026908, 35.262767] },
  { name: "Zaozhuang", jwd: [117.320268, 35.072555] },
  { name: "Jining", jwd: [116.856599, 35.500232] },
  { name: "Heze", jwd: [115.716086, 35.05629] }
]

// Get coordinates based on name
function getJWDByName(name) {
  for (let i = 0; i < cityPosition.length; i += 1) {
    const item = cityPosition[i]
    if (item.name === name) {
      return item.jwd
    }
  }
  return []
}

//= ===============The following is the relevant code for the echarst chart displayed by clicking ===============
let arrYear
let objCity = {}

//Convert value
function conventChartsData(arrOld) {
  console.log("Data before conversion=>", arrOld)

  arrYear = Object.keys(arrOld) // [Year]

  objCity = {} // Annual data corresponding to eleven cities

  for (let a = 0; a < arrYear.length; a++) {
    const arrCity = arrOld[arrYear[a]] //Specify the corresponding data of 11 cities in a certain year

    // Loop ten times
    for (let b = 0; b < arrCity.length; b++) {
      const item = arrCity[b]

      if (!objCity[item.code]) {
        objCity[item.code] = []
      }
      objCity[item.code].push(item.GDP)
    }
  }

  console.log("Converted data =>", objCity)
}

function bindHaihuaiPopup() {
  const layerHuaihai = map.getLayerById(1987) // Get the corresponding layer in config.json

  // Bind the Popup click popup window to the layer
  layerHuaihai.bindPopup(
    `<div class="gdpView">
        <div class="gdpCharts" id="gdpCharts"></div>
        <input type="button" class="btnClosePopup closeButton" value="×" />
      </div>`,
    {
      template: false,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  )

  let gdpCharts
  layerHuaihai.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup is opened on the layer", container)

    const option = getCityChartsOptions(event.graphic.attr)
    if (!option) {
      return
    }

    gdpCharts = echarts.init(container.querySelector("#gdpCharts"))
    gdpCharts.setOption(option)
  })
  layerHuaihai.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // DOM corresponding to popup
    console.log("popup removed from layer", container)

    gdpCharts.dispose()
    gdpCharts = null
  })
}

function getCityChartsOptions(attr) {
  const code = attr.code.slice(0, 4)
  const arrGDPvalues = objCity[code]
  if (!arrGDPvalues) {
    globalMsg(attr.Name + "No economic data")
    return
  }

  // arrGDPvalues ​​is the value of the clicked city and needs to be rearranged in the form of [b,0,value]
  const arrData = []
  for (let b = 0; b < arrGDPvalues.length; b++) {
    arrData[b] = [b, 0, arrGDPvalues[b]]
  }

  const option = {
    visualMap: {
      max: 4500,
      show: false,
      inRange: {
        color: ["#32C5E9", "#67E0E3", "#FFDB5C", "#37A2DA", "#9FE6B8"]
      }
    },
    title: {
      text: attr.Name + "GDP in the past five years (100 million yuan)",
      textStyle: { color: "white", fontSize: "17", fontWidth: "normal" },
      top: "10",
      left: "5"
    },
    tooltip: {
      show: "true",
      trigger: "item",
      showContent: "true",
      position: "top",
      fontSize: "12",
      color: "black",
      formatter: function formatter(params) {
        return "GDP:" + params.data[2]
      }
    },
    // The x-axis is horizontal and is time
    xAxis3D: {
      type: "category",
      data: arrYear,
      nameTextStyle: {
        color: "rgb(0, 0, 0, 0.1)"
      },
      // When splitLine is not visible, only the line is not visible.
      splitLine: {
        show: false
      }
    },
    // The y-axis is scaled down
    yAxis3D: {
      type: "category",
      data: [" "],
      nameTextStyle: {
        color: "rgb(0, 0, 0, 0.1)"
      },
      splitLine: {
        show: false
      }
    },
    //The z-axis is the value of GDP
    zAxis3D: {
      type: "value",
      name: "GDP",
      axisLine: {
        lineStyle: {
          color: "rgb(0, 0, 0, 0.1)"
        }
      },
      nameTextStyle: {
        color: "white",
        fontSize: "18"
      },
      nameGap: "50"
    },
    grid3D: {
      boxWidth: 180, // Zoom in and out of the x-axis
      boxDepth: 10, // Zoom in and out of the y-axis
      top: "20",
      // left: '50',
      // Setting of perspective
      viewControl: {
        alpha: 8,
        beta: 0,
        distance: 162,
        center: [-20, 0, 0]
      },
      axisLabel: {
        color: "white",
        fontSize: 15
      },
      axisPointer: {
        // The coordinate axis indicator line is the line pointing to the x-axis and y-axis when the mouse is moved in
        show: false
      }
    },
    series: [
      {
        type: "bar3D",
        data: arrData,
        shading: "lambert",
        label: {
          position: "top",
          show: true,
          color: "white"
        },
        emphasis: {
          label: {
            color: "white",
            fontSize: "18"
          }
        }
      }
    ]
  }
  return option
}
