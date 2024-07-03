// import * as mars3d from "mars3d"
// const Cesium = mars3d.Cesium

const { LngLatPoint, Icon, CRS } = mars3d
const { alert, downloadFile, formatNum } = mars3d.Util
const { addPositionsHeight } = mars3d.PointUtil
const { proj4Trans } = mars3d.PointTrans
const { logInfo } = mars3d.Log
const { RotatePoint, Measure } = mars3d.thing
const { BloomEffect, BrightnessEffect, BlackAndWhiteEffect, NightVisionEffect, OutlineEffect, RainEffect, SnowEffect, FogEffect } = mars3d.effect

// Get the platform's built-in right-click menu
function getDefaultContextMenu(map) {
  const that = map.contextmenu

  return [
    {
      text: function () {
        return map.getLangText("_View coordinates here") + "-from example"
      },
      icon: Icon.Coordinates,
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      callback: function (e) {
        //Latitude and longitude
        const mpt = LngLatPoint.fromCartesian(e.cartesian)

        const ptNew = proj4Trans([mpt.lng, mpt.lat], "EPSG:4326", CRS.CGCS2000_GK_Zone_3)

        const inhtml = `
         ${map.getLangText("_Longitude")}:${mpt.lng}, ${map.getLangText("_latitude")}:${mpt.lat}, ${map.getLangText("_elevation" )}:${mpt.alt},
         ${map.getLangText("_abscissa")}:${ptNew[0].toFixed(1)}, ${map.getLangText("_ordinate")}:${ptNew[1].toFixed( 1)} (CGCS2000)
        `
        alert(inhtml, map.getLangText("_location information"))

        //Print for easy testing
        const ptX = formatNum(e.cartesian.x, 1) // Descartes
        const ptY = formatNum(e.cartesian.y, 1)
        const ptZ = formatNum(e.cartesian.z, 1)
        logInfo(`Longitude and latitude: ${mpt.toString()}, Descartes: ${ptX},${ptY},${ptZ}`)
      }
    },

    {
      text: function () {
        return map.getLangText("_View current perspective")
      },
      icon: Icon.CameraInfo,
      callback: function (e) {
        const mpt = JSON.stringify(map.getCameraView())
        logInfo(mpt)
        alert(mpt, map.getLangText("_Current perspective information"))
      }
    },
    {
      text: function () {
        return map.getLangText("_View switching")
      },
      icon: Icon.Camera,
      children: [
        {
          text: function () {
            return map.getLangText("_allowed to enter underground")
          },
          icon: Icon.UndergroundYes,
          show: function (e) {
            return map.scene.screenSpaceCameraController.enableCollisionDetection
          },
          callback: function (e) {
            map.scene.screenSpaceCameraController.enableCollisionDetection = false
          }
        },
        {
          text: function () {
            return map.getLangText("_No entry underground")
          },
          icon: Icon.UndergroundNo,
          show: function (e) {
            return !map.scene.screenSpaceCameraController.enableCollisionDetection
          },
          callback: function (e) {
            map.scene.screenSpaceCameraController.enableCollisionDetection = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Fly around here")
          },
          icon: Icon.RotatePointStart,
          show: function (e) {
            return e.cartesian && (!that.rotatePoint || !that.rotatePoint?.isStart)
          },
          callback: function (e) {
            if (!that.rotatePoint) {
              that.rotatePoint = new RotatePoint()
              map.addThing(that.rotatePoint)
            }
            that.rotatePoint.start(e.cartesian)
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off orbiting")
          },
          icon: Icon.RotatePointStop,
          show: function (e) {
            return that.rotatePoint?.isStart
          },
          callback: function (e) {
            if (that.rotatePoint) {
              that.rotatePoint.stop()
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Move here")
          },
          icon: Icon.FlyToPoint,
          show: function (e) {
            return Cesium.defined(e.cartesian)
          },
          callback: function (e) {
            const cameraDistance = Cesium.Cartesian3.distance(e.cartesian, map.camera.positionWC) * 0.1

            map.flyToPoint(e.cartesian, {
              radius: cameraDistance, // distance from the target point
              maximumHeight: map.camera.positionCartographic.height
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_The first point of view stands here")
          },
          icon: Icon.FirstPerspective,
          show: function (e) {
            return Cesium.defined(e.cartesian)
          },
          callback: function (e) {
            map.camera.flyTo({
              destination: addPositionsHeight(e.cartesian, 10), // Raise 10 meters
              orientation: {
                heading: map.camera.heading,
                pitch: 0.0,
                roll: 0.0
              },
              maximumHeight: map.camera.positionCartographic.height
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_Enable keyboard roaming")
          },
          icon: Icon.KeyboardRoamYes,
          show: function (e) {
            return !map.keyboardRoam.enabled
          },
          callback: function (e) {
            map.keyboardRoam.enabled = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off keyboard roaming")
          },
          icon: Icon.KeyboardRoamNo,
          show: function (e) {
            return map.keyboardRoam.enabled
          },
          callback: function (e) {
            map.keyboardRoam.enabled = false
          }
        },
        {
          text: function () {
            return map.getLangText("_Tracking Lock")
          },
          icon: Icon.TrackedEntityYes,
          show: function (e) {
            const graphic = e.graphic
            if (!graphic) {
              return false
            }

            if (graphic.entity instanceof Cesium.Entity) {
              return true
            } else if (graphic.trackedEntity instanceof Cesium.Entity) {
              return true
            }

            return false
          },
          callback: function (e) {
            map.trackedEntity = e.graphic
          }
        },
        {
          text: function () {
            return map.getLangText("_Unlock")
          },
          icon: Icon.TrackedEntityNo,
          show: function (e) {
            return map.trackedEntity !== undefined
          },
          callback: function (e) {
            map.trackedEntity = undefined
          }
        }
      ]
    },
    {
      text: function () {
        return map.getLangText("_3D model")
      },
      icon: Icon.Tileset,
      show: function (e) {
        const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
        return Cesium.defined(model)
      },
      children: [
        {
          text: function () {
            return map.getLangText("_Display triangulation network")
          },
          icon: Icon.TilesetWireframeYes,
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            return !model.debugWireframe && model._enableDebugWireframe
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            model.debugWireframe = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Close triangle network")
          },
          icon: Icon.TilesetWireframeNo,
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            return model.debugWireframe && model._enableDebugWireframe
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            model.debugWireframe = false
          }
        },
        {
          text: function () {
            return map.getLangText("_Display bounding box")
          },
          icon: Icon.TilesetBoundingVolumeYes,
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            return !model.debugShowBoundingVolume
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            model.debugShowBoundingVolume = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Close bounding box")
          },
          icon: Icon.TilesetBoundingVolumeNo,
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            return model.debugShowBoundingVolume
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // Pick the model returned by drawing
            model.debugShowBoundingVolume = false
          }
        }
      ]
    },

    {
      text: function () {
        return map.getLangText("_Terrain Service")
      },
      icon: Icon.Terrain,
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      children: [
        {
          text: function () {
            return map.getLangText("_Open terrain")
          },
          icon: Icon.TerrainYes,
          show: function (e) {
            return !map.hasTerrain
          },
          callback: function (e) {
            map.hasTerrain = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Close terrain")
          },
          icon: Icon.TerrainNo,
          show: function (e) {
            return map.hasTerrain
          },
          callback: function (e) {
            map.hasTerrain = false
          }
        },
        {
          text: function () {
            return map.getLangText("_Display triangulation network")
          },
          icon: Icon.TerrainWireframeYes,
          show: function (e) {
            return !map.scene.globe._surface.tileProvider._debug.wireframe
          },
          callback: function (e) {
            map.scene.globe._surface.tileProvider._debug.wireframe = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Close triangle network")
          },
          icon: Icon.TerrainWireframeNo,
          show: function (e) {
            return map.scene.globe._surface.tileProvider._debug.wireframe
          },
          callback: function (e) {
            map.scene.globe._surface.tileProvider._debug.wireframe = false
          }
        }
      ]
    },
    {
      text: function () {
        return map.getLangText("_Measurement on the map")
      },
      icon: Icon.Measure,
      children: [
        {
          text: function () {
            return map.getLangText("_distance")
          },
          icon: Icon.MeasureDistance,
          callback: function (e) {
            if (!that.measure) {
              that.measure = new Measure()
              map.addThing(that.measure)
            }
            that.measure.distance()
          }
        },
        {
          text: function () {
            return map.getLangText("_area")
          },
          icon: Icon.MeasureArea,
          callback: function (e) {
            if (!that.measure) {
              that.measure = new Measure()
              map.addThing(that.measure)
            }
            that.measure.area()
          }
        },
        {
          text: function () {
            return map.getLangText("_height difference")
          },
          icon: Icon.MeasureHeight,
          callback: function (e) {
            if (!that.measure) {
              that.measure = new Measure()
              map.addThing(that.measure)
            }
            that.measure.heightTriangle()
          }
        },
        {
          text: function () {
            return map.getLangText("_angle")
          },
          icon: Icon.MeasureAngle,
          callback: function (e) {
            if (!that.measure) {
              that.measure = new Measure()
              map.addThing(that.measure)
            }
            that.measure.angle()
          }
        },
        {
          text: function () {
            return map.getLangText("_Delete Measurement")
          },
          icon: Icon.Delete,
          show: function (e) {
            return that.measure && that.measure.hasMeasure
          },
          callback: function (e) {
            if (that.measure) {
              that.measure.clear()
            }
          }
        }
      ]
    },

    {
      text: function () {
        return map.getLangText("_Mark on the map")
      },
      icon: Icon.Draw,
      children: [
        {
          text: function () {
            return map.getLangText("_marker point")
          },
          icon: Icon.DrawPoint,
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "point",
              style: {
                pixelSize: 12,
                color: "#3388ff"
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_mark line")
          },
          icon: Icon.DrawPolyline,
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "polyline",
              style: {
                color: "#55ff33",
                width: 3
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_marked surface")
          },
          icon: Icon.DrawPolygon,
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "polygon",
              style: {
                color: "#29cf34",
                opacity: 0.5,
                outline: true,
                outlineWidth: 2.0
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_mark circle")
          },
          icon: Icon.DrawCircle,
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "circle",
              style: {
                color: "#ffff00",
                opacity: 0.6
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_mark rectangle")
          },
          icon: Icon.DrawRectangle,
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "rectangle",
              style: {
                color: "#ffff00",
                opacity: 0.6
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_Allow editing")
          },
          icon: Icon.DrawEditYes,
          show: function (e) {
            return !map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = true
          }
        },
        {
          text: function () {
            return map.getLangText("_editing prohibited")
          },
          icon: Icon.DrawEditNo,
          show: function (e) {
            return map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = false
          }
        },
        {
          text: function () {
            return map.getLangText("_Export GeoJSON")
          },
          icon: Icon.DrawDownJson,
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            downloadFile("Mark on map.json", JSON.stringify(map.graphicLayer.toGeoJSON()))
          }
        },
        {
          text: function () {
            return map.getLangText("_clear all markers")
          },
          icon: Icon.Delete,
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            map.graphicLayer.clear()
          }
        }
      ]
    },
    {
      text: function () {
        return map.getLangText("_Special Effects")
      },
      icon: Icon.Effect,
      children: [
        {
          text: function () {
            return map.getLangText("_Turn on rain")
          },
          icon: Icon.RainEffectYes,
          show: function (e) {
            return !that.rainEffect
          },
          callback: function (e) {
            if (!that.rainEffect) {
              that.rainEffect = new RainEffect()
              map.addEffect(that.rainEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Close rain")
          },
          icon: Icon.RainEffectNo,
          show: function (e) {
            return that.rainEffect
          },
          callback: function (e) {
            if (that.rainEffect) {
              map.removeEffect(that.rainEffect, true)
              delete that.rainEffect
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn on snow")
          },
          icon: Icon.SnowEffectYes,
          show: function (e) {
            return !that.snowEffect
          },
          callback: function (e) {
            if (!that.snowEffect) {
              that.snowEffect = new SnowEffect()
              map.addEffect(that.snowEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Close snowing")
          },
          icon: Icon.SnowEffectNo,
          show: function (e) {
            return that.snowEffect
          },
          callback: function (e) {
            if (that.snowEffect) {
              map.removeEffect(that.snowEffect, true)
              delete that.snowEffect
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Turn on fog weather")
          },
          icon: Icon.FogEffectYes,
          show: function (e) {
            return !that.fogEffect
          },
          callback: function (e) {
            if (!that.fogEffect) {
              const height = map.camera.positionCartographic.height * 2
              that.fogEffect = new FogEffect({
                fogByDistance: new Cesium.Cartesian4(0.1 * height, 0.1, height, 0.8)
              })
              map.addEffect(that.fogEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off fog weather")
          },
          icon: Icon.FogEffectNo,
          show: function (e) {
            return that.fogEffect
          },
          callback: function (e) {
            if (that.fogEffect) {
              map.removeEffect(that.fogEffect, true)
              delete that.fogEffect
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Turn on floodlight")
          },
          icon: Icon.BloomEffectYes,
          show: function (e) {
            return !that.bloomEffect
          },
          callback: function (e) {
            if (!that.bloomEffect) {
              that.bloomEffect = new BloomEffect()
              map.addEffect(that.bloomEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off floodlight")
          },
          icon: Icon.BloomEffectNo,
          show: function (e) {
            return that.bloomEffect
          },
          callback: function (e) {
            if (that.bloomEffect) {
              map.removeEffect(that.bloomEffect, true)
              delete that.bloomEffect
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Turn on brightness")
          },
          icon: Icon.BrightnessEffectYes,
          show: function (e) {
            return !that.brightnessEffect
          },
          callback: function (e) {
            if (!that.brightnessEffect) {
              that.brightnessEffect = new BrightnessEffect()
              map.addEffect(that.brightnessEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off brightness")
          },
          icon: Icon.BrightnessEffectNo,
          show: function (e) {
            return that.brightnessEffect
          },
          callback: function (e) {
            if (that.brightnessEffect) {
              map.removeEffect(that.brightnessEffect, true)
              delete that.brightnessEffect
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Turn on night vision")
          },
          icon: Icon.NightVisionEffectYes,
          show: function (e) {
            return !that.nightVisionEffect
          },
          callback: function (e) {
            if (!that.nightVisionEffect) {
              that.nightVisionEffect = new NightVisionEffect()
              map.addEffect(that.nightVisionEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off night vision")
          },
          icon: Icon.NightVisionEffectNo,
          show: function (e) {
            return that.nightVisionEffect
          },
          callback: function (e) {
            if (that.nightVisionEffect) {
              map.removeEffect(that.nightVisionEffect, true)
              delete that.nightVisionEffect
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Turn on black and white")
          },
          icon: Icon.BlackAndWhiteEffectYes,
          show: function (e) {
            return !that.blackAndWhiteEffect
          },
          callback: function (e) {
            if (!that.blackAndWhiteEffect) {
              that.blackAndWhiteEffect = new BlackAndWhiteEffect()
              map.addEffect(that.blackAndWhiteEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off black and white")
          },
          icon: Icon.BlackAndWhiteEffectNo,
          show: function (e) {
            return that.blackAndWhiteEffect
          },
          callback: function (e) {
            if (that.blackAndWhiteEffect) {
              map.removeEffect(that.blackAndWhiteEffect, true)
              delete that.blackAndWhiteEffect
            }
          }
        },

        {
          text: function () {
            return map.getLangText("_Turn on picking highlighting")
          },
          icon: Icon.OutlineEffectYes,
          show: function (e) {
            return !that.outlineEffect
          },
          callback: function (e) {
            if (!that.outlineEffect) {
              that.outlineEffect = new OutlineEffect()
              map.addEffect(that.outlineEffect)
            }
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off picking highlighting")
          },
          icon: Icon.OutlineEffectNo,
          show: function (e) {
            return that.outlineEffect
          },
          callback: function (e) {
            if (that.outlineEffect) {
              map.removeEffect(that.outlineEffect, true)
              delete that.outlineEffect
            }
          }
        }
      ]
    },
    {
      text: function () {
        return map.getLangText("_scene settings")
      },
      icon: Icon.Scene,
      children: [
        {
          text: function () {
            return map.getLangText("_Enable deep monitoring")
          },
          icon: Icon.DepthTestYes,
          show: function (e) {
            return !map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off depth monitoring")
          },
          icon: Icon.DepthTestNo,
          show: function (e) {
            return map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = false
          }
        },

        {
          text: function () {
            return map.getLangText("_Display starry sky background")
          },
          icon: Icon.SkyBoxYes,
          show: function (e) {
            return !map.scene.skyBox?.show
          },
          callback: function (e) {
            map.scene.skyBox.show = true // Skybox
            map.scene.moon.show = true // sun
            map.scene.sun.show = true // moon
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off the starry sky background")
          },
          icon: Icon.SkyBoxNo,
          show: function (e) {
            return map.scene.skyBox.show
          },
          callback: function (e) {
            map.scene.skyBox.show = false // Skybox
            map.scene.moon.show = false // sun
            map.scene.sun.show = false // Moon
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn on sun shadow")
          },
          icon: Icon.ShadowYes,
          show: function (e) {
            return !map.viewer.shadows
          },
          callback: function (e) {
            map.viewer.shadows = true
            map.viewer.terrainShadows = Cesium.ShadowMode.ENABLED
            map.scene.globe.enableLighting = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off sun shadow")
          },
          icon: Icon.ShadowNo,
          show: function (e) {
            return map.viewer.shadows
          },
          callback: function (e) {
            map.viewer.shadows = false
            map.viewer.terrainShadows = Cesium.ShadowMode.RECEIVE_ONLY
            map.scene.globe.enableLighting = false
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn on atmospheric rendering")
          },
          icon: Icon.SkyAtmosphereYes,
          show: function (e) {
            return !map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = true
            map.scene.globe.showGroundAtmosphere = true
          }
        },
        {
          text: function () {
            return map.getLangText("_Turn off atmospheric rendering")
          },
          icon: Icon.SkyAtmosphereNo,
          show: function (e) {
            return map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = false
            map.scene.globe.showGroundAtmosphere = false
          }
        },

        {
          text: function () {
            return map.getLangText("_Scene map")
          },
          icon: Icon.ExpImage,
          callback: function (e) {
            map.expImage()
          }
        }
      ]
    }
  ]
}
