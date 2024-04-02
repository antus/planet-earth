// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 36.873519, lng: 106.863496, alt: 19999205, heading: 354, pitch: -89 },
    cameraController: {
      maximumZoomDistance: 50000000
    },
    skyBox: {
      sources: {
        negativeX: "img/skybox/6/tycho2t3_80_mx.jpg",
        negativeY: "img/skybox/6/tycho2t3_80_my.jpg",
        negativeZ: "img/skybox/6/tycho2t3_80_mz.jpg",
        positiveX: "img/skybox/6/tycho2t3_80_px.jpg",
        positiveY: "img/skybox/6/tycho2t3_80_py.jpg",
        positiveZ: "img/skybox/6/tycho2t3_80_pz.jpg"
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function show1() {
  //Modify the skybox
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/1/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/1/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/1/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/1/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/1/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/1/tycho2t3_80_pz.jpg"
    }
  })
}

function show2() {
  //Modify the skybox
  // map.scene.skyBox = new Cesium.SkyBox({
  //   sources: {
  //     negativeX: "img/skybox/2/tycho2t3_80_mx.jpg",
  //     negativeY: "img/skybox/2/tycho2t3_80_my.jpg",
  //     negativeZ: "img/skybox/2/tycho2t3_80_mz.jpg",
  //     positiveX: "img/skybox/2/tycho2t3_80_px.jpg",
  //     positiveY: "img/skybox/2/tycho2t3_80_py.jpg",
  //     positiveZ: "img/skybox/2/tycho2t3_80_pz.jpg"
  //   }
  // })

  // Modification method two, map.setOptions method
  map.setOptions({
    scene: {
      skyBox: {
        sources: {
          negativeX: "img/skybox/2/tycho2t3_80_mx.jpg",
          negativeY: "img/skybox/2/tycho2t3_80_my.jpg",
          negativeZ: "img/skybox/2/tycho2t3_80_mz.jpg",
          positiveX: "img/skybox/2/tycho2t3_80_px.jpg",
          positiveY: "img/skybox/2/tycho2t3_80_py.jpg",
          positiveZ: "img/skybox/2/tycho2t3_80_pz.jpg"
        }
      }
    }
  })
}

function show3() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/3/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/3/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/3/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/3/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/3/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/3/tycho2t3_80_pz.jpg"
    }
  })
}

function show4() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/4/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/4/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/4/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/4/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/4/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/4/tycho2t3_80_pz.jpg"
    }
  })
}

function show5() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/5/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/5/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/5/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/5/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/5/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/5/tycho2t3_80_pz.jpg"
    }
  })
}

function show6() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/6/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/6/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/6/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/6/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/6/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/6/tycho2t3_80_pz.jpg"
    }
  })
}
