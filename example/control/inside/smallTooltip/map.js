// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // smallTooltip is a simple tooltip. The smallTooltip is currently used in plotting.
  // map.smallTooltip.direction = true; //Change the direction to the left display

  // Close tooltip
  map.closeSmallTooltip()

  map.mouseEvent.enabledMoveDelay = false
  map.on(mars3d.EventType.mouseMove, (event) => {
    map.openSmallTooltip(event.windowPosition, "You can put any html information")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Disable and enable tooltips
 *
 * @param {boolean} enabled The value passed in from the component panel
 * @returns {void} None
 */
function enabledSmallTooltip(enabled) {
  map.smallTooltip.enabled = enabled
}
