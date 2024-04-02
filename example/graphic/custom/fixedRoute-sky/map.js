// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Air Roaming",
    timeField: "datatime",
    positions: [
      { lng: 117.217898, lat: 31.80021, alt: 500, datatime: "2021/3/25 0:01:00" },
      { lng: 117.217535, lat: 31.815032, alt: 500, datatime: "2021/3/25 0:01:30" },
      { lng: 117.21596, lat: 31.853067, alt: 500, datatime: "2021/3/25 0:02:10" }
    ],
    clockLoop: true, // Whether to loop playback
    interpolation: true, // setInterpolationOptions interpolation
    camera: {
      type: "dy",
      followedX: 50,
      followedZ: 10
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  //UI panel information display
  fixedRoute.on(mars3d.EventType.change, (event) => {
    throttled(eventTarget.fire("roamLineChange", event), 500)
  })

  // Start roaming
  fixedRoute.start()

  addDivPoint(fixedRoute.property)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDivPoint(position) {
  //Create DIV data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const graphic = new mars3d.graphic.DivGraphic({
    position,
    hasCache: false,
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-blue">
                  <div class="marsTiltPanel-wrap">
                      <div class="area">
                          <div class="arrow-lt"></div>
                          <div class="b-t"></div>
                          <div class="b-r"></div>
                          <div class="b-b"></div>
                          <div class="b-l"></div>
                          <div class="arrow-rb"></div>
                          <div class="label-wrap">
                              <div class="title">Entrepreneurship Avenue</div>
                              <div class="label-content">
                                  <div class="data-li">
                                      <div class="data-label">Current location:</div>
                                      <div class="data-value">No. XX, Shushan District, Hefei City, Anhui Province </div>
                                  </div>
                                  <div class="data-li">
                                      <div class="data-label">Output value this year:</div>
                                      <div class="data-value"><span class="label-num">99</span><span class="label-unit">billion yuan</span>
                                      </div>
                                  </div>
                                  <div class="data-li">
                                      <div class="data-label">Current photo:</div>
                                      <div class="data-value"><img src="http://marsgis.cn/img/common/logo.png"> </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="b-t-l"></div>
                      <div class="b-b-r"></div>
                  </div>
                  <div class="arrow" ></div>
              </div>`,
      scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 100000, 0.1)
    }
  })
  graphicLayer.addGraphic(graphic)
}

//Used by ui layer
var formatDistance = mars3d.MeasureUtil.formatDistance
var formatTime = mars3d.Util.formatTime

// Throttle
function throttled(fn, delay) {
  let timer = null
  let starttime = Date.now()
  return function () {
    const curTime = Date.now() // current time
    const remaining = delay - (curTime - starttime)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    clearTimeout(timer)
    if (remaining <= 0) {
      fn.apply(context, args)
      starttime = Date.now()
    } else {
      timer = setTimeout(fn, remaining)
    }
  }
}
