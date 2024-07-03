// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    homeButton: false // Method 1: Add control in options - perspective reset control control (Cesium native)
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

  //Modify the control title
  // document.getElementsByClassName("cesium-home-button")[0].setAttribute("title", "reset")

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  const homeButton = new mars3d.control.HomeButton({
    title: "Reset",
    icon: "img/svg/homeButton.svg",
    click: function (event) {
      console.log("HomeButton custom click method")
      map.flyHome()
    }
  })
  map.addControl(homeButton)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
