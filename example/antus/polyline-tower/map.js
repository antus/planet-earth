
var map 
var graphicLayer 
var echartTarget = new mars3d.BaseClass()
var count = 0;

var mapOptions = {
  scene: {
    center: { lat: 29.526546, lng: 119.823425, alt: 803, heading: 178, pitch: -27 },
    fxaa: true
  },
  control: {
    homeButton: true,
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: { service: "gaode", insertIndex: 0 },
    baseLayerPicker: true,
    fullscreenButton: true,
    navigationHelpButton: true,

    clockAnimate: false, // 时钟动画控制(左下角)
    timeline: false, // 是否显示时间线控件

    contextmenu: { hasDefault: true }, // 涉及到多语言的模块：右键菜单
    compass: { top: "10px", left: "5px" },
    
    locationBar: {
      template:
        "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div>"
    }
  },
  basemaps: [
    {
      name: "Google Images",
      name_cn: "谷歌影像",
      name_en: "Google Images",
      icon: "/img/basemaps/google_img.png",
      type: "google",
      layer: "img_d",
      show: true
    },
    {
      name: "Tianditu Images",
      name_cn: "天地图影像",
      name_en: "Tianditu Images",
      icon: "/img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "img_d" },
        { name: "注记", type: "tdt", layer: "img_z" }
      ],
      show: false
    },
    {
      name: "Tianditu Electronic map",
      name_cn: "天地图电子",
      name_en: "Tianditu Electronic map",
      icon: "/img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d" },
        { name: "注记", type: "tdt", layer: "vec_z" }
      ]
    },
    {
      name: "not map",
      name_cn: "无底图",
      name_en: "not map",
      icon: "/img/basemaps/null.png",
      type: "grid",
      color: "#ffffff",
      alpha: 0.03,
      cells: 2
    }
  ],
  layers: [
    {
      type: "geojson",
      name: "Buffer 100",
      url: "/example/antus/polyline-tower/powerline/buffer-100.geojson",
      show: true,
      flyTo: false,
      symbol: {
        "styleOptions": { "opacity": 0.1, "color": "#00cd00", "width": 3, "clampToGround": true, tooltip: "Buffer 100m" }
      }, 
      tooltip: "Buffer 100m"
    },
    {
      type: "geojson",
      name: "Buffer 50",
      url: "/example/antus/polyline-tower/powerline/buffer-50.geojson",
      show: true,
      flyTo: false,
      symbol: {
        "styleOptions": { "opacity": 0.1, "color": "#cdcd00", "width": 3, "clampToGround": true }
      },
      tooltip: "Buffer 50m"
    },
    {
      type: "geojson",
      name: "Buffer 20",
      url: "/example/antus/polyline-tower/powerline/buffer-20.geojson",
      show: true,
      flyTo: false,
      symbol: {
        "styleOptions": { "opacity": 0.1, "color": "#cd0000", "width": 3, "clampToGround": true }
      },
      tooltip: "Buffer 50m"
    }
  ],
  lang: CustomLang // 使用自定义语言配置，配置信息在 ./CustomLang.js
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance 

  map.fixedLight = true

  // Create a vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Listen the layer click on the vector object", event)
  })

  mars3d.Util.fetchJson({ url: "/example/antus/polyline-tower/powerline/powerline.json" })
    .then(function (res) {
      showData(res.data)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })

  // add trees from WFS
  //showTreesFromWfs();

  mars3d.Util.fetchJson({ url: "/example/antus/polyline-tower/powerline/tree.geojson" })
    .then(function (res) {
      showHeatMap(res)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })  
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} 
 */
function onUnmounted() {
  map = null
}

// show trees
function showTreesFromWfs() {
  lodGraphicLayer = new mars3d.layer.LodGraphicLayer({
    name: "trees",
    IdField: "id", 
    minimumLevel: 15, // Limita il livello e carica solo i dati al di sotto di questo livello. [Parametri importanti relativi all'efficienza]
    debuggerTileInfo: false,
    clustering: {
      enabled: false, 
      pixelRange: 10
    },
    // Create the query string
    queryGridData: (grid) => {
      return mars3d.Util.fetchJson({
        url: "http://10.100.208.140:8190/geoserver/wfs",
        queryParameters: {
          request:"GetFeature",
          version:"1.0.0",
          typeName: "monitoraggio-ambientale:trees",
          BBOX: grid.extent.xmin + "," + grid.extent.ymin + "," + grid.extent.xmax + "," + grid.extent.ymax + ",EPSG:4326",
          maxFeatures: 100,
          srsName: "EPSG:4326",
          outputFormat: "application/json"
        }
      }).then(function (data) {
        grid.list = data.features
        return grid
      })
    },
    // Create the graphic
    createGraphic(grid, attr) {
      if (attr.geometry.type=='Point') {
        const graphicModel = new mars3d.graphic.ModelEntity({
          name: attr.properties.type,
          position: [attr.geometry.coordinates[0], attr.geometry.coordinates[1], attr.properties.alt],
          style: {
            url: "/example/antus/polyline-tower/powerline/tree/tree4.glb",
            scale: 0.05 * attr.properties.height / 10,
            minimumPixelSize: 20,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0),
            distanceDisplayCondition: true,
            distanceDisplayCondition_near: 0,
            distanceDisplayCondition_far: 100000,
            highlight: {
              silhouette: true,
              silhouetteColor: "#ffff00",
              silhouetteSize: 3
            }
          },
          attr: attr.properties
        })
        lodGraphicLayer.addGraphic(graphicModel);
        return graphicModel;

      }
    }
  })
  map.addLayer(lodGraphicLayer)

  bindLodLayerPopup();
}

function bindLodLayerPopup() {
  lodGraphicLayer.bindPopup(function (event) 
    {
        const attr = event.graphic.attr || {}
        if (attr==null)
          return null;
        return `<table>
                  <tr><th scope="col" colspan="2" style="border-bottom:1px solid grey;font-size:15px;">Tree information</th></tr>
                  <tr><td>Tree type</td><td>{type}</td></tr>
                  <tr><td>Height</td><td>{height} m</td></tr>
                  <tr><td>Altitude</td><td>{alt} m</td></tr>
                  <tr><td>Powerline distance</td><td>{distance_from_powerline} m</td></tr>
                </table>`;
    },
    {
      offsetY:0, 
      offsetX:0,
      template: `<div class="marsBlackPanel">
                        <div class="marsBlackPanel-text" style="text-align:left">{content}</div>
                        <span class="mars3d-popup-close-button closeButton" >×</span>
                      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      height:20
    }
  )
}


function showHeatMap(geojson) {
  var arr = [];
  const features = geojson.features;
  for (let i = 0; i < features.length; i++) {
    const item = features[i]
    const val = item.properties.height * 5 / (item.properties.distance_from_powerline/10);
    arr.push({ lng: item.geometry.coordinates[0], lat: item.geometry.coordinates[1], value: val})
  }
  var heatLayer = new mars3d.layer.HeatLayer({
    positions: arr,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 0.5,
      minOpacity: 0,
      maxOpacity: 0.4,
      blur: 0.3,
      gradient: {
        0: "#e9ec36",
        0.25: "#ffdd2f",
        0.5: "#fa6c20",
        0.75: "#fe4a33",
        1: "#ff0000"
      }
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      opacity: 1.0,
      clampToGround: true
    }
  })
  map.addLayer(heatLayer)
}


function updateHeightForSurfaceTerrain(i, position) {
  mars3d.PointUtil.getSurfaceTerrainHeight(map.scene, position).then((result) => {
    if (!Cesium.defined(result.height)) {
      return
    }
    if (result.height>0) {
      const p = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, result.height);
      const pointEntity = new mars3d.graphic.PointEntity({
        id: i,
        position: position,
        style: {
          pixelSize: 6,
          color: "#cdffcd"
          //clampToGround:true
        }      
      })
      graphicLayer.addGraphic(pointEntity)
    }
  })
}

function showData(arrdata) {
  let polylines1 = []
  let polylines2 = []
  let polylines3 = []
  let polylines4 = []

  const polylinesTB = []
  for (let i = 0; i < arrdata.length; i++) {
    const item = arrdata[i]

    // Longitude and latitude coordinates and altitude
    const longitude = Number(item.longitude)
    const latitude = Number(item.latitude)
    const height = Number(item.height)

    const originPoint = {
      longitude,
      latitude,
      height
    }
    const position = Cesium.Cartesian3.fromDegrees(originPoint.longitude, originPoint.latitude, originPoint.height)

    // Calculate the corner angle of the power tower
    const degree = parseInt(item.degree)

    // 5 line coordinates
    const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(degree), 0, 0)
    const newPoint1 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, 9, 51.5), hpr)
    const newPoint2 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, -9, 51.5), hpr)

    const newPoint3 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, -12, 47.5), hpr)
    const newPoint4 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, 12, 47.5), hpr)

    polylinesTB.push(newPoint3) // The point shown by the icon

    if (i === 0) {
      polylines1.push(newPoint1)
      polylines2.push(newPoint2)
      polylines3.push(newPoint3)
      polylines4.push(newPoint4)
    } else {
      const angularityFactor = -5000
      const num = 50
      let positions = mars3d.PolyUtil.getLinkedPointList(polylines1[polylines1.length - 1], newPoint1, angularityFactor, num) // Calculate curve points
      polylines1 = polylines1.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines2[polylines2.length - 1], newPoint2, angularityFactor, num) // Calculate curve points
      polylines2 = polylines2.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines3[polylines3.length - 1], newPoint3, angularityFactor, num) // Calculate curve points
      polylines3 = polylines3.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines4[polylines4.length - 1], newPoint4, angularityFactor, num) // Calculate curve points
      polylines4 = polylines4.concat(positions)

    }

    
    drawWireTowerModel(position, degree, item)
  }

  // Draw a route
  drawGuideLine(polylines1, "#cdcdcd")
  drawGuideLine(polylines2, "#cdcdcd")
  drawGuideLine(polylines3, "#cdcdcd")
  drawGuideLine(polylines4, "#cdcdcd")

  // Draw cross-section diagram echarts chart
  computeSurfacePointsHeight(polylinesTB)
}

// Draw a model of a power tower
function drawWireTowerModel(position, degree, item) {
  const graphic = new mars3d.graphic.ModelPrimitive({
    position,
    style: {
      url: "/example/antus/polyline-tower/powerline/tower.glb",
      heading: degree,
      scale: 1,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0)
    },
    highlight: {
      silhouette: true,
      silhouetteColor: "#ffff00",
      silhouetteSize: 3
    },
    attr: item
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindPopup(function (event) 
    {
        const attr = event.graphic.attr || {}
        if (attr==null)
          return null;
          const html = `<table>
          <tr><th scope="col" colspan="2" style="border-bottom:1px solid grey;font-size:15px;">Tower information</th></tr>
          <tr><td>Id</td><td>{towerId}</td></tr>
          <tr><td>Type</td><td>{towerType}</td></tr>
          <tr><td>Model</td><td>{towerModel}</td></tr>
          
          <tr><td>Longitude</td><td>{longitude}°</td></tr>
          <tr><td>Latitude</td><td>{latitude}°</td></tr>
    
          <tr><td>Commissioning date</td><td>{commissioningDate}</td></tr>
          <tr><td>Height</td><td>{totalTowerHeight} m</td></tr>
          <tr><td>Pole property</td><td>{poleProperty}</td></tr>
          <tr><td>Altitude</td><td>{height} m</td></tr>
          <tr><td>Orientation</td><td>{degree}°</td></tr>
          
        </table>`;
        return html;
    },
    {
      offsetY:0, 
      offsetX:0,
      template: `<div class="marsBlackPanel">
                        <div class="marsBlackPanel-text" style="text-align:left">{content}</div>
                        <span class="mars3d-popup-close-button closeButton" >×</span>
                      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      height:20
    }
  )
}

function drawGuideLine(positions, color) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions,
    style: {
      width: 1,
      color
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 绘制断面图echarts图表
function computeSurfacePointsHeight(polylines) {
  // 绘制断面图
  mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: polylines, // 需要计算的源路线坐标数组
    exact: true
  }).then((result) => {
    const heightArry = []
    const heightTDArray = []
    let distanceArray
    for (let i = 0; i < polylines.length; i++) {
      const item = polylines[i]
      const carto = Cesium.Cartographic.fromCartesian(item)

      const height = mars3d.Util.formatNum(carto.height) // 设计高度  当小数点后面的数字一致时，会省略小数点，不显示
      const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(result.positions[i]).height) // 地面高度
      heightArry.push(height)
      heightTDArray.push(tdHeight)

      // 距离数组
      const positionsLineFirst = result.positions[0]
      distanceArray = result.positions.map(function (data) {
        return Math.round(Cesium.Cartesian3.distance(data, positionsLineFirst)) // 计算两点之间的距离,返回距离
      })
    }
    echartTarget.fire("addEchart", { heightArry, heightTDArray, distanceArray })
  })
}


// function downloadNewFile(res) {
//   const polylinesTB = []
//   for (let i = 0; i < res.data.length; i++) {
//     const item = res.data[i]
//     const longitude = Number(item.longitude)
//     const latitude = Number(item.latitude)
//     const height = Number(item.height)
//     const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
//     polylinesTB.push(position)
//   }
//   mars3d.PolyUtil.computeSurfacePoints({
//     scene: map.scene,
//     positions: polylinesTB, // 需要计算的源路线坐标数组
//     exact: true
//   }).then((result) => {
//     for (let i = 0; i < result.positions.length; i++) {
//       const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(result.positions[i]).height) // 地面高度
//       res.data[i].height = tdHeight

//       delete res.data[i].heightCol
//       delete res.data[i].latCol
//       delete res.data[i].lonCol
//     }
//     mars3d.Util.downloadFile("tower.json", JSON.stringify(res))
//   })
// }
