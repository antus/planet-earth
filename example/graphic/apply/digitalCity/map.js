// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.215956, lng: 121.508605, alt: 887, heading: 5, pitch: -26 }
  },
  layers: [
    {
      type: "3dtiles",
      name: "Shanghai Buildings",
      url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
      maximumScreenSpaceError: 1,
      style: {
        color: "rgb(0, 99, 255)"
      },
      marsJzwStyle: true,
      popup: "all",
      // crop area
      planClip: {
        positions: [
          [121.477666, 31.217061, 19.1],
          [121.531567, 31.217061, 19.1],
          [121.531567, 31.258551, 19.1],
          [121.477666, 31.258551, 19.1]
        ],
        clipOutSide: true
      },
      show: true
    },
    {
      type: "geojson",
      name: "Urban first-class road",
      url: "//data.mars3d.cn/file/geojson/shanghai-road.json",
      symbol: {
        styleOptions: {
          width: 2.0,
          materialType: mars3d.MaterialType.ODLine,
          materialOptions: {
            bgColor: new Cesium.Color(0.1, 0.7, 0.5, 0.4),
            color: new Cesium.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 0.0, 1.0),
            speed: 20 + 1.0 * Math.random(),
            startTime: Math.random()
          }
        }
      },
      popup: "{Name}",
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2017 // switch to blue basemap

  // special effects
  const bloomEffect = new mars3d.effect.BloomEffect({
    enabled: true
  })
  map.addEffect(bloomEffect)

  // // rotate around
  // const rotatePoint = new mars3d.thing.RotatePoint({
  // direction: true, // direction true is counterclockwise, false is clockwise
  // time: 50 // Given the time required for one flight (in seconds), control the speed
  // })
  // map.addThing(rotatePoint)

  //Add vector data
  addCityGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addCityGraphics() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //The center point of the model
  const position = [121.510608, 31.234322, 0] // Used to rotate around + center point spread + rotated image
  const center = Cesium.Cartesian3.fromDegrees(position[0], position[1], 140) // Line used for div annotation and overlooking

  //Center diffusion point
  const circleDiffuseWallGlow = new mars3d.graphic.DiffuseWall({
    name: "Center Diffusion Point",
    position,
    style: {
      diffHeight: 500, // height
      radius: 150, // radius
      color: "#7ffeff",
      speed: 6 // speed
    }
  })
  graphicLayer.addGraphic(circleDiffuseWallGlow)

  // Rotated image -- center fence
  const WallImagePositions = mars3d.PolyUtil.getEllipseOuterPositions({
    position,
    radius: 50, // radius
    count: 50 // Return a total of (count*4) points
  })
  const rotatWallImage = new mars3d.graphic.WallPrimitive({
    positions: WallImagePositions,
    style: {
      diffHeight: 190,
      closure: true,
      materialType: mars3d.MaterialType.RectSlide,
      materialOptions: {
        image: "img/tietu/circular.png",
        speed: 2
      }
    }
  })
  graphicLayer.addGraphic(rotatWallImage)

  // Rotated image -- bottom
  let rotation = Cesium.Math.toRadians(50)
  function getRotationValue() {
    rotation -= 0.007
    return rotation
  }
  const rotatCicleImage = new mars3d.graphic.CircleEntity({
    position,
    style: {
      radius: 500,
      height: 50,
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "/img/textures/circle-two.png"
      },
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    }
  })
  graphicLayer.addGraphic(rotatCicleImage)

  // gltf way: tetrahedron
  // const graphic = new mars3d.graphic.ModelEntity({
  // name: "tetrahedron",
  //   position: [position[0], position[1], 180],
  //   style: {
  //     url: "//data.mars3d.cn/gltf/mars/zhui.glb",
  //     scale: 30
  //   }
  // })
  // graphicLayer.addGraphic(graphic)
  // Start the self-rotation effect
  // graphic.rotateStart({
  // direction: true, // Control direction, true counterclockwise, false clockwise
  // time: 6 // time: given the time required for one flight (in seconds), control the speed
  // })

  // tetrahedron
  const tetrahedron = new mars3d.graphic.Tetrahedron({
    position: [position[0], position[1], 180],
    style: {
      width: 20,
      height: 30,
      color: "rgba(200,200,0,0.7)",
      moveHeight: 50
    }
  })
  graphicLayer.addGraphic(tetrahedron)

  // divgraphic annotation
  const divgraphic = new mars3d.graphic.DivGraphic({
    position: center,
    style: {
      html: `<div class="marsBlackPanel">
          <div class="marsBlackPanel-text">Mars3D International Building</div>
      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // horizontal positioning
      verticalOrigin: Cesium.VerticalOrigin.CENTER // Vertical positioning
    }
  })
  graphicLayer.addGraphic(divgraphic)

  //Scan circle
  const scanCircle = new mars3d.graphic.CircleEntity({
    position: Cesium.Cartesian3.fromDegrees(121.501618, 31.235704, 24.2),
    style: {
      radius: 480.0,
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "/img/textures/circle-scan.png",
        color: "#ffffff"
      },
      stRotation: new Cesium.CallbackProperty(getRotationValue, false),
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(scanCircle)

  // The line from afar, the pointArr of data acquisition
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/shanghai-point.json" })
    .then((result) => {
      const pointArr = []
      result.features.forEach((obj) => {
        pointArr.push({
          name: obj.properties.Name,
          point: obj.geometry.coordinates
        })
      })

      const lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.ODLine, {
        color: new Cesium.Color(1, 1, 1),
        bgColor: new Cesium.Color(0.1, 0.7, 0.5, 0.4),
        speed: 5 + 1.0 * Math.random(),
        startTime: Math.random()
      })

      for (let i = 0, len = pointArr.length; i < len; i++) {
        const item = pointArr[i]

        const color = ["#ffff00", "#81d8ff", "#fff9ed"]
        const thisPoint = Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], 1)
        const positions = mars3d.PolyUtil.getLinkedPointList(center, thisPoint, 40000, 100) // Calculate curve points

        const graphic = new mars3d.graphic.PolylinePrimitive({
          positions,
          style: {
            width: 4,
            material: lineMaterial // animation line material
          }
        })
        graphic.bindPopup(item.name)
        graphicLayer.addGraphic(graphic)

        // Cone
        const coneGlow = new mars3d.graphic.LightCone({
          position: Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], 10),
          style: {
            radius: 10,
            height: 200,
            color: color[i % color.length]
          },
          popup: item.name
        })
        graphicLayer.addGraphic(coneGlow)
      }
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })

  //Vertical flying line
  const arrData = []
  for (let j = 0; j < 100; ++j) {
    const startPt = randomPoint()

    const endPt = startPt.clone()
    endPt.alt = random(600, 1000)

    const startTime = random(0, 10000)
    const speed = random(1, 35)

    arrData.push({
      positions: [startPt, endPt],
      style: {
        width: 1,
        materialType: mars3d.MaterialType.ODLine,
        materialOptions: {
          color: "rgb(255, 255, 2)",
          bgColor: "rgb(255,255,255,0.01)",
          startTime,
          speed
        }
      }
    })
  }
  const upPoly = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(upPoly)
}

// Get random icons in the area; used for merged rendering of line objects
function randomPoint() {
  const jd = random(121.500525 * 1000, 121.518298 * 1000) / 1000
  const wd = random(31.231515 * 1000, 31.24228 * 1000) / 1000
  return new mars3d.LngLatPoint(jd, wd, 50)
}

// Get random numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
