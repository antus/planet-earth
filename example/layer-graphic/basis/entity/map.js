// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // Vector data layer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  // 1. Bind listening events to the map
  /* map.on(mars3d.EventType.clickGraphic, function (event) {
    // clickGraphic
    console.log("Listening to the map, a vector object was clicked", event)
  })
  map.on(mars3d.EventType.mouseMove, function (event) {
    // mouseMove
    console.log("Monitoring map, mouse moved", event)
  }) */

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 2. Bind the listening event on the layer

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })
  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
  addDemoGraphic13(graphicLayer)
  addDemoGraphic14(graphicLayer)
  addDemoGraphic15(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.LabelEntity({
    position: new mars3d.LngLatPoint(116.1, 31.0, 1000),
    style: {
      text: "Mars Technology Mars3D Platform",
      font_size: 25,
      font_family: "楷体",
      color: "#003da6",
      outline: true,
      outlineColor: "#bfbfbf",
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      visibleDepth: false
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PointEntity({
    position: [116.2, 31.0, 1000],
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardEntity({
    name: "Floor icon",
    position: [116.3, 31.0, 1000],
    style: {
      image: "img/marker/mark-blue.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      clampToGround: true
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.PlaneEntity({
    position: new mars3d.LngLatPoint(116.4, 31.0, 1000),
    style: {
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
      dimensions: new Cesium.Cartesian2(4000.0, 4000.0),
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "img/textures/poly-rivers.png",
        transparent: true
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.BoxEntity({
    position: new mars3d.LngLatPoint(116.5, 31.0, 1000),
    style: {
      dimensions: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      fill: true,
      color: "#00ffff",
      opacity: 0.9,
      heading: 45,
      roll: 45,
      pitch: 0
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: [116.1, 30.9, 1000],
    style: {
      radius: 1800.0,
      color: "#00ff00",
      opacity: 0.3,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    popup: "popup that directly passes parameters",
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.CylinderEntity({
    position: [116.2, 30.9, 1000],
    style: {
      length: 3000.0,
      topRadius: 0.0,
      bottomRadius: 1300.0,
      color: "#00FFFF",
      opacity: 0.7
    },
    popup: "popup that directly passes parameters",
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic)
}

//
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(1500.0, 1500.0, 1500.0),
      color: "rgba(255,0,0,0.5)",
      outline: true,
      outlineColor: "rgba(255,255,255,0.3)"
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.ModelEntity({
    name: "Police Car",
    position: [116.4, 30.9, 1000],
    style: {
      url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      scale: 16,
      minimumPixelSize: 100
    },
    attr: { remark: "Example 9" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [116.5, 30.9, 1000],
      [116.52, 30.91, 1000],
      [116.53, 30.89, 1000]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    attr: { remark: "Example 10" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineVolumeEntity({
    positions: [
      [116.1, 30.8, 1000],
      [116.12, 30.81, 1000],
      [116.13, 30.79, 1000]
    ],
    style: {
      shape: "pipeline",
      radius: 80,
      color: "#3388ff",
      opacity: 0.9
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.CorridorEntity({
    positions: [
      [116.2, 30.8, 1000],
      [116.22, 30.81, 1000],
      [116.23, 30.79, 1000],
      [116.247328, 30.806077, 610.41]
    ],
    style: {
      width: 500,
      color: "#3388ff"
    },
    attr: { remark: "Example 12" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [116.3, 30.8, 1000],
      [116.31, 30.81, 1000],
      [116.334639, 30.800735, 721.39],
      [116.32, 30.79, 1000]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      //Animation line material
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#00ff00",
        speed: 10,
        axisY: true
      }
    },
    attr: { remark: "Example 13" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic14(graphicLayer) {
  const graphic = new mars3d.graphic.RectangleEntity({
    positions: [
      [116.383144, 30.819978, 444.42],
      [116.42216, 30.793431, 1048.07]
    ],
    style: {
      color: "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff"
    },
    attr: { remark: "Example 14" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic15(graphicLayer) {
  const groupGraphic = new mars3d.graphic.GroupGraphic() // Group object
  graphicLayer.addGraphic(groupGraphic)

  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [116.510278, 30.834372, 567.29],
      [116.530085, 30.809331, 448.31],
      [116.507367, 30.788551, 98.21],
      [116.472468, 30.823091, 677.39]
    ],
    style: {
      materialType: mars3d.MaterialType.Water,
      materialOptions: {
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 8000.0, // Number that controls the wave number.
        animationSpeed: 0.02, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4" // The rgba color object used when blending from water to non-water.
      }
    },
    attr: { remark: "Example 15" },
    popup: "Example 15-PolygonEntity"
  })
  groupGraphic.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  const graphicLabel = new mars3d.graphic.LabelEntity({
    position: new mars3d.LngLatPoint(116.505298, 30.81396, 420),
    style: {
      text: "I am the water surface",
      font_size: 20,
      visibleDepth: false
    },
    attr: { remark: "Example 15-label" },
    popup: "Example 15-LabelEntity"
  })
  groupGraphic.addGraphic(graphicLabel)

}

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Start editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "Stop editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // When the right click is the editing point
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "Calculate length",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
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
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
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

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}
