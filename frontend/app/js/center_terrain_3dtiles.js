/* eslint-disable no-undef */
"use script" //It is recommended to turn on strict mode in the development environment

$(document).ready(function () {
  let inhtml = `
            <div class="infoview rightbottom">
                <input type="button" class="btn btn-primary" value="Locate to mountainous areas" onclick="centerAtTerrain()" />
                <input type="button" class="btn btn-primary" value="Locate to model" onclick="centerAtModel()" />
            </div>  `
  $("body").append(inhtml)
})

function centerAtTerrain() {
  map.setCameraView({ lat: 30.859414, lng: 116.28709, alt: 8617, heading: 18, pitch: -28 })
}

let modelTest
function centerAtModel() {
  map.setCameraView({ lat: 33.590452, lng: 119.032184, alt: 185, heading: 359, pitch: -34 })

  //3D model
  if (!modelTest) {
    modelTest = new mars3d.layer.TilesetLayer({
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 80.6 },
      maximumScreenSpaceError: 1,
      maximumMemoryUsage: 1024,
      flyTo: true
    })
    map.addLayer(modelTest)
  }
}