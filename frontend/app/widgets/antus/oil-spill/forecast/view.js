"use script"


let thisWidget
var eventTarget = new mars3d.BaseClass()
var map // mars3d.Map三维地图对象


function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget

  map = thisWidget.map
      
  // 绘制24/48小时警戒线
  drawWarningLine()
  
  initUI();
}

// 所有已构造的台风集合
var typhoonListObj = {}
      
// 当前选择的台风
var selectTyphoon

// 勾选台风
function selectOneTyphoon(row) {
  stopPlay()

  var id = row.id
  if (!typhoonListObj[id]) {
    typhoonListObj[id] = new Typhoon({ ...row }, map)
  }

  var typhoon = typhoonListObj[id]
  typhoon.show = true
  typhoon.flyTo()

  selectTyphoon = typhoon
}

// 取消勾选台风
function unSelectOneTyphoon(id) {
  var typhoon = typhoonListObj[id]
  if (!typhoon) {
    return
  }

  if (typhoon.playTyphoon) {
    typhoon.playTyphoon.stop()
  }
  typhoon.show = false

  selectTyphoon = null
}

// 定位到台风
function clickTyRow(row) {
  var typhoon = typhoonListObj[row.id]
  if (typhoon) {
    typhoon.flyTo()
  }
}

// 定位到轨迹点
function clickPathRow(row) {
  selectTyphoon.showPointFQ(row)
  var graphic = selectTyphoon.getPointById(row.id)
  if (graphic) {
    graphic.flyTo({
      radius: 1600000,
      complete() {
        graphic.openTooltip()
      }
    })
  }
}

// 开始播放
function startPlay() {
  if (!selectTyphoon) {
    return
  }

  if (!selectTyphoon.playTyphoon) {
    selectTyphoon.playTyphoon = new PlayTyphoon(selectTyphoon.options, map)
  }

  selectTyphoon.playTyphoon.start()
  selectTyphoon.show = false
}

// 停止播放
function stopPlay() {
  if (selectTyphoon?.playTyphoon) {
    selectTyphoon.playTyphoon.stop()
    selectTyphoon.show = true
  }
}

// 绘制警戒线
function drawWarningLine() {
  // 绘制24小时警戒线
  var lineWarning24 = new mars3d.graphic.PolylineEntity({
    positions: [
      [127, 34],
      [127, 22],
      [119, 18],
      [119, 11],
      [113, 4.5],
      [105, 0]
    ],
    style: {
      color: "#828314",
      width: 2,
      zIndex: 1
    }
  })
  //map.graphicLayer.addGraphic(lineWarning24)

  // 注记文本
  var textWarning24 = new mars3d.graphic.RectangleEntity({
    positions: [
      [128.129019, 29.104287],
      [125.850451, 28.424599]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "24-hour cordon",
        font: "80px 楷体",
        color: "#828314",
        backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0)
      },
      rotationDegree: 90
    }
  })
  //map.graphicLayer.addGraphic(textWarning24)

  // 绘制48小时警戒线
  var lineWarning48 = new mars3d.graphic.PolylineEntity({
    positions: [
      [132, 34],
      [132, 22],
      [119, 0],
      [105, 0]
    ],
    style: {
      width: 2,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        dashLength: 20.0,
        color: "#4dba3d"
      }
    }
  })
  //map.graphicLayer.addGraphic(lineWarning48)

  // 注记文本
  var textWarning48 = new mars3d.graphic.RectangleEntity({
    positions: [
      [130.502492, 25.959716],
      [133.423638, 26.772991]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "48-hour cordon",
        font: "80px 楷体",
        color: "#4dba3d",
        backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0)
      },
      rotationDegree: 90,
      zIndex: 4
    }
  })
  //map.graphicLayer.addGraphic(textWarning48)
}

var formatDate = mars3d.Util.formatDate

function initUI(options) {
  //绘制24/48小时警戒线
  drawWarningLine()

  //获取台风列表
  mars3d.Util.fetchJson({
    url: "//data.mars3d.cn/file/apidemo/typhoon/list_2020.json",
    data: {
      t: new Date().getTime()
    }
  })
    .then(function (res) {
      var arr = typhoon_jsons_list_default(res)
      //启动正在发送的台风
      arr.forEach((item) => {
        if (item.state == "start") {
          item.show = true
          selectOneTyphoon2(item)
        }
      })
      showTyphoonTable(arr)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

//显示台风列表
function showTyphoonTable(data) {
  $("#listTable").bootstrapTable({
    data: data,
    height: 300,
    pagination: false,
    singleSelect: false,
    checkboxHeader: false,
    columns: [
      {
        title: "Show",
        field: "show",
        align: "center",
        checkbox: true,
        with: 50
      },
      {
        title: "Oil area number",
        field: "typnumber",
        align: "center"
      },
      {
        title: "Name",
        field: "name_en",
        align: "center"
      }
    ],
    onCheck: function (row) {
      selectOneTyphoon2(row)
    },
    onUncheck: function (row) {
      unSelectOneTyphoon(row.id)
    },
    onClickRow: function (row) {
      if (typhoonListObj[row.id] && typhoonListObj[row.id].show) {
        selectOneTyphoon2(row)
      }
    }
  })

  $("#btnPlay").click(function () {
    if (!selectTF) {
      return
    }

    if (selectTF.isStart) {
      stopPlay()
      selectTF.isStart = false
      $("#btnPlay").html('<span class="fa fa-play" aria-hidden="true"></span> Forcast')
    } else {
      startPlay()
      selectTF.isStart = true
      $("#btnPlay").html('<span class="fa fa-stop" aria-hidden="true"></span> Stop')
    }
  })
}

var typhoonListObj = {}

//勾选了台风
function selectOneTyphoon2(row) {
  $("#typhoonPath").show()
  $("#lblName").html(row.name_en + " [" + row.typnumber + "]")
  if (!row.path) {
    getPath(row.id).then(function (res) {
      row.path = res.path
      selectOneTyphoon(row)
      showPathTable(row)
    })
  } else {
    selectOneTyphoon(row)
    showPathTable(row)
  }
}

function getPath(id) {
  return mars3d.Util.fetchJson({
    url: "//data.mars3d.cn/file/apidemo/typhoon/view_" + id + ".json",
    data: {
      t: new Date().getTime()
    }
  }).then(function (res) {
    var newData = conversionPathData(res.typhoon) // 在Typhoon.js中
    return newData
  })
}

var selectTF

//台风路径表格的显示
function showPathTable(typhoon) {
  selectTF = typhoon

  $("#pathTable").bootstrapTable("destroy")
  $("#pathTable").bootstrapTable({
    height: getHeight(),
    pagination: false,
    singleSelect: true,
    data: typhoon.path,
    columns: [
      {
        title: "Time",
        field: "time_str",
        align: "center"
      },
      {
        title: "Wind",
        field: "centerSpeed",
        align: "center",
        formatter: function (value, row, index) {
          return value + "m/s"
        }
      },
      {
        title: "Direction",
        field: "moveTo_str",
        align: "center",
        formatter: function (value, row, index) {
          var result = value;
          switch(value) {
            case("北"):
              result = "north";
              break;
            case("北西北"):
              result = "north northwest";
              break;
            case("北西"):
              result = "northwest";
              break;     
            case("西北西"):
              result = "northwest west";
              break;                   
            case("西"):
              result = "west";
              break;
            case("西南"):
              result = "southwest";
              break;
            case("南西南"):
              result = "south southwest";
              break;
            case("南"):
              result = "south";
              break;
            case("东南"):
              result = "southeast";
              break;
            case("东南东"):
              result = "east southeast";
              break;              
            case("东方"):
              result = "east";
              break;
            case("东北"):
              result = "northeast";
              break;
            case("北西北"):
              result = "north northeast";
              break;
          }
          return result;
        }
      }
    ],
    onClickRow: function (row) {
      clickPathRow(row)
    }
  })
}

function getHeight() {
  return $(window).height() - 440
}

function typhoon_jsons_list_default(data) {
  var arr = []
  data.typhoonList.forEach((item) => {
    arr.push({
      id: item[0],
      name_en: item[1],
      name_cn: item[1],
      typnumber: item[3],
      state: item[7]
    })
  })
  return arr
}

function typhoon_jsons_view(res) {
  var newData = conversionPathData(res.typhoon) //在Typhoon.js中
  // console.log('台风数据==>', newData)
  return newData
}

//转换数据,将后端接口数据转换为需要的格式
function conversionPathData(oldData) {
  var path = []
  oldData[8].forEach((message) => {
    var circle7
    var circle10
    var circle12
    message[10].forEach((level) => {
      var radiusObj = {
        speed: level[0],
        radius1: level[1],
        radius2: level[2],
        radius3: level[3],
        radius4: level[4]
      }

      if (level[0] == "30KTS") {
        circle7 = radiusObj
      } else if (level[0] == "50KTS") {
        circle10 = radiusObj
      } else if (level[0] == "64KTS") {
        circle12 = radiusObj
      } else {
        console.log("未处理风圈", radiusObj)
      }
    })

    //预测路径
    var babj = message[11]?.BABJ
    var arrForecast
    if (babj) {
      arrForecast = []
      babj.forEach((element) => {
        var newArr = {
          time: element[0], //几小时预报
          time_str: element[1],
          lon: element[2], //预报经度
          lat: element[3], //预报纬度
          strength: element[4], //中心气压
          centerSpeed: element[5], //最大风速  m/s
          level: element[7], //预报台风等级, 代码
          color: getColor(element[7]) //对应等级的颜色
        }
        arrForecast.push(newArr)
      })
    }

    var time = new Date(message[2]) //时间

    path.push({
      id: message[0], //唯一标识
      time: new Date(message[2]), //时间
      time_str: time.format("MM-dd HH:mm"), //时间格式化字符串

      level: message[3], //台风等级, 代码
      level_str: getLevelStr(message[3]),
      color: getColor(message[3]), //对应等级的颜色
      lon: message[4], //经度
      lat: message[5], //纬度
      strength: message[6], //中心气压,百帕
      centerSpeed: message[7], //最大风速,米/秒
      moveTo: message[8], //移动方向, 代码
      moveTo_str: getMoveToStr(message[8]),
      windSpeed: message[9], //移动速度,公里/小时

      circle7: circle7, //7级风圈, 对象
      circle10: circle10, //10级风圈, 对象
      circle12: circle12, //12级风圈, 对象
      forecast: arrForecast //预测路径, 数组
    })
  })

  return {
    id: oldData[0],
    name_en: oldData[1], //台风名字,英文
    name_cn: oldData[1], //台风名字
    typnumber: oldData[3], //台风编号
    state: oldData[7],
    path: path
  }
}

//不同等级的台风对应不同的颜色
function getColor(level) {
  switch (level) {
    default:
    case "TD": //热带低压
      return "rgb(238,209,57)"
    case "TS": //热带风暴
      return "rgb(0,0,255)"
    case "STS": //强热带风暴
      return "rgb(15,128,0)"
    case "TY": //台风
      return "rgb(254,156,69)"
    case "STY": //强台风
      return "rgb(254,0,254)"
    case "SuperTY": //超强台风
      return "rgb(254,0,0)"
  }
}

function getLevelStr(value) {
  switch (value) {
    default:
    case "TD":
      return "热带低压"
    case "TS":
      return "热带风暴"
    case "STS":
      return "强热带风暴"
    case "TY":
      return "台风"
    case "STY":
      return "强台风"
    case "SuperTY":
      return "超强台风"
  }
}

function getMoveToStr(value) {
  switch (value) {
    default:
    case "N":
      return "北"
    case "NNE":
      return "北东北"
    case "NE":
      return "东北"
    case "ENE":
      return "东东北"
    case "E":
      return "东"
    case "ESE":
      return "东东南"
    case "ES":
      return "东南"
    case "SSE":
      return "南东南"
    case "S":
      return "南"
    case "SSW":
      return "南西南"
    case "SW":
      return "西南"
    case "WSW":
      return "西西南"
    case "W":
      return "西"
    case "WNW":
      return "西北西"
    case "NW":
      return "北西"
    case "NNW":
      return "北西北"
  }
}
