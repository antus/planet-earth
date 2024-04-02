const DEF_STYLE = {
  moveDomLeft: 50,
  moveDomTop: -100,
  autoPoistion: true,
  horizontalPoistion: "left",
  verticalPoistion: "bottom"
}

/**
 * Draggable div
 * @param {object} options parameter object, including the following:
 * @param {LngLatPoint|Cesium.Cartesian3|number[]} options.position coordinate position
 * @param {DivGraphic.StyleOptions} options.style style information
 * @param {string} [options.style.moveDomTop=-100] Top value of dragging panel, unit: px
 * @param {string} [options.style.moveDomLeft=50] Drag the left value of the panel, unit: px
 * @param {string} [options.style.autoPoistion=true] Whether to automatically determine the closest angle to the connection
 * @param {string} [options.style.horizontalPoistion] Horizontal connection position, possible values: left, right
 * @param {string} [options.style.verticalPoistion] Vertical position of the connection, possible values: top, bottom
 *
 *
 * @param {object} [options.attr] The attribute information of the attachment. You can attach any attributes. The export will be automatically processed when exporting geojson or json.
 * @class DivIndicator
 * @extends {mars3d.graphic.DivGraphic}
 */
class DivIndicator extends mars3d.graphic.DivGraphic {
  constructor(options = {}) {
    options.style = {
      ...DEF_STYLE,
      ...(options.style || {})
    }
    super(options)
  }

  _appendHtmlHook() {
    this._container_drag = this._container.querySelector(".divIndicator-drag")
    this._container_fixed = this._container.querySelector(".divIndicator-fixed")
    this._container_line = this._container.querySelector(".divIndicator-line")

    if (this._container_drag) {
      this._container_drag.addEventListener("mousedown", this._dragDom_mousedown.bind(this))

      this._updateLineStyle()
    }
  }

  _removedHook() {
    if (this._container_drag) {
      this._container_drag.removeEventListener("mousedown", this._dragDom_mousedown) // Start drag event
      delete this._container_drag
    }
    delete this._container_fixed
    delete this._container_line

    super._removedHook()
  }

  //Activate drawing
  _dragDom_mousedown(event) {
    event.preventDefault()
    event.stopPropagation()

    const disX = event.clientX - this._container_drag?.offsetLeft
    const disY = event.clientY - this._container_drag?.offsetTop

    addEvent(document.documentElement, "mousemove", handleMove)
    addEvent(document.documentElement, "mouseup", handleUp)
    addEvent(this.container, "mousemove", handleMove)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    function handleMove(el) {
      el.preventDefault()
      el.stopPropagation()

      that.style.moveDomLeft = el.clientX - disX
      that.style.moveDomTop = el.clientY - disY

      that._updateLineStyle()
    }

    function handleUp(e) {
      e.preventDefault()
      e.stopPropagation()

      removeEvent(document.documentElement, "mousemove", handleMove)
      removeEvent(document.documentElement, "mouseup", handleUp)
      removeEvent(that.container, "mousemove", handleMove)
    }
  }

  //Update the connection between the two divs
  _updateLineStyle() {
    this._container_drag.style.left = this.style.moveDomLeft + "px"
    this._container_drag.style.top = this.style.moveDomTop + "px"

    const dragRect = this._container_drag.getBoundingClientRect()
    const fixedRect = this._container_fixed.getBoundingClientRect()

    let verticalPoistion
    let horizontalPoistion
    if (this.style.autoPoistion) {
      // Automatically calculate the nearest corner internally for connection
      if (dragRect.left < fixedRect.left) {
        horizontalPoistion = "right"
      } else {
        horizontalPoistion = "left"
      }
      if (dragRect.top < fixedRect.top) {
        verticalPoistion = "bottom"
      } else {
        verticalPoistion = "top"
      }
    } else {
      verticalPoistion = this.style.verticalPoistion
      horizontalPoistion = this.style.horizontalPoistion
    }

    const top1 = fixedRect.y + fixedRect.height / 2
    const left1 = fixedRect.x + fixedRect.width / 2
    const top2 = dragRect[verticalPoistion]
    const left2 = dragRect[horizontalPoistion]

    const distance = usePointsDistance({ x: top1, y: left1 }, { x: top2, y: left2 }) // The length of the line
    const topValue = (left2 - left1) / 2 - 1 // Coordinates of the line
    const letValue = (top2 - top1) / 2 - distance / 2
    const angle = -Math.atan2(left1 - left2, top1 - top2) * (180 / Math.PI) // Angle of line

    Object.assign(this._container_line.style, {
      height: `${distance}px`,
      transform: `translateX(${topValue}px) translateY(${letValue}px) scale(1) rotate(${angle}deg)`
    })
  }

  // When editing the style, refresh again and assign the previously loaded style to
  _updateStyleBaseHook(newStyle) {
    super._updateStyleBaseHook(newStyle)
    this._updateLineStyle()
  }
}

//Register
mars3d.GraphicUtil.register("divIndicator", DivIndicator)

// Calculate the distance between two points
function usePointsDistance(point, point2) {
  const horizontalLength = Math.abs(point.x - point2.x)
  const verticalLength = Math.abs(point.y - point2.y)

  return Number(Math.sqrt(Math.pow(horizontalLength, 2) + Math.pow(verticalLength, 2)).toFixed(2))
}

// Compatible with different browsers, bind events
function addEvent(el, event, handler) {
  if (!el) {
    return
  }
  if (el.attachEvent) {
    el.attachEvent(`on${event}`, handler)
  } else if (el.addEventListener) {
    el.addEventListener(event, handler)
  } else {
    el[`on${event}`] = handler
  }
}

// Compatible with different browsers, remove events
function removeEvent(el, event, handler) {
  if (!el) {
    return
  }
  if (el.detachEvent) {
    el.detachEvent(`on${event}`, handler)
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler)
  } else {
    el[`on${event}`] = null
  }
}
