// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.706855, lng: 116.642847, alt: 4849553, heading: 350, pitch: -75 }
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

  // Create Echarts layer
  createEchartsLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createEchartsLayer() {
  const options = getEchartsOption()
  const echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  //Chart adaptive
  window.addEventListener("resize", function () {
    echartsLayer.resize()
  })
}

/**
 * echart layer
 *
 * @return {option} echart chart data
 */
function getEchartsOption() {
  const allData = {
    citys: [
      {
        name: "Extension of life",
        value: [128.331644, 45.451897, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Linjiang",
        value: [126.918087, 41.811979, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jiaxing",
        value: [120.755486, 30.746129, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Siping",
        value: [124.350398, 43.16642, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yingkou",
        value: [122.235418, 40.667012, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Miyun",
        value: [116.801346, 40.35874, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Weihai",
        value: [122.12042, 37.513068, 32],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hangzhou",
        value: [120.15507, 30.274085, 10],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Ji'an",
        value: [126.194031, 41.125307, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Guiyang",
        value: [106.630154, 26.647661, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Fushun",
        value: [123.957208, 41.880872, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Haimen",
        value: [121.181615, 31.871173, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Zhuhai",
        value: [113.576726, 22.270715, 9],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hebei",
        value: [114.475704, 38.584854, -19],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Shenzhen",
        value: [114.057868, 22.543099, 14],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huangpu",
        value: [121.484443, 31.231763, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Penglai",
        value: [120.758848, 37.810661, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jilin",
        value: [126.549572, 43.837883, -364],
        symbolSize: 14,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Gansu",
        value: [103.826308, 36.059421, -2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Longjing",
        value: [129.427066, 42.766311, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Maoming",
        value: [110.925456, 21.662999, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Dandong",
        value: [124.354707, 40.0005, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jinzhong",
        value: [112.752695, 37.687024, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Zhejiang",
        value: [120.152792, 30.267447, -2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Haicheng",
        value: [122.685217, 40.882377, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xupu",
        value: [110.594921, 27.908281, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Beijing",
        value: [116.407526, 39.90403, -14],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Tieling",
        value: [123.726166, 42.223769, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Datong",
        value: [113.61244, 40.040295, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jintan",
        value: [119.597897, 31.723247, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Qiqihar",
        value: [126.661669, 45.742347, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xianyang",
        value: [108.708991, 34.329605, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Sichuan",
        value: [104.075931, 30.651652, -5],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "福田",
        value: [114.055036, 22.52153, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Panjin",
        value: [122.070714, 41.119997, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Zhongshan",
        value: [113.392782, 22.517646, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Fujian",
        value: [119.295144, 26.10078, -1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Taishun",
        value: [119.717649, 27.556884, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Baoshan",
        value: [131.401589, 46.577167, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Qing'an",
        value: [127.507825, 46.880102, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Haidian",
        value: [116.298056, 39.959912, 32],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Daxing",
        value: [116.341395, 39.726929, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huachuan",
        value: [130.719081, 47.023001, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huizhou",
        value: [114.416196, 23.111847, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Qingdao",
        value: [120.38264, 36.067082, 52],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Chaoyang",
        value: [116.443108, 39.92147, 17],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shenyang",
        value: [123.431475, 41.805698, 41],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Heze",
        value: [115.480656, 35.23375, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Nantong",
        value: [120.894291, 31.980172, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Nanchong",
        value: [106.110698, 30.837793, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Two Cities",
        value: [126.312745, 45.383263, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Nanjing",
        value: [118.796877, 32.060255, 17],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xinjiang",
        value: [87.627704, 43.793026, -2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Chengdu",
        value: [104.066541, 30.572269, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shaanxi",
        value: [108.954239, 34.265472, -2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Huangdao",
        value: [120.04619, 35.872664, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Wenzhou",
        value: [120.699367, 27.994267, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shijiazhuang",
        value: [114.51486, 38.042307, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xingtai",
        value: [114.504844, 37.070589, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Ganzhou",
        value: [114.93503, 25.831829, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yiwu",
        value: [120.075058, 29.306841, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Nanchang",
        value: [115.858198, 28.682892, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Minhang",
        value: [121.381709, 31.112813, 18],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Changning",
        value: [121.424624, 31.220367, 7],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "道里",
        value: [126.616957, 45.755777, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Rushan",
        value: [121.539765, 36.919816, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Double stream",
        value: [103.923648, 30.574473, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Guangzhou",
        value: [113.264435, 23.129163, 13],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "西城",
        value: [116.365868, 39.912289, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jiamusi",
        value: [130.318917, 46.799923, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huang Gu",
        value: [123.44197, 41.824796, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Elm",
        value: [126.533146, 44.840288, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Linfen",
        value: [111.518976, 36.088005, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shanghai",
        value: [121.473701, 31.230416, 44],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Inner Mongolia",
        value: [111.765618, 40.817498, -23],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Shangzhi",
        value: [128.009895, 45.209586, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huli",
        value: [118.146769, 24.512905, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Taizhou",
        value: [121.420757, 28.656386, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Weifang",
        value: [119.161756, 36.706774, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Suzhou",
        value: [120.585316, 31.298886, 14],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Fangshan",
        value: [116.143267, 39.749144, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jimo",
        value: [120.447128, 36.389639, 15],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shulan",
        value: [126.965607, 44.406106, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yanji",
        value: [129.508946, 42.891255, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "三河",
        value: [117.078295, 39.982718, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Dalian",
        value: [121.614682, 38.914003, 40],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huinan",
        value: [126.046912, 42.684993, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Wuxi",
        value: [120.31191, 31.49117, 14],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Changzhou",
        value: [119.973987, 31.810689, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Guangxi",
        value: [108.327546, 22.815478, -1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Quanzhou",
        value: [118.675676, 24.874132, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Changping",
        value: [116.231204, 40.22066, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Haiyang",
        value: [121.158434, 36.776378, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Zhengzhou",
        value: [113.625368, 34.7466, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "东城",
        value: [116.416357, 39.928353, 10],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "黄华",
        value: [117.330048, 38.371383, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Marquis Wu",
        value: [104.04339, 30.641982, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Chicken",
        value: [131.12408, 45.260412, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Longkou",
        value: [120.477813, 37.646108, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Tang Yuan",
        value: [129.905072, 46.730706, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hubei",
        value: [114.341862, 30.546498, -4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Karamay",
        value: [84.889207, 45.579889, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xiamen",
        value: [118.089425, 24.479834, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Harbin",
        value: [126.534967, 45.803775, 8],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Qinhuangdao",
        value: [119.600493, 39.935385, 7],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jiangsu",
        value: [118.763232, 32.061707, -1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Changshu",
        value: [120.752481, 31.654376, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yantai",
        value: [121.447935, 37.463822, 24],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Peace",
        value: [117.21451, 39.116949, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Huancui",
        value: [122.123444, 37.501991, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xuanwumenwai East Street",
        value: [116.378888, 39.899332, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Zhangjiagang",
        value: [120.553284, 31.870367, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Lin'an",
        value: [119.724733, 30.233873, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yan'an",
        value: [109.489727, 36.585455, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Tianjin",
        value: [117.200983, 39.084158, 28],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Chengyang",
        value: [120.39631, 36.307064, 15],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shijingshan",
        value: [116.222982, 39.906611, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Changsha",
        value: [112.938814, 28.228209, 5],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Anhui",
        value: [117.284923, 31.861184, -1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Kunshan",
        value: [120.980737, 31.385598, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xuhui",
        value: [121.436525, 31.188523, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Donggang",
        value: [124.152705, 39.863008, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Langfang",
        value: [116.683752, 39.538047, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Anshan",
        value: [122.994329, 41.108647, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hailing",
        value: [119.919425, 32.491016, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Heilongjiang",
        value: [126.661669, 45.742347, -198],
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Tibet",
        value: [91.117212, 29.646923, -1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Henan",
        value: [113.274379, 34.445122, 0],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Hunan",
        value: [112.98381, 28.112444, -1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Foshan",
        value: [113.121416, 23.021548, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hunchun",
        value: [130.366036, 42.862821, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yangzhou",
        value: [119.412966, 32.39421, 5],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Rizhao",
        value: [119.526888, 35.416377, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Tangshan",
        value: [118.180194, 39.630867, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Tongjiang",
        value: [132.510919, 47.642707, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Rongcheng",
        value: [122.486658, 37.16516, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "HuLin",
        value: [132.93721, 45.762686, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Wuhan",
        value: [114.305393, 30.593099, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hefei",
        value: [117.227239, 31.820587, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jingzhou",
        value: [112.239741, 30.335165, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Fengtai",
        value: [116.287149, 39.858427, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Shandong",
        value: [117.020359, 36.66853, -6],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Zhoushan",
        value: [122.207216, 29.985295, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Lianyungang",
        value: [119.221611, 34.596653, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xi'an",
        value: [108.940175, 34.341568, 3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jinan",
        value: [117.12, 36.651216, 4],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Mianyang",
        value: [104.679114, 31.46745, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Liaoning",
        value: [123.42944, 41.835441, -58],
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Shanxi",
        value: [112.562398, 37.873532, -3],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        }
      },
      {
        name: "Hohhot",
        value: [111.749181, 40.842585, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Hexi",
        value: [117.223372, 39.109563, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Xinghe",
        value: [113.834173, 40.872301, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Chongqing",
        value: [106.551557, 29.56301, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jiaozhou",
        value: [120.033382, 36.26468, 5],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Ningbo",
        value: [121.550357, 29.874557, 10],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Binhai",
        value: [119.820831, 33.990334, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Taiyuan",
        value: [112.548879, 37.87059, 2],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Jixi",
        value: [130.969333, 45.295075, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Lanshan",
        value: [118.347707, 35.051729, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Yangquan",
        value: [113.580519, 37.856972, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Boli",
        value: [130.592171, 45.755063, 1],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      },
      {
        name: "Changchun",
        value: [125.323544, 43.817072, 8],
        symbolSize: 2,
        itemStyle: {
          normal: {
            color: "#F58158"
          }
        }
      }
    ],
    moveLines: [
      {
        fromName: "Heilongjiang",
        toName: "Zhuhai",
        coords: [
          [126.661669, 45.742347],
          [113.576726, 22.270715]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Shu Lan",
        coords: [
          [126.661669, 45.742347],
          [126.965607, 44.406106]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Dalian",
        coords: [
          [126.661669, 45.742347],
          [121.614682, 38.914003]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Ji'an",
        coords: [
          [123.42944, 41.835441],
          [126.194031, 41.125307]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Fushun",
        coords: [
          [126.549572, 43.837883],
          [123.957208, 41.880872]
        ]
      },
      {
        fromName: "Shandong",
        toName: "Nanjing",
        coords: [
          [117.020359, 36.66853],
          [118.796877, 32.060255]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Shenyang",
        coords: [
          [116.407526, 39.90403],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Huancui",
        coords: [
          [126.661669, 45.742347],
          [122.123444, 37.501991]
        ]
      },
      {
        fromName: "Tianjin",
        toName: "Dalian",
        coords: [
          [117.200983, 39.084158],
          [121.614682, 38.914003]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xinghe",
        coords: [
          [126.549572, 43.837883],
          [113.834173, 40.872301]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Boli",
        coords: [
          [114.475704, 38.584854],
          [130.592171, 45.755063]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Dalian",
        coords: [
          [126.549572, 43.837883],
          [121.614682, 38.914003]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Shenyang",
        coords: [
          [126.549572, 43.837883],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Minhang",
        coords: [
          [126.661669, 45.742347],
          [121.381709, 31.112813]
        ]
      },
      {
        fromName: "Tianjin",
        toName: "Chaoyang",
        coords: [
          [117.200983, 39.084158],
          [116.443108, 39.92147]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Huangdao",
        coords: [
          [126.549572, 43.837883],
          [120.04619, 35.872664]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Shanghai",
        coords: [
          [111.765618, 40.817498],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Nanjing",
        coords: [
          [111.765618, 40.817498],
          [118.796877, 32.060255]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Hangzhou",
        coords: [
          [123.42944, 41.835441],
          [120.15507, 30.274085]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Haicheng",
        coords: [
          [126.661669, 45.742347],
          [122.685217, 40.882377]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xicheng",
        coords: [
          [126.549572, 43.837883],
          [116.365868, 39.912289]
        ]
      },
      {
        fromName: "Sichuan",
        toName: "Shanghai",
        coords: [
          [104.075931, 30.651652],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Xicheng",
        coords: [
          [126.661669, 45.742347],
          [116.365868, 39.912289]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Dandong",
        coords: [
          [126.549572, 43.837883],
          [124.354707, 40.0005]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Ningbo",
        coords: [
          [126.549572, 43.837883],
          [121.550357, 29.874557]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Haidian",
        coords: [
          [123.42944, 41.835441],
          [116.298056, 39.959912]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Qingdao",
        coords: [
          [123.42944, 41.835441],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Suzhou",
        coords: [
          [126.549572, 43.837883],
          [120.585316, 31.298886]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Fushun",
        coords: [
          [126.661669, 45.742347],
          [123.957208, 41.880872]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Lin'an",
        coords: [
          [126.549572, 43.837883],
          [119.724733, 30.233873]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Yantai",
        coords: [
          [123.42944, 41.835441],
          [121.447935, 37.463822]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Haidian",
        coords: [
          [126.661669, 45.742347],
          [116.298056, 39.959912]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Nanchang",
        coords: [
          [126.661669, 45.742347],
          [115.858198, 28.682892]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Shenyang",
        coords: [
          [111.765618, 40.817498],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Shanxi",
        toName: "Chengyang",
        coords: [
          [112.562398, 37.873532],
          [120.39631, 36.307064]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Guangzhou",
        coords: [
          [126.549572, 43.837883],
          [113.264435, 23.129163]
        ]
      },
      {
        fromName: "Shanghai",
        toName: "Shenyang",
        coords: [
          [121.473701, 31.230416],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Sichuan",
        toName: "Yangquan",
        coords: [
          [104.075931, 30.651652],
          [113.580519, 37.856972]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Huachuan",
        coords: [
          [114.475704, 38.584854],
          [130.719081, 47.023001]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Haidian",
        coords: [
          [111.765618, 40.817498],
          [116.298056, 39.959912]
        ]
      },
      {
        fromName: "Anhui",
        toName: "Hebei",
        coords: [
          [117.284923, 31.861184],
          [114.475704, 38.584854]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Hohhot",
        coords: [
          [123.42944, 41.835441],
          [111.749181, 40.842585]
        ]
      },
      {
        fromName: "Guangxi",
        toName: "Maoming",
        coords: [
          [108.327546, 22.815478],
          [110.925456, 21.662999]
        ]
      },
      {
        fromName: "Jilin",
        toName: "东城",
        coords: [
          [126.549572, 43.837883],
          [116.416357, 39.928353]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Panjin",
        coords: [
          [111.765618, 40.817498],
          [122.070714, 41.119997]
        ]
      },
      {
        fromName: "Shandong",
        toName: "Harbin",
        coords: [
          [117.020359, 36.66853],
          [126.534967, 45.803775]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Shenyang",
        coords: [
          [126.661669, 45.742347],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Fengtai",
        coords: [
          [126.661669, 45.742347],
          [116.287149, 39.858427]
        ]
      },
      {
        fromName: "Sichuan",
        toName: "Panjin",
        coords: [
          [104.075931, 30.651652],
          [122.070714, 41.119997]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Huang Gu",
        coords: [
          [126.661669, 45.742347],
          [123.44197, 41.824796]
        ]
      },
      {
        fromName: "Hebei",
        toName: "HuLin",
        coords: [
          [114.475704, 38.584854],
          [132.93721, 45.762686]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Baoshan",
        coords: [
          [123.42944, 41.835441],
          [131.401589, 46.577167]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jilin",
        coords: [
          [126.661669, 45.742347],
          [126.549572, 43.837883]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Qingdao",
        coords: [
          [126.661669, 45.742347],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Yantai",
        coords: [
          [126.549572, 43.837883],
          [121.447935, 37.463822]
        ]
      },
      {
        fromName: "Shandong",
        toName: "Linjiang",
        coords: [
          [117.020359, 36.66853],
          [126.918087, 41.811979]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Huangdao",
        coords: [
          [126.661669, 45.742347],
          [120.04619, 35.872664]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Shijiazhuang",
        coords: [
          [126.549572, 43.837883],
          [114.51486, 38.042307]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Tang Yuan",
        coords: [
          [126.549572, 43.837883],
          [129.905072, 46.730706]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Linjiang",
        coords: [
          [126.661669, 45.742347],
          [126.918087, 41.811979]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Jinan",
        coords: [
          [126.549572, 43.837883],
          [117.12, 36.651216]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Taiyuan",
        coords: [
          [126.549572, 43.837883],
          [112.548879, 37.87059]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Weihai",
        coords: [
          [126.549572, 43.837883],
          [122.12042, 37.513068]
        ]
      },
      {
        fromName: "Hubei",
        toName: "Shenzhen",
        coords: [
          [114.341862, 30.546498],
          [114.057868, 22.543099]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Rongcheng",
        coords: [
          [111.765618, 40.817498],
          [122.486658, 37.16516]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Zhengzhou",
        coords: [
          [123.42944, 41.835441],
          [113.625368, 34.7466]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Chaoyang",
        coords: [
          [126.661669, 45.742347],
          [116.443108, 39.92147]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Kunshan",
        coords: [
          [126.549572, 43.837883],
          [120.980737, 31.385598]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Two Cities",
        coords: [
          [126.549572, 43.837883],
          [126.312745, 45.383263]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Karamay",
        coords: [
          [126.661669, 45.742347],
          [84.889207, 45.579889]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Shanghai",
        coords: [
          [123.42944, 41.835441],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Haiyang",
        coords: [
          [126.549572, 43.837883],
          [121.158434, 36.776378]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xuanwumenwai East Street",
        coords: [
          [126.549572, 43.837883],
          [116.378888, 39.899332]
        ]
      },
      {
        fromName: "Shandong",
        toName: "Haidian",
        coords: [
          [117.020359, 36.66853],
          [116.298056, 39.959912]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Weihai",
        coords: [
          [111.765618, 40.817498],
          [122.12042, 37.513068]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jinzhong",
        coords: [
          [126.661669, 45.742347],
          [112.752695, 37.687024]
        ]
      },
      {
        fromName: "Tibet",
        toName: "Guangzhou",
        coords: [
          [91.117212, 29.646923],
          [113.264435, 23.129163]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Wuxi",
        coords: [
          [123.42944, 41.835441],
          [120.31191, 31.49117]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Chengyang",
        coords: [
          [126.661669, 45.742347],
          [120.39631, 36.307064]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Fengtai",
        coords: [
          [114.475704, 38.584854],
          [116.287149, 39.858427]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Yangzhou",
        coords: [
          [126.661669, 45.742347],
          [119.412966, 32.39421]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Tianjin",
        coords: [
          [123.42944, 41.835441],
          [117.200983, 39.084158]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Yangzhou",
        coords: [
          [126.549572, 43.837883],
          [119.412966, 32.39421]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Jiaxing",
        coords: [
          [126.549572, 43.837883],
          [120.755486, 30.746129]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Extension of life",
        coords: [
          [114.475704, 38.584854],
          [128.331644, 45.451897]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Yiwu",
        coords: [
          [126.549572, 43.837883],
          [120.075058, 29.306841]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Zhangjiagang",
        coords: [
          [126.549572, 43.837883],
          [120.553284, 31.870367]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Guiyang",
        coords: [
          [123.42944, 41.835441],
          [106.630154, 26.647661]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Liaoning",
        coords: [
          [126.549572, 43.837883],
          [123.42944, 41.835441]
        ]
      },
      {
        fromName: "Henan",
        toName: "Yingkou",
        coords: [
          [113.274379, 34.445122],
          [122.235418, 40.667012]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Hefei",
        coords: [
          [126.549572, 43.837883],
          [117.227239, 31.820587]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Suzhou",
        coords: [
          [126.661669, 45.742347],
          [120.585316, 31.298886]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Elm",
        coords: [
          [126.661669, 45.742347],
          [126.533146, 44.840288]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Changshu",
        coords: [
          [126.549572, 43.837883],
          [120.752481, 31.654376]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Rushan",
        coords: [
          [126.549572, 43.837883],
          [121.539765, 36.919816]
        ]
      },
      {
        fromName: "Sichuan",
        toName: "Qingdao",
        coords: [
          [104.075931, 30.651652],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Shenzhen",
        coords: [
          [126.661669, 45.742347],
          [114.057868, 22.543099]
        ]
      },
      {
        fromName: "Tianjin",
        toName: "东城",
        coords: [
          [117.200983, 39.084158],
          [116.416357, 39.928353]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Shanghai",
        coords: [
          [126.661669, 45.742347],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Tianjin",
        toName: "Ningbo",
        coords: [
          [117.200983, 39.084158],
          [121.550357, 29.874557]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Haimen",
        coords: [
          [126.549572, 43.837883],
          [121.181615, 31.871173]
        ]
      },
      {
        fromName: "Shanxi",
        toName: "Shenyang",
        coords: [
          [112.562398, 37.873532],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Chengdu",
        coords: [
          [126.549572, 43.837883],
          [104.066541, 30.572269]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Nanchang",
        coords: [
          [126.549572, 43.837883],
          [115.858198, 28.682892]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Changzhou",
        coords: [
          [126.661669, 45.742347],
          [119.973987, 31.810689]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Lanshan",
        coords: [
          [111.765618, 40.817498],
          [118.347707, 35.051729]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Henan",
        coords: [
          [126.549572, 43.837883],
          [113.274379, 34.445122]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Futian",
        coords: [
          [126.661669, 45.742347],
          [114.055036, 22.52153]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Changzhou",
        coords: [
          [126.549572, 43.837883],
          [119.973987, 31.810689]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Shuangliu",
        coords: [
          [126.549572, 43.837883],
          [103.923648, 30.574473]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Weifang",
        coords: [
          [126.549572, 43.837883],
          [119.161756, 36.706774]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Yan'an",
        coords: [
          [126.549572, 43.837883],
          [109.489727, 36.585455]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Changchun",
        coords: [
          [123.42944, 41.835441],
          [125.323544, 43.817072]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Nanjing",
        coords: [
          [126.661669, 45.742347],
          [118.796877, 32.060255]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Peace",
        coords: [
          [123.42944, 41.835441],
          [117.21451, 39.116949]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Harbin",
        coords: [
          [116.407526, 39.90403],
          [126.534967, 45.803775]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Wuhan",
        coords: [
          [126.549572, 43.837883],
          [114.305393, 30.593099]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Hailing",
        coords: [
          [126.549572, 43.837883],
          [119.919425, 32.491016]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Rizhao",
        coords: [
          [126.549572, 43.837883],
          [119.526888, 35.416377]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Taizhou",
        coords: [
          [126.549572, 43.837883],
          [121.420757, 28.656386]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Xiamen",
        coords: [
          [123.42944, 41.835441],
          [118.089425, 24.479834]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Guiyang",
        coords: [
          [126.661669, 45.742347],
          [106.630154, 26.647661]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Anshan",
        coords: [
          [126.549572, 43.837883],
          [122.994329, 41.108647]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Rongcheng",
        coords: [
          [123.42944, 41.835441],
          [122.486658, 37.16516]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Tianjin",
        coords: [
          [126.661669, 45.742347],
          [117.200983, 39.084158]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Hexi",
        coords: [
          [126.661669, 45.742347],
          [117.223372, 39.109563]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Qinhuangdao",
        coords: [
          [126.661669, 45.742347],
          [119.600493, 39.935385]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Jingzhou",
        coords: [
          [126.549572, 43.837883],
          [112.239741, 30.335165]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "东城",
        coords: [
          [126.661669, 45.742347],
          [116.416357, 39.928353]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Jimo",
        coords: [
          [126.549572, 43.837883],
          [120.447128, 36.389639]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Xicheng",
        coords: [
          [123.42944, 41.835441],
          [116.365868, 39.912289]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Daxing",
        coords: [
          [126.661669, 45.742347],
          [116.341395, 39.726929]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Harbin",
        coords: [
          [114.475704, 38.584854],
          [126.534967, 45.803775]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jiangsu",
        coords: [
          [126.661669, 45.742347],
          [118.763232, 32.061707]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Peace",
        coords: [
          [126.549572, 43.837883],
          [117.21451, 39.116949]
        ]
      },
      {
        fromName: "Jiangsu",
        toName: "Chicken East",
        coords: [
          [118.763232, 32.061707],
          [131.12408, 45.260412]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Huinan",
        coords: [
          [123.42944, 41.835441],
          [126.046912, 42.684993]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Shenzhen",
        coords: [
          [126.549572, 43.837883],
          [114.057868, 22.543099]
        ]
      },
      {
        fromName: "Fujian",
        toName: "Taishun",
        coords: [
          [119.295144, 26.10078],
          [119.717649, 27.556884]
        ]
      },
      {
        fromName: "Shanghai",
        toName: "Shenzhen",
        coords: [
          [121.473701, 31.230416],
          [114.057868, 22.543099]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Qinhuangdao",
        coords: [
          [126.549572, 43.837883],
          [119.600493, 39.935385]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xuhui",
        coords: [
          [126.549572, 43.837883],
          [121.436525, 31.188523]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Shijingshan",
        coords: [
          [126.549572, 43.837883],
          [116.222982, 39.906611]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Chengyang",
        coords: [
          [123.42944, 41.835441],
          [120.39631, 36.307064]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Weihai",
        coords: [
          [126.661669, 45.742347],
          [122.12042, 37.513068]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Huizhou",
        coords: [
          [126.661669, 45.742347],
          [114.416196, 23.111847]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Longkou",
        coords: [
          [126.549572, 43.837883],
          [120.477813, 37.646108]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Siping",
        coords: [
          [126.661669, 45.742347],
          [124.350398, 43.16642]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Nanchong",
        coords: [
          [126.549572, 43.837883],
          [106.110698, 30.837793]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Donggang",
        coords: [
          [114.475704, 38.584854],
          [124.152705, 39.863008]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Xi'an",
        coords: [
          [123.42944, 41.835441],
          [108.940175, 34.341568]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Binhai",
        coords: [
          [111.765618, 40.817498],
          [119.820831, 33.990334]
        ]
      },
      {
        fromName: "Henan",
        toName: "Qingdao",
        coords: [
          [113.274379, 34.445122],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Kunshan",
        coords: [
          [126.661669, 45.742347],
          [120.980737, 31.385598]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Changsha",
        coords: [
          [123.42944, 41.835441],
          [112.938814, 28.228209]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Harbin",
        coords: [
          [126.549572, 43.837883],
          [126.534967, 45.803775]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Shangzhi",
        coords: [
          [114.475704, 38.584854],
          [128.009895, 45.209586]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "东城",
        coords: [
          [123.42944, 41.835441],
          [116.416357, 39.928353]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Zhuhai",
        coords: [
          [123.42944, 41.835441],
          [113.576726, 22.270715]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Tieling",
        coords: [
          [126.661669, 45.742347],
          [123.726166, 42.223769]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Penglai",
        coords: [
          [126.661669, 45.742347],
          [120.758848, 37.810661]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Tianjin",
        coords: [
          [116.407526, 39.90403],
          [117.200983, 39.084158]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Tianjin",
        coords: [
          [111.765618, 40.817498],
          [117.200983, 39.084158]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Ningbo",
        coords: [
          [126.661669, 45.742347],
          [121.550357, 29.874557]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Shanghai",
        coords: [
          [126.549572, 43.837883],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Foshan",
        coords: [
          [123.42944, 41.835441],
          [113.121416, 23.021548]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Changning",
        coords: [
          [126.549572, 43.837883],
          [121.424624, 31.220367]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Hunchun",
        coords: [
          [126.661669, 45.742347],
          [130.366036, 42.862821]
        ]
      },
      {
        fromName: "Shandong",
        toName: "Huangpu",
        coords: [
          [117.020359, 36.66853],
          [121.484443, 31.231763]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Weihai",
        coords: [
          [123.42944, 41.835441],
          [122.12042, 37.513068]
        ]
      },
      {
        fromName: "Tianjin",
        toName: "Changchun",
        coords: [
          [117.200983, 39.084158],
          [125.323544, 43.817072]
        ]
      },
      {
        fromName: "Xinjiang",
        toName: "Shanghai",
        coords: [
          [87.627704, 43.793026],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Jixi",
        coords: [
          [114.475704, 38.584854],
          [130.969333, 45.295075]
        ]
      },
      {
        fromName: "Shaanxi",
        toName: "Hohhot",
        coords: [
          [108.954239, 34.265472],
          [111.749181, 40.842585]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Lianyungang",
        coords: [
          [126.549572, 43.837883],
          [119.221611, 34.596653]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Hangzhou",
        coords: [
          [126.661669, 45.742347],
          [120.15507, 30.274085]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jiaxing",
        coords: [
          [126.661669, 45.742347],
          [120.755486, 30.746129]
        ]
      },
      {
        fromName: "Shaanxi",
        toName: "Panjin",
        coords: [
          [108.954239, 34.265472],
          [122.070714, 41.119997]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Tongjiang",
        coords: [
          [114.475704, 38.584854],
          [132.510919, 47.642707]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Hangzhou",
        coords: [
          [126.549572, 43.837883],
          [120.15507, 30.274085]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Zhoushan",
        coords: [
          [126.661669, 45.742347],
          [122.207216, 29.985295]
        ]
      },
      {
        fromName: "Henan",
        toName: "Dalian",
        coords: [
          [113.274379, 34.445122],
          [121.614682, 38.914003]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Mianyang",
        coords: [
          [123.42944, 41.835441],
          [104.679114, 31.46745]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xupu",
        coords: [
          [126.549572, 43.837883],
          [110.594921, 27.908281]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Chaoyang",
        coords: [
          [126.549572, 43.837883],
          [116.443108, 39.92147]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Wuxi",
        coords: [
          [126.549572, 43.837883],
          [120.31191, 31.49117]
        ]
      },
      {
        fromName: "Zhejiang",
        toName: "Shenyang",
        coords: [
          [120.152792, 30.267447],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Huli",
        coords: [
          [126.549572, 43.837883],
          [118.146769, 24.512905]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Wuxi",
        coords: [
          [126.661669, 45.742347],
          [120.31191, 31.49117]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Changning",
        coords: [
          [126.661669, 45.742347],
          [121.424624, 31.220367]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Jiaozhou",
        coords: [
          [123.42944, 41.835441],
          [120.033382, 36.26468]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Qingdao",
        coords: [
          [126.549572, 43.837883],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Haidian",
        coords: [
          [114.475704, 38.584854],
          [116.298056, 39.959912]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Xiamen",
        coords: [
          [126.661669, 45.742347],
          [118.089425, 24.479834]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Zhongshan",
        coords: [
          [126.661669, 45.742347],
          [113.392782, 22.517646]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Taiyuan",
        coords: [
          [114.475704, 38.584854],
          [112.548879, 37.87059]
        ]
      },
      {
        fromName: "Xinjiang",
        toName: "Jilin",
        coords: [
          [87.627704, 43.793026],
          [126.549572, 43.837883]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Marquis Wu",
        coords: [
          [126.549572, 43.837883],
          [104.04339, 30.641982]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Langfang",
        coords: [
          [116.407526, 39.90403],
          [116.683752, 39.538047]
        ]
      },
      {
        fromName: "Zhejiang",
        toName: "Linfen",
        coords: [
          [120.152792, 30.267447],
          [111.518976, 36.088005]
        ]
      },
      {
        fromName: "Hubei",
        toName: "Tianjin",
        coords: [
          [114.341862, 30.546498],
          [117.200983, 39.084158]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Quanzhou",
        coords: [
          [126.661669, 45.742347],
          [118.675676, 24.874132]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Wenzhou",
        coords: [
          [126.661669, 45.742347],
          [120.699367, 27.994267]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Tangshan",
        coords: [
          [126.661669, 45.742347],
          [118.180194, 39.630867]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Tieling",
        coords: [
          [116.407526, 39.90403],
          [123.726166, 42.223769]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Jimo",
        coords: [
          [123.42944, 41.835441],
          [120.447128, 36.389639]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Shanghai",
        coords: [
          [116.407526, 39.90403],
          [121.473701, 31.230416]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Guangzhou",
        coords: [
          [126.661669, 45.742347],
          [113.264435, 23.129163]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Langfang",
        coords: [
          [126.549572, 43.837883],
          [116.683752, 39.538047]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Rongcheng",
        coords: [
          [126.661669, 45.742347],
          [122.486658, 37.16516]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Haicheng",
        coords: [
          [126.549572, 43.837883],
          [122.685217, 40.882377]
        ]
      },
      {
        fromName: "Hunan",
        toName: "Shenyang",
        coords: [
          [112.98381, 28.112444],
          [123.431475, 41.805698]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Qingdao",
        coords: [
          [116.407526, 39.90403],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Dalian",
        coords: [
          [114.475704, 38.584854],
          [121.614682, 38.914003]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Zhuhai",
        coords: [
          [111.765618, 40.817498],
          [113.576726, 22.270715]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Fangshan",
        coords: [
          [126.661669, 45.742347],
          [116.143267, 39.749144]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jintan",
        coords: [
          [126.661669, 45.742347],
          [119.597897, 31.723247]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Qiqihar",
        coords: [
          [114.475704, 38.584854],
          [126.661669, 45.742347]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Daxing",
        coords: [
          [126.549572, 43.837883],
          [116.341395, 39.726929]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Miyun",
        coords: [
          [126.549572, 43.837883],
          [116.801346, 40.35874]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Peace",
        coords: [
          [126.661669, 45.742347],
          [117.21451, 39.116949]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Longjing",
        coords: [
          [111.765618, 40.817498],
          [129.427066, 42.766311]
        ]
      },
      {
        fromName: "Jilin",
        toName: "道里",
        coords: [
          [126.549572, 43.837883],
          [126.616957, 45.755777]
        ]
      },
      {
        fromName: "Shandong",
        toName: "Wuhan",
        coords: [
          [117.020359, 36.66853],
          [114.305393, 30.593099]
        ]
      },
      {
        fromName: "Gansu",
        toName: "Changshu",
        coords: [
          [103.826308, 36.059421],
          [120.752481, 31.654376]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Yantai",
        coords: [
          [126.661669, 45.742347],
          [121.447935, 37.463822]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Haidian",
        coords: [
          [126.549572, 43.837883],
          [116.298056, 39.959912]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Changsha",
        coords: [
          [126.661669, 45.742347],
          [112.938814, 28.228209]
        ]
      },
      {
        fromName: "Tianjin",
        toName: "Shijiazhuang",
        coords: [
          [117.200983, 39.084158],
          [114.51486, 38.042307]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Foshan",
        coords: [
          [126.549572, 43.837883],
          [113.121416, 23.021548]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "黄华",
        coords: [
          [123.42944, 41.835441],
          [117.330048, 38.371383]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Zhongshan",
        coords: [
          [111.765618, 40.817498],
          [113.392782, 22.517646]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Beijing",
        coords: [
          [126.661669, 45.742347],
          [116.407526, 39.90403]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "三河",
        coords: [
          [126.661669, 45.742347],
          [117.078295, 39.982718]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Qing'an",
        coords: [
          [114.475704, 38.584854],
          [127.507825, 46.880102]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Changsha",
        coords: [
          [126.549572, 43.837883],
          [112.938814, 28.228209]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Xi'an",
        coords: [
          [126.661669, 45.742347],
          [108.940175, 34.341568]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Chaoyang",
        coords: [
          [111.765618, 40.817498],
          [116.443108, 39.92147]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Fengtai",
        coords: [
          [123.42944, 41.835441],
          [116.287149, 39.858427]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Yanji",
        coords: [
          [126.661669, 45.742347],
          [129.508946, 42.891255]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Changchun",
        coords: [
          [126.661669, 45.742347],
          [125.323544, 43.817072]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Tianjin",
        coords: [
          [126.549572, 43.837883],
          [117.200983, 39.084158]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Changping",
        coords: [
          [126.549572, 43.837883],
          [116.231204, 40.22066]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Ganzhou",
        coords: [
          [126.549572, 43.837883],
          [114.93503, 25.831829]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xiamen",
        coords: [
          [126.549572, 43.837883],
          [118.089425, 24.479834]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Qinhuangdao",
        coords: [
          [111.765618, 40.817498],
          [119.600493, 39.935385]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Heze",
        coords: [
          [111.765618, 40.817498],
          [115.480656, 35.23375]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Minhang",
        coords: [
          [126.549572, 43.837883],
          [121.381709, 31.112813]
        ]
      },
      {
        fromName: "Liaoning",
        toName: "Shijingshan",
        coords: [
          [123.42944, 41.835441],
          [116.222982, 39.906611]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Zhuhai",
        coords: [
          [126.549572, 43.837883],
          [113.576726, 22.270715]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Qingdao",
        coords: [
          [111.765618, 40.817498],
          [120.38264, 36.067082]
        ]
      },
      {
        fromName: "Beijing",
        toName: "Haimen",
        coords: [
          [116.407526, 39.90403],
          [121.181615, 31.871173]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Changchun",
        coords: [
          [111.765618, 40.817498],
          [125.323544, 43.817072]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Chengyang",
        coords: [
          [126.549572, 43.837883],
          [120.39631, 36.307064]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Datong",
        coords: [
          [126.549572, 43.837883],
          [113.61244, 40.040295]
        ]
      },
      {
        fromName: "Hubei",
        toName: "Xingtai",
        coords: [
          [114.341862, 30.546498],
          [114.504844, 37.070589]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Jiaozhou",
        coords: [
          [126.549572, 43.837883],
          [120.033382, 36.26468]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Chongqing",
        coords: [
          [126.549572, 43.837883],
          [106.551557, 29.56301]
        ]
      },
      {
        fromName: "Hebei",
        toName: "Jiamusi",
        coords: [
          [114.475704, 38.584854],
          [130.318917, 46.799923]
        ]
      },
      {
        fromName: "Gansu",
        toName: "Dalian",
        coords: [
          [103.826308, 36.059421],
          [121.614682, 38.914003]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Nanjing",
        coords: [
          [126.549572, 43.837883],
          [118.796877, 32.060255]
        ]
      },
      {
        fromName: "Inner Mongolia",
        toName: "Rizhao",
        coords: [
          [111.765618, 40.817498],
          [119.526888, 35.416377]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Chicken East",
        coords: [
          [126.549572, 43.837883],
          [131.12408, 45.260412]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jimo",
        coords: [
          [126.661669, 45.742347],
          [120.447128, 36.389639]
        ]
      },
      {
        fromName: "Jiangsu",
        toName: "Chaoyang",
        coords: [
          [118.763232, 32.061707],
          [116.443108, 39.92147]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Nantong",
        coords: [
          [126.549572, 43.837883],
          [120.894291, 31.980172]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Zhangjiagang",
        coords: [
          [126.661669, 45.742347],
          [120.553284, 31.870367]
        ]
      },
      {
        fromName: "Jilin",
        toName: "三河",
        coords: [
          [126.549572, 43.837883],
          [117.078295, 39.982718]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Xianyang",
        coords: [
          [126.549572, 43.837883],
          [108.708991, 34.329605]
        ]
      },
      {
        fromName: "Jilin",
        toName: "Zhongshan",
        coords: [
          [126.549572, 43.837883],
          [113.392782, 22.517646]
        ]
      },
      {
        fromName: "Heilongjiang",
        toName: "Jiaozhou",
        coords: [
          [126.661669, 45.742347],
          [120.033382, 36.26468]
        ]
      }
    ]
  }
  const option = {
    animation: false,
    backgroundColor: "rgba(0, 0, 0, 0.5)",

    title: {
      text: "Population migration map",
      left: "center",
      textStyle: {
        color: "#fff"
      }
    },
    legend: {
      show: false,
      orient: "vertical",
      top: "bottom",
      left: "right",
      data: ["location", "route"],
      textStyle: {
        color: "#fff"
      }
    },
    series: [
      {
        name: "location",
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        zlevel: 2,
        rippleEffect: {
          brushType: "stroke"
        },
        label: {
          emphasis: {
            show: true,
            position: "right",
            formatter: "{b}"
          }
        },
        symbolSize: 2,
        showEffectOn: "render",
        itemStyle: {
          normal: {
            color: "#46bee9"
          }
        },
        data: allData.citys
      },
      {
        name: "Line",
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 2,
        large: true,
        effect: {
          show: true,
          constantSpeed: 30,
          symbol: "pin",
          symbolSize: 3,
          trailLength: 0
        },
        lineStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#58B3CC"
                },
                {
                  offset: 1,
                  color: "#F58158"
                }
              ],
              false
            ),
            width: 1,
            opacity: 0.2,
            curveness: 0.1
          }
        },
        data: allData.moveLines
      }
    ]
  }
  return option
}
