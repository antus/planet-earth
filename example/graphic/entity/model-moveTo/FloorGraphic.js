/**
 * Layered building model object
 *
 * @class FloorGraphic
 * @extends {mars3d.graphic.BasePointEntity}
 */
class FloorGraphic extends mars3d.graphic.BasePointEntity {
  /**
   * Hook method to create some objects before adding them to the layer,
   * Will only be called once
   * @return {Promise<object>} None
   * @private
   */
  _mountedHook() {
    this._models = []

    const point = this.point // Building location
    const floorHeight = this.style.spacing //Height of each floor, unit: meters
    const floorCount = this.style.count //Total number of floors (excluding roof)

    //Add floor
    for (let i = 0; i < floorCount; i++) {
      const alt = point.alt + i * floorHeight
      const model = new mars3d.graphic.ModelEntity({
        position: [point.lng, point.lat, alt],
        style: this.style,
        attr: {
          origAlt: alt // record the original height
        }
      })
      this._models.push(model)
    }

    //Add roof
    const topAlt = point.alt + floorCount * floorHeight
    const topModel = new mars3d.graphic.ModelEntity({
      position: [point.lng, point.lat, topAlt],
      style: {
        ...this.style,
        url: this.style.topUrl
      },
      attr: {
        origAlt: topAlt // record the original height
      }
    })
    this._models.push(topModel)
  }

  /**
   * The object is added to the creation hook method on the layer,
   * Called every time add
   * @return {void} None
   * @private
   */
  _addedHook() {
    this._models.forEach((model) => {
      this._layer.addGraphic(model)
    })
  }

  /**
   * Create a hook method for object removal from the layer,
   * Called every time remove
   * @return {void} None
   * @private
   */
  _removedHook() {
    this._models.forEach((model) => {
      this._layer.removeGraphic(model)
    })
  }

  /**
   * Expand all floors
   *
   * @param {number} height The height of each expanded layer interval, unit: meters
   * @param {number} [time=4] Full expansion time, unit: seconds
   * @return {void} None
   */
  openAll(height, time = 4) {
    this.reset()

    const point = this.point // Building location

    for (let i = 0; i < this._models.length; i++) {
      const model = this._models[i]

      const alt = i * height + model.attr.origAlt
      model.moveTo({
        position: [point.lng, point.lat, alt],
        time // length of movement (unit seconds)
      })
    }
  }

  /**
   * Combine all floors
   *
   * @param {number} [time=4] Time to complete the merge, unit: seconds
   * @memberof FloorGraphic
   * @returns {void}
   */
  mergeAll(time = 4) {
    const point = this.point // Building location

    for (let i = 0; i < this._models.length; i++) {
      const model = this._models[i]

      model.show = true
      model.moveTo({
        position: [point.lng, point.lat, model.attr.origAlt],
        time // length of movement (unit seconds)
      })
    }
  }

  /**
   * Restore and reset all floors
   * @return {void} None
   */
  reset() {
    const point = this.point // Building location

    for (let i = 0; i < this._models.length; i++) {
      const model = this._models[i]

      model.position = new mars3d.LngLatPoint(point.lng, point.lat, model.attr.origAlt)
      model.show = true
    }
  }

  /**
   * Display the specified floor
   *
   * @param {Number} floorNum specifies the displayed floor, starting from the 1st floor
   * @param {Number} [time=1] The time it takes for the floor to fall, unit: seconds
   * @return {void} None
   */
  showFloor(floorNum, time = 1) {
    floorNum--

    const point = this.point // Building location
    const maxHeight = 120 //Height of the top falling

    for (let i = floorNum; i < this._models.length; i++) {
      const model = this._models[i]
      model.position = new mars3d.LngLatPoint(point.lng, point.lat, maxHeight)
      model.show = false
    }

    for (let j = 0; j <= floorNum; j++) {
      const model = this._models[j]

      model.show = true
      model.moveTo({
        position: [point.lng, point.lat, model.attr.origAlt],
        time // length of movement (unit seconds)
      })
    }
  }
}
