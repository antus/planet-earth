function fontSize(res) {
  let font_size = window.getComputedStyle(document.documentElement).fontSize.replace("px", "") * 1
  return res * font_size
}

function initEcharts() {
  //pie chart
  let myChart = echarts.init(document.getElementById("ring"))
  let option = {
    backgroundColor: "transparent",
    legend: {
      show: false,
      top: "0%",
      left: "center",
      icon: "roundRect",
      itemWidth: 8,
      textStyle: {
        fontSize: fontSize(0.68)
      }
    },

    series: [
      {
        type: "pie",
        radius: "80%",
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderType: "solid",
          borderColor: "#ffffff"
        },
        emphasis: {
          scale: false,
          scaleSize: 2
        },
        label: {
          show: true,
          position: "center",
          lineHeight: 28,
          formatter: function (params) {
            if (params.dataIndex === self.left_index) {
              return "{p|" + params.data.value + "}" + "\n{nm|" + params.data.name + "}"
            } else {
              return ""
            }
          },
          emphasis: {
            formatter: function (params) {
              if (params.dataIndex != self.left_index) {
                return "{p|" + params.data.name + "}" + "\n{nm|" + params.data.value + "}"
              }
            }
          },
          rich: {
            p: {
              width: 130,
              itemWidth: 100,
              color: "#fff",
              fontSize: fontSize(1),
              lineHeight: fontSize(1),
              fontWeight: "bold"
              // backgroundColor: "rgba(15, 21, 70, 1)", // Overwrite the data when index=0
            },
            nm: {
              width: 130,
              itemWidth: 100,
              color: "#fff",
              fontSize: fontSize(1.5),
              lineHeight: fontSize(1.625),
              fontWeight: "bold"
              // backgroundColor: "rgba(15, 21, 70, 1)", // Overwrite the data when index=0
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 64,
            name: "Office Building",
            itemStyle: {
              color: "rgba(14,227,247, 0.58)"
            }
          },
          {
            value: 1,
            name: "complex building",
            itemStyle: {
              color: "rgba(255,113,94, 0.58)"
            }
          },
          {
            value: 4,
            name: "Shopping Mall Building",
            itemStyle: {
              color: "rgba(254,  217,  118, 0.64)"
            }
          },
          {
            value: 10,
            name: "hotel restaurant",
            itemStyle: {
              color: "rgba(234,94,230, 0.64)"
            }
          },
          {
            value: 1,
            name: "Medical and Health",
            itemStyle: {
              color: "rgba(94, 225, 186, 0.58)"
            }
          },
          {
            value: 1,
            name: "Cultural Education",
            itemStyle: {
              color: "rgba(113, 204, 78, 0.58)"
            }
          }
        ]
      }
    ]
  }
  myChart.setOption(option)

  //Histogram
  let myChart2 = echarts.init(document.getElementById("bar"), "dark")
  let option2 = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
      show: true,
      confine: true,
      textStyle: {
        align: "left"
      },
      formatter: function (item) {
        let html = `${item[0].name}:${item[0].data}`
        item.slice(1).forEach((s) => {
          if (s.seriesName.indexOf("series") == -1) {
            html += `<br/> ${s.seriesName}:${s.data}`
          }
        })
        return html
      },
      axisPointer: {
        // Axis indicator, axis trigger is valid
        type: "none" // cross defaults to a straight line, optional: 'line' | 'shadow'
      }
    },
    legend: {
      show: false,
      top: "5%",
      left: "center",
      icon: "roundRect",
      itemWidth: 8,
      textStyle: {
        fontSize: fontSize(0.6875)
      }
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "20%",
      bottom: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["office building", "complex building", "shopping mall building", "hotel and restaurant", "medical and health care", "culture and education"],
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLabel: {
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [10, 0, 0, 0]
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      splitLine: {
        show: false
      },
      show: true
    },

    yAxis: {
      max: 70,
      name: "building",
      nameTextStyle: {
        // color: "rgba(217, 35, 35, 1)",
        align: "right",
        verticalAlign: "middle",
        borderDashOffset: 0,
        padding: [6, 6, 6, 6]
      },
      axisLabel: {
        // color: '#ff0000',
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [0, 0, 0, 0]
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      }
    },
    series: [
      {
        name: "dotted",
        type: "pictorialBar",
        symbol: "rect",
        barGap: "-100%",
        showBackground: true,
        itemStyle: {
          color: "rgba(14,227,247, 1)"
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        data: [64, 1, 4, 10, 1, 1],
        z: -8
      },
      {
        type: "bar",
        itemStyle: {
          color: "rgba(0,0,0,0.2)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -9,
        showBackground: true,

        data: [70, 70, 70, 70, 70, 70]
      }
    ]
  }
  myChart2.setOption(option2)

  // line chart
  let myChart3 = echarts.init(document.getElementById("line"), "dark")
  let option3 = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
      show: true,
      confine: true,
      textStyle: {
        align: "left"
      },
      formatter: function (item) {
        let html = item[0].axisValue * 1 + "month"
        item.slice(0).forEach((s) => {
          if (s.seriesName.indexOf("series") == -1) {
            html += `<br/> ${s.seriesName}:${s.data}%`
          }
        })
        return html
        // return  '{b0}<br/>{a1}: {c1}<br/>{a2}: {c2}'
      },
      // formatter: '{b0}<br/>{a1}: {c1}<br/>{a2}: {c2}',
      axisPointer: {
        // Axis indicator, axis trigger is valid
        type: "none" // Default is straight line, optional: 'line' | 'shadow'
      }
    },
    legend: {
      show: true,
      // data:[""]
      top: "0%",
      left: "center",
      icon: "circle",
      type: "scroll",
      itemHeight: fontSize(0.5),
      itemWidth: fontSize(0.5),
      textStyle: {
        fontSize: fontSize(0.6)
      }
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "18%",
      bottom: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLabel: {
        //X-axis text style
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [10, 0, 0, 0]
      },
      splitLine: {
        show: false
      },
      show: true
    },
    yAxis: {
      // max:100,
      type: "value",
      name: "kwh",
      axisLabel: {
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [0, 0, 0, 0]
      },
      nameLocation: "end",
      nameTextStyle: {
        align: "right",
        verticalAlign: "middle",
        borderDashOffset: 0,
        padding: [6, 6, 6, 6]
      },
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      }
    },
    series: [
      {
        name: "Office Building",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(14,227,247,1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [4, 3, 5, 4, 0]
      },
      {
        name: "complex building",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(255,113,94, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [0.8, 0.6, 1, 0.6, 0]
      },
      {
        name: "Shopping Mall Building",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(254,  217,  118, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [0.6, 0.5, 0.8, 0.4, 0]
      },
      {
        name: "hotel restaurant",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(234,94,230, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: []
      },
      {
        name: "Medical and Health",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(94, 225, 186, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [1, 1, 1]
      },
      {
        name: "Cultural Education",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(113, 204, 78, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [1, 2, 1, 1, 2]
      },
      {
        type: "bar",
        itemStyle: {
          color: "rgba(0,0,0,0.2)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -9,
        showBackground: true,
        data: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
      }
    ]
  }
  myChart3.setOption(option3)
}
