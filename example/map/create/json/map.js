// import * as mars3d from "mars3d"
var map

function initMap(mapOptions) {
  //Read the config.json configuration file
  //return mars3d.Util.fetchJson({ url: "config/config.json" }).then(function (json) {
  // console.log("Reading config.json configuration file completed", json) // Print test information

    //Create a 3D earth scene
  //  const mapOptions = json.map3d
    map = new mars3d.Map("mars3dContainer", mapOptions)

    //Print test information
    console.log("Mars3d's Map main object construction completed", map)
    console.log("The native Cesium.Viewer of Cesium is ", map.viewer)
    return map
  //})
}
