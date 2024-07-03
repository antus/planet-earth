const BaseLayer = mars3d.layer.BaseLayer
const THREE = window.THREE

// Integrate with THREE.js
class ThreeLayer extends BaseLayer {
  constructor(options = {}) {
    super(options)

    this._pointerEvents = this.options.pointerEvents
  }

  _showHook(show) {
    if (show) {
      this._threejsContainer.style.visibility = "visible"
    } else {
      this._threejsContainer.style.visibility = "hidden"
    }
  }

  /**
   * Create hook method to add objects to the map,
   * Called every time add
   * @return {void} None
   * @private
   */
  _addedHook() {
    this.initThree()

    this._map.viewer.useDefaultRenderLoop = false // Turn off automatic rendering

    // eslint-disable-next-line
    const that = this
    ;(function frame() {
      // animateFrame: requestAnimationFrame event handle, used for clearing operations
      that._animateFrame = window.requestAnimationFrame(frame)
      that.update() // Execute by frame rate
    })()
  }

  /**
   * Create hook method for object removal from the map,
   * Called every time remove
   * @return {void} None
   * @private
   */
  _removedHook() {
    window.cancelAnimationFrame(this._animateFrame)
    delete this._animateFrame

    this._map.viewer.useDefaultRenderLoop = true

    if (this._threeCanvas) {
      this._map.container.removeChild(this._threeCanvas)
      delete this._threeCanvas
    }
  }

  initThree() {
    if (!THREE) {
      throw new Error("Please introduce the three.js library ")
    }

    const width = this._map.scene.canvas.clientWidth
    const height = this._map.scene.canvas.clientHeight

    const threeContainer = mars3d.DomUtil.create("canvas", "mars3d-threejs", this._map.container)
    threeContainer.style.position = "absolute"
    threeContainer.style.top = "0px"
    threeContainer.style.left = "0px"
    threeContainer.style.width = width + "px"
    threeContainer.style.height = height + "px"
    threeContainer.style.pointerEvents = this._pointerEvents ? "auto" : "none" // You can interact with auto, but you can't zoom in on the earth, and you can't interact with none
    this._threeCanvas = threeContainer

    const fov = 45
    const aspect = width / height
    const near = 1
    const far = 10 * 1000 * 1000 // needs to be far to support Cesium's world-scale rendering

    this.renderer = new THREE.WebGLRenderer({
      canvas: threeContainer,
      alpha: true,
      logarithmicDepthBuffer: true,
      antialias: true
    })
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.scene = new THREE.Scene()
  }

  update() {
    this.renderCesium()
    this.renderThreeJS()
  }

  renderCesium() {
    this._map.viewer.render()
  }

  renderThreeJS() {
    this.camera.matrixAutoUpdate = false
    const cvm = this._map.camera.viewMatrix
    const civm = this._map.camera.inverseViewMatrix

    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera.matrixWorld.set(
      civm[0],
      civm[4],
      civm[8],
      civm[12],
      civm[1],
      civm[5],
      civm[9],
      civm[13],
      civm[2],
      civm[6],
      civm[10],
      civm[14],
      civm[3],
      civm[7],
      civm[11],
      civm[15]
    )
    this.camera.matrixWorldInverse.set(
      cvm[0],
      cvm[4],
      cvm[8],
      cvm[12],
      cvm[1],
      cvm[5],
      cvm[9],
      cvm[13],
      cvm[2],
      cvm[6],
      cvm[10],
      cvm[14],
      cvm[3],
      cvm[7],
      cvm[11],
      cvm[15]
    )

    this.renderer.setPixelRatio(window.devicePixelRatio)

    const width = this._map.scene.canvas.clientWidth
    const height = this._map.scene.canvas.clientHeight
    const canvas = this.renderer.domElement
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      this.resize()
      this.renderer.setSize(width, height, false)
    }
    this.camera.aspect = width / height
    this.camera.fov = Cesium.Math.toDegrees(this._map.camera.frustum.fovy) // ThreeJS FOV is vertical
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Change the size of the layer canvas container
   * @return {void} None
   */
  resize() {
    if (this._threeCanvas) {
      const width = this._map.scene.canvas.clientWidth
      const height = this._map.scene.canvas.clientHeight

      const threeContainer = this._threeCanvas
      threeContainer.style.position = "absolute"
      threeContainer.style.top = "0px"
      threeContainer.style.left = "0px"
      threeContainer.style.width = width + "px"
      threeContainer.style.height = height + "px"
    }
  }
}
