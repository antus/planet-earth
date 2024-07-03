// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.126986, lng: 115.78076, alt: 4758203, heading: 351, pitch: -77 }
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

  //Create vector data layer (business data layer)
  const busineDataLayer = new mars3d.layer.BusineDataLayer({
    url: "//data.mars3d.cn/file/apidemo/mudi-all.json",
    dataColumn: "data", //The value field name where the corresponding list is located in the data interface
    lngColumn: "lng",
    latColumn: "lat",
    altColumn: "z",
    symbol: {
      type: "billboardP", // corresponds to mars3d.graphic.BillboardPrimitive
      styleOptions: {
        image: "img/marker/mark-blue.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
        label: {
          text: "{text}",
          font_size: 17,
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(15, 0), // offset
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 90000)
        }
      }
    }
  })
  map.addLayer(busineDataLayer)

  busineDataLayer.bindPopup(function (event) {
    const item = event.graphic?.attr
    if (!item) {
      return false
    }
    const inthtml = `
      <table style="width: auto;">
        <tr><th scope="col" colspan="2" style="text-align:center;font-size:15px;">${item.text} </th> </tr>
        <tr> <td>Province:</td> <td>${item.province}</td></tr>
        <tr> <td>City:</td> <td>${item.city}</td></tr>
        <tr><td>County/district:</td> <td>${item.district}</td> </tr>
        <tr><td>Address:</td> <td>${item.address}</td> </tr>
        <tr> <td>Video:</td><td><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" >< /video></td></tr>
      </table>`
    return inthtml
  })

  // click event
  busineDataLayer.on(mars3d.EventType.click, function (event) {
    console.log("You clicked", event)

    if (map.camera.positionCartographic.height > 90000) {
      const graphic = event.graphic
      const position = graphic.position
      map.flyToPoint(position, {
        radius: 5000, // distance from the target point
        duration: 4,
        complete: function (e) {
          //Flight completion callback method
        }
      })
    }
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
