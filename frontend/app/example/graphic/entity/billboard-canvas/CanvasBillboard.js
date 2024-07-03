//Draw the icon points of complex or dynamic objects through Canvas Graphic
class CanvasBillboard extends mars3d.graphic.BillboardPrimitive {
  /**
   * Word
   * @type {string}
   */
  get text() {
    return this.style.text
  }

  set text(val) {
    this.style.text = val
    if (this._map) {
      this._updateCanvas()
    }
  }

  /**
   * Hook method to create some objects before adding them to the layer,
   * Will only be called once
   * @return {Promise<object>} None
   * @private
   */
  _mountedHook() {
    super._mountedHook()

    if (this._pngImage) {
      this._updateCanvas()
    } else {
      Cesium.Resource.fetchImage({ url: "img/icon/textPnl.png" }).then((img) => {
        this._pngImage = img
        this._updateCanvas()
      })
    }
  }

  //Create canvas
  _updateCanvas() {
    if (!this._pngImage || this._map.camera.positionCartographic.height > 100000) {
      return
    }

    const canvas = document.createElement("canvas")
    canvas.id = this.id
    canvas.width = this._pngImage.width
    canvas.height = this._pngImage.height

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw pictures
    ctx.drawImage(this._pngImage, 0, 0)

    // draw text
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.font = "55px regular script"
    ctx.textBaseline = "middle"
    ctx.fillText("Temperature:", 20, canvas.height / 2)
    ctx.fillText(this.style.text, 160, canvas.height / 2)
    ctx.fillText("℃", 220, canvas.height / 2)

    // Assign the image to the vector object for display. This.image is an attribute of the parent class.
    // this.image = canvas
    this.image = canvas.toDataURL("image/png")
  }
}

//Register
mars3d.GraphicUtil.register("canvasBillboard", CanvasBillboard)

mars3d.graphic.CanvasBillboard = CanvasBillboard
