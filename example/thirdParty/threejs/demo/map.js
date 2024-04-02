// import * as mars3d from "mars3d"
// import ThreeLayer from "./ThreeLayer"

var map // mars3d.Map three-dimensional map object
let threeLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.980053, lng: 117.375049, alt: 110976, heading: 357, pitch: -50 }
    // useDefaultRenderLoop: false
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

  threeLayer = new ThreeLayer()
  map.addLayer(threeLayer)

  init3DObject()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// In the coordinate system space of three, first translate the model to the Z axis, and then flip it upward 90 degrees around the X axis. The object will face the Y axis, corresponding to the Z axis of Cesiumn.
/**
 * coordinate system of three (right-hand coordinate system), key data structure Vector3
 *    Y
 *    |
 *    |___ X
 *   /
 * Z
 *
 * Cesium's coordinate system, key data structure Cartesian3
 *    Z
 *    |
 *    |__ Y
 *   /
 * X
 *
 */

function init3DObject() {
  let minWGS84 = [117.142184, 31.869697]
  let maxWGS84 = [117.357015, 31.713898]

  // const center = Cesium.Cartesian3.fromDegrees(
  //   (minWGS84[0] + maxWGS84[0]) / 2,
  //   (minWGS84[1] + maxWGS84[1]) / 2 - 1,
  //   200000
  // )
  // map.camera.flyTo({
  //   destination: center,
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-60),
  //     roll: Cesium.Math.toRadians(0)
  //   },
  //   duration: 3
  // })

  const arrXdObj = []

  const doubleSideMaterial = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide
  })
  const segments = 10
  const points = []
  for (let i = 0; i < segments; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2))
  }
  let geometry = new THREE.LatheGeometry(points)
  const latheMesh = new THREE.Mesh(geometry, doubleSideMaterial)
  latheMesh.scale.set(1500, 1500, 1500) // scale object to be visible at planet scale
  latheMesh.position.z += 15000 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
  latheMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
  const latheMeshYup = new THREE.Group()
  latheMeshYup.add(latheMesh)
  threeLayer.scene.add(latheMeshYup) // don’t forget to add it to the Three.js scene manually

  // Assign Three.js object mesh to our object array
  let xdObj = new XDObject()
  xdObj.threeMesh = latheMeshYup
  xdObj.minWGS84 = minWGS84
  xdObj.maxWGS84 = maxWGS84
  arrXdObj.push(xdObj)

  // dodecahedron
  geometry = new THREE.DodecahedronGeometry()
  const dodecahedronMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())
  dodecahedronMesh.scale.set(10000, 10000, 10000) // scale object to be visible at planet scale
  dodecahedronMesh.position.z += 10000 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
  dodecahedronMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
  const dodecahedronMeshYup = new THREE.Group()
  dodecahedronMeshYup.add(dodecahedronMesh)
  threeLayer.scene.add(dodecahedronMeshYup) // don’t forget to add it to the Three.js scene manually

  // Assign Three.js object mesh to our object array
  xdObj = new XDObject()
  xdObj.threeMesh = dodecahedronMeshYup
  xdObj.minWGS84 = minWGS84
  xdObj.maxWGS84 = maxWGS84
  arrXdObj.push(xdObj)

  // Configure Three.js meshes to stand against globe center position up direction
  for (const id in arrXdObj) {
    minWGS84 = arrXdObj[id].minWGS84
    maxWGS84 = arrXdObj[id].maxWGS84
    // convert lat/long center position to Cartesian3
    const center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2)

    // get forward direction for orienting model
    const centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2, 1)

    // use direction from bottom left to top left as up-vector

    // configure entity position and orientation
    arrXdObj[id].threeMesh.position.copy(center)
    arrXdObj[id].threeMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z)
  }
}

function XDObject() {
  this.threeMesh = null
  this.minWGS84 = null
  this.maxWGS84 = null
}
