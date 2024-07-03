// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    locationBar: false // Currently demonstrated sample control - scale bar control
  }
  return option
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  const locationBar = new mars3d.control.LocationBar({
    template:
      "<div>Longitude: {lng}</div><div>Latitude: {lat}</div> <div>Altitude: {alt} meters</div> <div>Level: {level}</div> <div>Direction: {heading} degrees</div> <div>Pitch angle: {pitch} degrees</div><div>View height: {cameraHeight} meters</div><div>Frame rate: {fps} FPS</div>"
    // template: function (locationData) {
    //   let pitch
    //   if (locationData.pitch < 0) {
    // pitch = "Looking down:" + -locationData.pitch
    //   } else {
    // pitch = "Looking up:" + locationData.pitch
    //   }

    //   const dfmX = mars3d.PointTrans.degree2dms(locationData.lng).str
    //   const dfmY = mars3d.PointTrans.degree2dms(locationData.lat).str

    // return ` <div>Longitude:${locationData.lat} , ${dfmY}</div>
    // <div>Latitude:${locationData.lng}, ${dfmX}</div>
    // <div>Altitude: ${locationData.alt} meters</div>
    // <div>Direction: ${locationData.heading} degrees</div>
    // <div>${pitch}degree</div>
    // <div>View height: ${locationData.cameraHeight} meters</div>`
    // }
  })
  map.addControl(locationBar)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
