// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 32.246011, lng: 119.666969, alt: 317736, heading: 0, pitch: -90 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  //Create div layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const arrData = [
    {
      name: "Nantong City",
      totalLength: 233991,
      deepUsedLength: 51077,
      deepUnUsedLength: 131008,
      unDeepUsedLength: 28579,
      unDeepUnUsedLength: 23327,
      lng: 120.8372039,
      lat: 32.000300065
    },
    {
      name: "Nanjing City",
      totalLength: 91025,
      deepUsedLength: 36909,
      deepUnUsedLength: 12551,
      unDeepUsedLength: 28251,
      unDeepUnUsedLength: 13313,
      lng: 118.735996333,
      lat: 32.089238239
    },
    {
      name: "Zhenjiang City",
      totalLength: 147431,
      deepUsedLength: 35499,
      deepUnUsedLength: 52026,
      unDeepUsedLength: 18359,
      unDeepUnUsedLength: 41547,
      lng: 119.615400712,
      lat: 32.182042328
    },
    {
      name: "Yangzhou City",
      totalLength: 49649,
      deepUsedLength: 30245,
      deepUnUsedLength: 9140,
      unDeepUsedLength: 8164,
      unDeepUnUsedLength: 2101,
      lng: 119.399151815,
      lat: 32.271322643
    },
    {
      name: "Changzhou City",
      totalLength: 9849,
      deepUsedLength: 3484,
      deepUnUsedLength: 836,
      unDeepUsedLength: 4115,
      unDeepUnUsedLength: 1415,
      lng: 119.984267562,
      lat: 31.971521771
    },
    {
      name: "Jiangyin City",
      totalLength: 23570,
      deepUsedLength: 22365,
      deepUnUsedLength: 1205,
      unDeepUsedLength: 0,
      unDeepUnUsedLength: 0,
      lng: 120.329215931,
      lat: 31.927882063
    }
  ]
  showDivGraphic(arrData)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showDivGraphic(arr) {
  for (let i = 0; i < arr.length; i++) {
    const deepUnUsed = arr[i].deepUnUsedLength // National highway
    const deepUsed = arr[i].deepUsedLength // County road
    const total = arr[i].totalLength // middle display
    const unDeepUnUsed = arr[i].unDeepUnUsedLength // Railway
    const unDeepUsed = arr[i].unDeepUsedLength // high speed
    const cityName = arr[i].name // City name
    const point = [arr[i].lng, arr[i].lat] // position

    // White background
    const backGroundGraphic = new mars3d.graphic.DivGraphic({
      position: point,
      style: {
        html: '<div style="width:60px;height:60px;border-radius: 50%;background-color: #ffffff; position: relative;"></div>',
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    graphicLayer.addGraphic(backGroundGraphic)

    // div
    const graphic = new mars3d.graphic.DivGraphic({
      position: point,
      style: {
        html: '<div style="width: 100px;height:100px;"></div>',
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      },
      pointerEvents: true
    })
    graphic.on(mars3d.EventType.add, function (e) {
      const dom = e.target.container.firstChild
      const attr = e.target.attr

      const chartChart = echarts.init(dom)

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}km </br>Proportion : {d}%",
          backgroundColor: "rgba(63, 72, 84, 0.7)",
          textStyle: {
            color: "#ffffff"
          }
        },
        title: {
          text: total + "\n Km",
          x: "center",
          y: "center",
          textStyle: {
            fontSize: 14
          }
        },
        color: ["#334b5c", "#6ab0b8", "#d48265", "#c23531"],
        series: [
          {
            name: cityName,
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: deepUnUsed, name: "National Highway" },
              { value: deepUsed, name: "County Road" },
              { value: unDeepUnUsed, name: "Railway" },
              { value: unDeepUsed, name: "High Speed" }
            ]
          }
        ]
      }

      chartChart.setOption(option)
    })
    graphicLayer.addGraphic(graphic)
  }
}
