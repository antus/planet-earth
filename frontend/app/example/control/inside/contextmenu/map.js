// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer
let graphic // vector data

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  bindMapDemo()

  // map.on(mars3d.EventType.click, function (event) {
  //   map.contextmenu._rightClickHandler(event)
  // })

  map.on(mars3d.EventType.contextMenuOpen, function (event) {
    console.log("Right-click menu opened")
  })
  map.on(mars3d.EventType.contextMenuClose, function (event) {
    console.log("Right-click menu closed")
  })
  map.on(mars3d.EventType.contextMenuClick, function (event) {
    console.log("Right-click menu clicked", event)

    if (event.data.text === "Fly around here") {
      map.contextmenu.rotatePoint.on(mars3d.EventType.change, rotatePoint_onChangeHandler)
    } else if (event.data.text === "Turn off orbiting") {
      map.contextmenu.rotatePoint.off(mars3d.EventType.change, rotatePoint_onChangeHandler)
    }
  })

  // To demonstrate the binding method on the layer
  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.contextMenuOpen, function (event) {
    event.stopPropagation()
    console.log("graphicLayer right-click menu opened")
  })
  graphicLayer.on(mars3d.EventType.contextMenuClose, function (event) {
    event.stopPropagation()
    console.log("graphicLayer right-click menu closed")
  })
  bindLayerDemo()

  // To demonstrate the binding method on the graphic
  graphic = new mars3d.graphic.BoxEntity({
    position: new mars3d.LngLatPoint(116.336525, 31.196721, 323.35),
    style: {
      dimensions: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      fill: true,
      color: "#00ff00",
      opacity: 0.9,
      label: {
        text: "Demonstration of graphic binding",
        font_size: 25,
        font_family: "楷体",
        color: "#003da6",
        outline: true,
        outlineColor: "#bfbfbf",
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    }
  })
  map.graphicLayer.addGraphic(graphic)
  bindGraphicDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function rotatePoint_onChangeHandler(event) {
  console.log("Flying around here, changing the angle", event)
}

// Bind the right-click menu on the map
function bindMapDefault() {
  // const defaultContextmenuItems = map.getDefaultContextMenu() // Built-in default right-click menu acquisition method
  // map.bindContextMenu(defaultContextmenuItems) // You can delete the value in the defaultContextmenuItems array

  // eslint-disable-next-line no-undef
  const defaultContextmenuItems = getDefaultContextMenu(map) // The code is the same as map.getDefaultContextMenu, used for custom modification, the code is in getDefaultContextMenu.js
  map.bindContextMenu(defaultContextmenuItems) // You can delete the value in the defaultContextmenuItems array
}

// Bind the right-click menu on the map
function bindMapDemo() {
  window._test_show = function (e) {
    return Cesium.defined(e.cartesian)
  }
  window._test_callback = function (e) {
    const mpt = mars3d.LngLatPoint.fromCartesian(e.cartesian)
    globalAlert(mpt.toString(), "location information")
  }

  const mapContextmenuItems = [
    {
      text: "Show the latitude and longitude here",
      icon: `<svg class="iconsvg" aria-hidden="true">
              <use xlink:href="#marsgis-qjsjdb"></use>
            </svg>`, // Support iconfont’s symbol mode icon (svg)
      show: "_test_show",
      callback: "_test_callback" // Also supports name configuration of window method
    },
    {
      text: "View current perspective",
      icon: "fa fa-camera-retro", // Support font-class font mode icon
      callback: (e) => {
        const mpt = JSON.stringify(map.getCameraView())
        globalAlert(mpt, "Current perspective information")
      }
    },
    {
      text: "Enable in-depth monitoring",
      icon: "img/icon/monitoring building.png", // Support base64 or url images
      show: function () {
        return !map.scene.globe.depthTestAgainstTerrain
      },
      callback: (e) => {
        map.scene.globe.depthTestAgainstTerrain = true
      }
    },
    {
      text: "Turn off deep monitoring",
      icon: "fa fa-eye",
      show: function () {
        return map.scene.globe.depthTestAgainstTerrain
      },
      callback: (e) => {
        map.scene.globe.depthTestAgainstTerrain = false
      }
    },
    {
      text: "View switching",
      // Also supports direct svg code
      icon: `<svg t="1651975482546" class="iconsvg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2783" width="200" height="200"><path d="M714.4 300.3L419.6 104.1 125 300.3l-28.7 19.2L391 515.8l28.7 19.2 28.7-19.2 294.8-196.3-28.8-19.2zM419.6 496.7L153.7 319.5l265.9-177.1 266 177.1-266 177.2z m0 0" p-id="2784"></path><path d="M685.6 319.5l-266 177.2-265.9-177.2 265.9-177.1 266 177.1z m0 0" p-id="2785"></path><path d="M830.3 958.3h-63.8V830.7H638.9v-63.9h127.7V639.2h63.8v127.6h127.7v63.9H830.3v127.6z m0 0" p-id="2786"></path><path d="M742.8 279.7L419.4 64.2 95.9 279.7 64 300.9v357.3l323.5 215.4 31.9 21.3 31.9-21.3L575 791.2v-76.6L451.3 797V550.6l259.6-173v197.8h63.8V300.9l-31.9-21.2zM387.5 797.2l-259.7-173V377.6l259.6 172.9 0.1 246.7z m31.9-302L153.4 318l265.9-177.1 266 177.1-265.9 177.2zM702.7 703v-73.3l-110 73.3h110z m0 0" p-id="2787"></path><path d="M830.3 958.3h-63.8V830.7H638.9v-63.9h127.7V639.2h63.8v127.6h127.7v63.9H830.3v127.6z m0 0" p-id="2788"></path></svg>`,
      children: [
        {
          text: "Move here",
          icon: "fa fa-send-o",
          show: "flyToForContextmenuShow",
          callback: "flyToForContextmenuClick" // Also supports the "method name" method (such as when configured in config.json)
        }
      ]
    }
  ]
  map.bindContextMenu(mapContextmenuItems)

  map.openContextMenu(new mars3d.LngLatPoint(116.266845, 30.967094, 1000.4).toCartesian())
}

// Demonstrate the "method name" method of the right-click menu (such as when configured in config.json)
window.flyToForContextmenuShow = function (event) {
  return Cesium.defined(event.cartesian)
}
window.flyToForContextmenuClick = function (event) {
  const cameraDistance = Cesium.Cartesian3.distance(event.cartesian, map.camera.positionWC) * 0.1
  map.flyToPoint(event.cartesian, {
    radius: cameraDistance, // distance from the target point
    maximumHeight: map.camera.positionCartographic.height
  })
}

// Unlock the bound right-click menu of Map
function unBindMapDemo() {
  map.unbindContextMenu()
}

//Bind the right-click menu on the layer
function bindLayerDemo() {
  graphicLayer.bindContextMenu([
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphicLayer.removeGraphic(graphic)
        }
      }
    },
    {
      text: "Calculate length",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        return (
          graphic.type === "polyline" ||
          graphic.type === "curve" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "corridor" ||
          graphic.type === "wall"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The length of this object is:" + strDis)
      }
    },
    {
      text: "Calculate perimeter",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon"
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The perimeter of this object is:" + strDis)
      }
    },
    {
      text: "Calculate area",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          ((graphic.type === "polygon" ||
            graphic.type === "polygonP" ||
            graphic.type === "wall" ||
            graphic.type === "scrollWall" ||
            graphic.type === "water") &&
            graphic.positionsShow?.length > 2)
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}

// Unlock the bound right-click menu of Map
function unBindLayerDemo() {
  graphicLayer.unbindContextMenu()
}

// Bind the right-click menu to the graphic data
function bindGraphicDemo() {
  graphic.bindContextMenu([
    {
      text: "Delete object [graphic-bound]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

// Unlock the bound right-click menu of Map
function unBindGraphicDemo() {
  graphic.unbindContextMenu()
}
