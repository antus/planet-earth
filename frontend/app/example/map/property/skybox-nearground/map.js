// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.830035, lng: 117.159801, alt: 409, heading: 41, pitch: 0 },
    showSkyAtmosphere: false, // needs to be closed
    skyBox: {
      type: "ground",
      sources: {
        positiveX: "/img/skybox_near/qingtian/rightav9.jpg",
        negativeX: "/img/skybox_near/qingtian/leftav9.jpg",
        positiveY: "/img/skybox_near/qingtian/frontav9.jpg",
        negativeY: "/img/skybox_near/qingtian/backav9.jpg",
        positiveZ: "/img/skybox_near/qingtian/topav9.jpg",
        negativeZ: "/img/skybox_near/qingtian/bottomav9.jpg"
      }
    }
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
  // map.scene.skyAtmosphere.show = false
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function sunny() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "/img/skybox_near/qingtian/rightav9.jpg",
      negativeX: "/img/skybox_near/qingtian/leftav9.jpg",
      positiveY: "/img/skybox_near/qingtian/frontav9.jpg",
      negativeY: "/img/skybox_near/qingtian/backav9.jpg",
      positiveZ: "/img/skybox_near/qingtian/topav9.jpg",
      negativeZ: "/img/skybox_near/qingtian/bottomav9.jpg"
    }
  })
}

function sunsetGlow() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "/img/skybox_near/wanxia/SunSetRight.png",
      negativeX: "/img/skybox_near/wanxia/SunSetLeft.png",
      positiveY: "/img/skybox_near/wanxia/SunSetFront.png",
      negativeY: "/img/skybox_near/wanxia/SunSetBack.png",
      positiveZ: "/img/skybox_near/wanxia/SunSetUp.png",
      negativeZ: "/img/skybox_near/wanxia/SunSetDown.png"
    }
  })
}

function blueSky() {
  // map.scene.skyBox = new mars3d.GroundSkyBox({
  //   sources: {
  //     positiveX: "/img/skybox_near/lantian/Right.jpg",
  //     negativeX: "/img/skybox_near/lantian/Left.jpg",
  //     positiveY: "/img/skybox_near/lantian/Front.jpg",
  //     negativeY: "/img/skybox_near/lantian/Back.jpg",
  //     positiveZ: "/img/skybox_near/lantian/Up.jpg",
  //     negativeZ: "/img/skybox_near/lantian/Down.jpg"
  //   }
  // })

  // Modification method two, map.setOptions method
  map.setOptions({
    scene: {
      skyBox: {
        type: "ground",
        sources: {
          positiveX: "/img/skybox_near/lantian/Right.jpg",
          negativeX: "/img/skybox_near/lantian/Left.jpg",
          positiveY: "/img/skybox_near/lantian/Front.jpg",
          negativeY: "/img/skybox_near/lantian/Back.jpg",
          positiveZ: "/img/skybox_near/lantian/Up.jpg",
          negativeZ: "/img/skybox_near/lantian/Down.jpg"
        }
      }
    }
  })
}

function defaultSky() {
  // Modification method two, map.setOptions method
  map.setOptions({
    scene: {
      skyBox: { type: "default" }
    }
  })
}
