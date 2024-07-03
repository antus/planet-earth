let chartsData = {
  fltj: [
    { name: "Public Culture", xms: 160, zds: 10, zjl: 645 },
    { name: "Public Education", xms: 848, zds: 580, zjl: 10 },
    { name: "Medical and Health", xms: 370, zds: 10, zjl: 150560 },
    { name: "Public Sports", xms: 91, zds: 0, zjl: 182 },
    { name: "Social Security", xms: 233, zds: 10, zjl: 808 },
    { name: "Grassroots Public Service", xms: 20, zds: 10, zjl: 10 }
  ],
  zjly: [
    { name: "provincial level", value: 88 },
    { name: "City level", value: 127 },
    { name: "District and county level", value: 175 },
    { name: "street level", value: 270 },
    { name: "Social Capital", value: 42 }
  ],
  ndtj: {
    xms: [
      { name: "2013", value: 1 },
      { name: "2014", value: 2 },
      { name: "2015", value: 6 },
      { name: "2016", value: 36 },
      { name: "2017", value: 85 },
      { name: "2018", value: 10 },
      { name: "2018", value: 17 }
    ],
    zds: [
      { name: "2013", value: 10 },
      { name: "2014", value: 20 },
      { name: "2015", value: 30 },
      { name: "2016", value: 40 },
      { name: "2017", value: 50 },
      { name: "2018", value: 60 }
    ],
    zjl: [
      { name: "2013", value: 55600 },
      { name: "2014", value: 95600 },
      { name: "2015", value: 162896 },
      { name: "2016", value: 195761 },
      { name: "2017", value: 87068 },
      { name: "2018", value: 68393 }
    ]
  }
}

//Initialize chart
function initCharts() {
  initCharts_One(chartsData.fltj)
  initCharts_Two(chartsData.zjly)
  initCharts_Three(chartsData.ndtj)
}

// chartOne classification statistics
function initCharts_One(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i]
    let html = `<li>
        <div class="title">${item.name}</div>
        <div class="conter"><span>${item.xms}</span>, investment <span>${item.zds}</span> billion, covering an area of ​​<span>${item.zjl} </span>acre</div>
      </li>`
    $("#ulFLTJ").append(html)
  }
}

//chartTwo Echart round classification source of funds
function initCharts_Two(arr) {
  let data = []
  for (let i = 0; i < arr.length; i++) {
    let object = {}
    object.name = arr[i].name
    object.value = arr[i].value
    data[i] = object
  }

  setTimeout(function () {
    window.onresize = function () {
      myChart.resize()
    }
  }, 200)

  let myChart = echarts.init(document.getElementById("ul_ZJLY"))
  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}"
    },
    //Legend related settings
    legend: {
      orient: "vertical",
      left: "right",
      textStyle: {
        color: "#ccc"
      }
    },
    //Graphic settings
    series: [
      {
        // name: 'Access source',
        type: "pie",
        radius: "80%",
        right: "20%",
        //Style settings for text labels on graphics
        label: {
          show: false
        },
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF"
        ],
        center: ["45%", "55%"],
        data: data, //Add using for loop
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }
  myChart.setOption(option)
}

//chartThree Echart column annual statistics
function initCharts_Three(arr) {
  histogram(arr.xms, "a")
  $("#btnNDTJ_xms").click(function () {
    histogram(arr.xms, "a")
  })
  $("#btnNDTJ_zds").click(function () {
    histogram(arr.zds, "mu")
  })
  $("#btnNDTJ_zjl").click(function () {
    histogram(arr.zjl, "billion")
  })
}

//Project, land area, funds button click to switch
function histogram(arr, Word) {
  let arrName = []
  let arrValue = []
  for (let i = 0; i < arr.length; i++) {
    arrName[i] = arr[i].name
    arrValue[i] = arr[i].value
  }

  setTimeout(function () {
    window.onresize = function () {
      myChart.resize()
    }
  }, 200)

  let myChart = echarts.init(document.getElementById("ul_ NDTJ"))
  let option = {
    //nameTextStyle of xAxis and yAxis does not work
    // So the global style of the font is set
    textStyle: {
      color: "#ccc"
    },
    title: {
      text: "Unit:" + Word,
      //Global styles have no effect on this,
      textStyle: {
        color: "#ccc"
      }
    },
    //Shadow when moving into the column
    tooltip: {
      trigger: "axis",
      formatter: "{b}<br/>{c}" + Word,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "5px",
      right: "0",
      bottom: "5px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: arrName
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        //Related settings for pillars
        itemStyle: {
          color: "rgb(0, 174, 255)"
        },
        barWidth: "20px",
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: arrValue
      }
    ]
  }
  myChart.setOption(option)
}
