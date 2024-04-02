// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  control: {
    homeButton: {
      icon: "img/svg/homeButton.svg"
    }, // Return to default view button
    navigationHelpButton: false, // Whether to display the help information control
    fullscreenButton: false, // Full screen button in the lower right corner
    geocoder: false,
    sceneModePicker: false,
    vrButton: false
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

  let hasSelected = false
  const toolButton = new mars3d.control.ToolButton({
    title: "Example button bookmark",
    icon: "img/svg/bookmarkOne.svg",
    className: ".tool_bookmark_btn",
    insertIndex: 1, // Insert position order, 1 is behind the home button
    click: () => {
      hasSelected = !hasSelected
      if (hasSelected) {
        // toolButton.setIcon("img/icon/good.svg")
        mars3d.DomUtil.addClass(toolButton.container, "toolButton-selected")
        globalMsg("The sample button bookmark is selected, you can do whatever you want in the callback~")
      } else {
        // toolButton.setIcon("img/icon/bookmark-one.svg")
        mars3d.DomUtil.removeClass(toolButton.container, "toolButton-selected")
        globalMsg("The sample button bookmark is unchecked, you can do whatever you want in the callback~")
      }
    }
  })
  map.addControl(toolButton)

  const toolButton2 = new mars3d.control.ToolButton({
    title: "Example button good",
    icon: "img/svg/good.svg",
    className: "tool_good_btn",
    insertIndex: 0, // insert position order
    click: () => {
      globalMsg("Clicked the sample button good, you can do whatever you want in the callback~")
    }
  })
  map.addControl(toolButton2)

  const toolButton3 = new mars3d.control.ToolButton({
    title: "Example button chinese",
    icon: "img/svg/chinese.svg",
    click: () => {
      globalMsg("Clicked the example button chinese, you can do whatever you want in the callback~")
    }
  })
  map.addControl(toolButton3)

  map.controls.homeButton.on(mars3d.EventType.click, function (event) {
    globalMsg("homeButton button clicked")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
