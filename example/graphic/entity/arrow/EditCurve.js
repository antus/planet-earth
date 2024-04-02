/**
 * [Customized linear label] Curve corresponding editing class
 */
class EditCurve extends mars3d.edit.EditBase {
  bindDraggers() {
    const positions = this.positions

    for (let i = 0, len = positions.length; i < len; i++) {
      const position = this.updatePositionsHeightByAttr(positions[i])

      //Each vertex
      const dragger = this.createDragger({
        position,
        onDrag: (dragger, position) => {
          position = this.updatePositionsHeightByAttr(position)
          dragger.position = position
          this.positions[dragger.index] = position
        },
        onDragStart: (dragger, position) => {
          if (this._heightDraggers?.length > 0) {
            for (let i = 0, len = this.draggers.length; i < len; i++) {
              this.draggers[i].show = false
            }
          }
        },
        onDragEnd: (dragger, position) => {
          this.updateDraggers()
        }
      })
      dragger.index = i
      this.draggers.push(dragger)

      //Middle point, add new point after dragging
      if (!this.hasClosure && i < len - 1) {
        const nextIndex = (i + 1) % len
        const nextPosition = positions[nextIndex]
        // first intermediate point
        let midpoint = mars3d.PointUtil.getMidpoint(position, nextPosition, 0.33)
        midpoint = this.updatePositionsHeightByAttr(midpoint)

        const draggerMid = this.createDragger({
          position: midpoint,
          type: mars3d.EditPointType.AddMidPoint,
          tooltip: this._map.getLangText("_Add point"),
          onDragStart: (dragger, position) => {
            this.positions.splice(dragger.index, 0, position) //Insertion point
          },
          onDrag: (dragger, position) => {
            this.positions[dragger.index] = position
          },
          onDragEnd: (dragger, position) => {
            this._fireAddPoint(dragger, position) //Add point event
            this.updateDraggers()
          }
        })
        draggerMid.index = nextIndex
        this.draggers.push(draggerMid)

        // second intermediate point
        let midpoint2 = mars3d.PointUtil.getMidpoint(position, nextPosition, 0.66)
        midpoint2 = this.updatePositionsHeightByAttr(midpoint2)

        const draggerMid2 = this.createDragger({
          position: midpoint2,
          type: mars3d.EditPointType.AddMidPoint,
          tooltip: this._map.getLangText("_Add point"),
          onDragStart: (dragger, position) => {
            this.positions.splice(dragger.index, 0, position) //Insertion point
          },
          onDrag: (dragger, position) => {
            this.positions[dragger.index] = position
          },
          onDragEnd: (dragger, position) => {
            this._fireAddPoint(dragger, position) //Add point event
            this.updateDraggers()
          }
        })
        draggerMid2.index = nextIndex
        this.draggers.push(draggerMid2)
      }
    }

    //Move the overall translation point
    this._bindMoveAllDragger()
  }

  //Move the overall translation point
  _bindMoveAllDragger() {
    if (!this._graphic._hasMoveEdit) {
      return
    }

    let positionMove = mars3d.PolyUtil.centerOfMass(this.positions)
    if (this.positions.length === 2) {
      const dis = Cesium.Cartesian3.distance(this.positions[0], this.positions[1])
      positionMove = mars3d.PointUtil.getPositionByDirectionAndLen(positionMove, 90, dis * 0.06)
    }
    positionMove = this.updatePositionsHeightByAttr(positionMove)

    const draggerMove = this.createDragger({
      position: positionMove,
      type: mars3d.EditPointType.MoveAll,
      tooltip: this._map.getLangText("_Overall translation"),
      onDragStart: (dragger, position) => {
        positionMove = position
      },
      onDrag: (dragger, position) => {
        //Record the difference
        const diff = Cesium.Cartesian3.subtract(position, positionMove, new Cesium.Cartesian3())
        positionMove = position

        this.positions.forEach((pos, index, arr) => {
          const newPos = this.updatePositionsHeightByAttr(Cesium.Cartesian3.add(pos, diff, new Cesium.Cartesian3()))
          this.positions[index] = newPos
        })

        for (let i = 0, len = this.draggers.length; i < len; i++) {
          if (draggerMove !== this.draggers[i]) {
            this.draggers[i].position = this.updatePositionsHeightByAttr(
              Cesium.Cartesian3.add(this.draggers[i].position, diff, new Cesium.Cartesian3())
            )
          }
        }
        this._updateMoveAllHook(position)
      }
    })
    this.draggers.push(draggerMove)
  }

  //Update coordinates based on attributes
  updatePositionsHeightByAttr(position) {
    // if (this.clampToGround) {
    // position = getSurfacePosition(this._map.scene, position, { has3dtiles: true }) // When attaching to the ground, find the height of the attached model and the ground.
    // }
    return position
  }
}
