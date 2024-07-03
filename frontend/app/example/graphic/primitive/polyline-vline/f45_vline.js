function initEcharts() {
  initRealPopulation()
  initPopulationStructure()
  initAging()
}

//actual population
function initRealPopulation() {
  let realEcharts = echarts.init(document.getElementById("population"))

  let realPopulationOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      top: "30%",
      left: "3%",
      right: "4%",
      bottom: "-10%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.5],
      show: false
    },
    yAxis: {
      type: "category",
      data: ["Permanent population", "Floating population"],
      axisLabel: {
        show: true,
        textStyle: {
          color: "#fff" //Axis text color
        }
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          color: "#fff",
          textStyle: {
            fontSize: 10
          }
        },
        data: [130365, 52729],
        itemStyle: {
          normal: {
            barBorderRadius: [15, 15, 15, 15],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: "#4d68ee" //Color at 0%
              },
              {
                offset: 0.6,
                color: "#25b1f5" //Color at 50%
              },
              {
                offset: 1,
                color: "#01f5ff" //Color at 100%
              }
            ])
          }
        }
      }
    ]
  }
  realEcharts.setOption(realPopulationOption)

  window.addEventListener("resize", function () {
    realEcharts.resize()
  })
}

//population structure
function initPopulationStructure() {
  let structureEcharts = echarts.init(document.getElementById("structure"))
  let structureOption = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      textStyle: {
        color: "#fff"
      },

      top: "8%",
      left: "center",
      icon: "circle",
      itemWidth: 10
    },
    color: ["#a20bd1", "#b2ba00", "#49ad00", "#03dfa7", "#8185b3", "#4c67eb", "#ab7900"],
    series: [
      {
        name: "male",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["25%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
          textStyle: {
            fontSize: 10
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "10",
            fontWeight: "bold",
            color: "#fff"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: "0-0.6" },
          { value: 735, name: "0.6-2" },
          { value: 580, name: "3-6" },
          { value: 484, name: "7-14" },
          { value: 300, name: "15-35" },
          { value: 300, name: "36-60" },
          { value: 300, name: "61 and above" }
        ]
      },
      {
        name: "female",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["75%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
          textStyle: {
            fontSize: 10
          }
        },
        data: [
          { value: 148, name: "0-0.6" },
          { value: 735, name: "0.6-2" },
          { value: 580, name: "3-6" },
          { value: 484, name: "7-14" },
          { value: 300, name: "15-35" },
          { value: 300, name: "36-60" },
          { value: 300, name: "61 and above" }
        ]
      }
    ]
  }
  structureEcharts.setOption(structureOption)

  window.addEventListener("resize", function () {
    structureEcharts.resize()
  })
}

//Population aging analysis
function initAging() {
  let agingEcharts = echarts.init(document.getElementById("agingAnalysis"))
  let agingOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Axis indicator, axis trigger is valid
        type: "shadow" // Default is straight line, optional: 'line' | 'shadow'
      },
      formatter: function (params, ticket) {
        return "Female:" + params[0].value + "<br/>Male:" + Math.abs(params[1].value)
      }
    },
    color: ["#c145c5", "#21b8f6"],
    legend: {
      data: ["female", "male"]
    },
    grid: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      top: "10%",
      left: "10%",
      containLabel: true
    },
    xAxis: [
      {
        type: "value",
        axisTick: {
          show: false
        },
        show: false
      }
    ],
    yAxis: [
      {
        type: "category",
        data: ["60-65 years old", "65-70 years old", "70-75 years old", "75-80 years old", "80 years old and above"],
        axisLabel: {
          textStyle: {
            color: "#fff" //Axis text color
          }
        }
      }
    ],

    series: [
      {
        type: "bar",
        stack: "total amount",
        label: {
          show: false
        },
        emphasis: {
          focus: "series"
        },

        data: [700, 300, 330, 160, 70],
        barCategoryGap: "50%",
        itemStyle: {
          normal: {
            barBorderRadius: [15, 15, 15, 15]
          }
        }
      },
      {
        type: "bar",
        stack: "total amount",
        label: {
          show: false,
          position: "left"
        },
        emphasis: {
          focus: "series"
        },
        data: [-800, -400, -350, -200, -100],
        itemStyle: {
          normal: {
            barBorderRadius: [15, 15, 15, 15]
          }
        }
      }
    ]
  }
  agingEcharts.setOption(agingOption)

  window.addEventListener("resize", function () {
    agingEcharts.resize()
  })
}
