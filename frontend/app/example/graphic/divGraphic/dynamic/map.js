// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer
const centerArr = [] //View array
// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.84646, lng: 117.223095, alt: 790, heading: 189, pitch: -13 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:30"
    }
  },
  control: {
    // animation: true, //Whether to create animation widget, instrument in the lower left corner
    timeline: true,
    clockAnimate: true,
    distanceLegend: { left: "100px", bottom: "27px" }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Create DIV data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  showDitailInfo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const arrData = [
  {
    title: "China Anhui Radio and Television Station",
    description: "Anhui Radio and Television Station (AHTV) is a provincial-level comprehensive radio and television media organization that integrates radio, television, newspapers, </br>Internet, new media and other businesses.",
    center: { lat: 31.817346, lng: 117.216403, alt: 342, heading: 168, pitch: -13, duration: 2 },
    position: [117.219971, 31.808482, 264.9],
    startTime: "2017/08/25 08:00:04",
    endTime: "2017/08/25 08:00:07"
  },
  {
    title: "Hefei Municipal Affairs Center",
    description: "The Hefei Municipal People's Government Government Service Center is an agency dispatched by the Municipal Party Committee and the Municipal Government. </br>The service center has established a Party Working Committee and a Management Committee, including a General Office, an </br>Supervision Office, and an Approval Project Coordination Office. ",
    center: { lat: 31.818069, lng: 117.221763, alt: 173, heading: 355, pitch: -5, duration: 3 },
    position: [117.222139, 31.822782, 166.6],
    startTime: "2017/08/25 08:00:09",
    endTime: "2017/08/25 08:00:12"
  },
  {
    title: "Hefei Culture and Tourism Bureau",
    description: "Hefei Municipal Culture and Tourism Bureau and Municipal Culture and Tourism Bureau are working departments of the municipal government,</br>at the director level, and are branded with the Municipal Radio, Television, Press and Publication Bureau",
    center: { lat: 31.813929, lng: 117.217225, alt: 142, heading: 330, pitch: -14, duration: 3 },
    position: [117.215827, 31.818229, 84.6],
    startTime: "2017/08/25 08:00:14",
    endTime: "2017/08/25 08:00:17"
  },
  {
    title: "Hefei Grand Theater",
    description: "Hefei Grand Theater, also known as Swan Lake Grand Theatre, is mainly composed of opera hall, concert hall, multi-functional hall and other parts.",
    center: { lat: 31.815301, lng: 117.218273, alt: 107, heading: 11, pitch: -13, duration: 3 },
    position: [117.218782, 31.8176, 64.9],
    startTime: "2017/08/25 08:00:19",
    endTime: "2017/08/25 08:00:22"
  }
]

function showDitailInfo() {
  for (let i = 0; i < arrData.length; i++) {
    //Dynamic coordinate properties
    const property = new Cesium.SampledPositionProperty()
    const startTime = Cesium.JulianDate.fromDate(new Date(arrData[i].startTime))
    const endTime = Cesium.JulianDate.fromDate(new Date(arrData[i].endTime))

    property.addSample(startTime, Cesium.Cartesian3.fromDegrees(...arrData[i].position)) // Display at this moment
    property.addSample(endTime, Cesium.Cartesian3.fromDegrees(...arrData[i].position)) // Not displayed at this moment

    const stopTime = new Date(arrData[i].endTime).getSeconds() - new Date(arrData[i].startTime).getSeconds()

    arrData[i].center.stop = stopTime // Stop perspective
    centerArr.push(arrData[i].center) // center collection

    const graphic = new mars3d.graphic.DivGraphic({
      position: property,
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
                  <div class="title">${arrData[i].title}</div>
                  <div class="label-content">
                      <div class="data-li">
                          <div class="data-value"><span class="label-unit">${arrData[i].description}</span>
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
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  map.setCameraViewList(centerArr) // Perspective
}
