const CustomLang = {
  /** Unique identifier that identifies the language */
  type: "en",

  // Cesium renderError error popup window
  RenderingHasStopped: "An error occurred while rendering.  Rendering has stopped.",
  ErrorConstructingCesiumWidget: "Error constructing CesiumWidget.",

  // src\control\czm\Animation.js
  Today: "Today",
  TodayRealTime: "Today (real-time)",
  Pause: "Pause",
  PlayReverse: "Play Reverse",
  PlayForward: "Play Forward",
  CurrentTimeNotInRange: "Current time not in range",

  // src\control\czm\BaseLayerPicker.js
  Imagery: "Imagery",
  CesiumIon: "Cesium ion",
  Other: "Other",
  Terrain: "Terrain",
  EllipsoidTerrainProvider: "WGS84 Ellipsoid",
  EllipsoidTerrainProviderTooltip: "WGS84 standard ellipsoid, also known as EPSG:4326",
  TerrainProvider: "World Terrain",
  TerrainProviderTooltip: "High-resolution global terrain tileset curated from several datasources",

  // src\control\czm\BaseLayerPicker.js
  FullScreen: "Full screen",
  ExitFullScreen: "Exit full screen",
  FullScreenUnavailable: "Full screen unavailable",

  // src\control\czm\Geocoder.js
  EnterAnAddressOrLandmark: "Enter an address or landmark...",
  Searching: "Searching...",

  // src\control\czm\HomeButton.js
  ViewHome: "View Home",

  // src\control\czm\NavigationHelpButton.js
  NavigationInstructions: "Navigation Instructions",
  Mouse: "Mouse",
  Touch: "Touch",
  PanView: "Pan view",
  LeftClickDrag: "Left click + drag",
  ZoomView: "Zoom view",
  RightClick: "Right click + drag, or",
  MouseWheelScroll: "Mouse wheel scroll",
  RotateView: "Rotate view",
  MiddleClickDrag: "Middle click + drag, or",
  CtrlAndClickDrag: "CTRL + Left/Right click + drag",
  OneFingerDrag: "One finger drag",
  TwoFingerPinch: "Two finger pinch",
  TiltView: "Tilt view",
  TwoFingerDragSameDirection: "Two finger drag, same direction",
  TwoFingerDragOppositeDirection: "Two finger drag, opposite direction",

  // src\control\czm\ProjectionPicker.js
  PerspectiveProjection: "Perspective Projection",
  OrthographicProjection: "Orthographic Projection",

  // src\control\czm\SceneModePicker.js
  _2D: "2D",
  _3D: "3D",
  ColumbusView: "Columbus View",

  // src\control\czm\VRButton.js
  EnterVRMode: "Enter VR mode",
  ExitVRMode: "Exit VR mode",
  VRModeIsUnavailable: "VR mode is unavailable",

  // src\control\Zoom.js
  _Zoom: "Zoom In",
  _Zoom out: "Zoom Out",

  // src\control\ClockAnimate.js
  _Pause: "Pause",
  _Continue: "Continue",

  // src\control\Compass.js
  _Navigation ball: "Navigation ball",
  _Drag to adjust pitch Angle: "Drag to adjust pitch Angle",
  _Drag to adjust the heading angle: "Drag to adjust the Heading Angle, double-click to return to true north",

  // Right-click menu src\map\core\getDefaultContextMenu.js
  _View the coordinates here: "Location info",
  _Location information: "The location information",
  _Longitude: "Lon",
  _Latitude: "Lat",
  _Altitude: "Alt",
  _Abscissa: "X",
  _ordinate: "Y",

  _View current perspective: "Camera info",
  _Current camera information: "Current Camera Information",

  _View switching: "Camera",
  _Do not go underground: "Do not go underground",
  _Access to the ground: "Access to the ground",
  _Fly around here: "Fly around here",
  _Close off circling: "Close off circling",
  _Move it over here: "Move it over here",
  _First view is here: "First view is here",
  _Enable keyboard roaming: "Enable keyboard roaming",
  _Turn off keyboard roaming: "Turn off keyboard roaming",
  _Track lock: "TrackedEntity",
  _Unlock: "Unlocked",

  _3D model: "3DTiles",
  _Display Wireframe: "Display Wireframe",
  _Close wireframe: "Close Wireframe",
  _Display bounding box: "Display BoundingVolume",
  _Close bounding box: "Close BoundingVolume",

  _Terrain service: "Terrain",
  _Open terrain: "Open terrain",
  _Close terrain: "Close terrain",

  _Mark on the picture: "Drawing",
  _Mark points: "Mark points",
  _Tag line: "Tag line",
  _Mark surface: "Mark surface",
  _Mark round: "Mark round",
  _Mark rectangular: "Mark rectangular",
  _Allow editing: "Allowed to edit",
  _Prohibit editing: "Prohibit to edit",
  _Export GeoJSON: "Export GeoJSON",
  _Clear all markers: "Clear",

  _Special effects: "Effects",
  _Enable rain: "Enable rain",
  _Close rain: "Close rain",
  _Enable snow: "Enable snow",
  _Close snow: "Close snow",
  _Enable fog weather: "Enable fog",
  _Close fog weather: "Close fog",
  _Enable bloom: "Enable bloom",
  _Close bloom: "Close bloom",
  _Enable brightness: "Enable brightness",
  _Close brightness: "Close brightness",
  _Enable night vision: "Enable night vision",
  _Close night vision: "Close night vision",
  _Enable black and white: "Enable black and white",
  _Close black and white: "Close black and white",
  _Enable pick highlighting: "Enable Pick highlighted",
  _Close pick highlighting: "Close Pick highlighted",

  _Scene settings: "Scene",
  _Enable depth test: "Enable depth test against terrain",
  _Close depth test: "Close depth test against terrain",
  _Show starry sky background: "Enable skyBox",
  _Close the starry sky background: "Close skyBox",
  _Enable sunlight shadow: "Enable shadow",
  _Close sunlight shadow: "Close shadow",
  _Enable atmospheric rendering: "Enable sky atmosphere",
  _Close atmospheric rendering: "Close sky atmosphere",
  _Scene export: "Export image",

  _Measurement on the picture: "Measure",
  _Delete measurement: "Delete",

  //Measure on the picture tooltip
  _angle: "Angle",
  _Distance: "Distance",
  _Area: "Area",
  _Total length: "Total distance",
  _Start: "Start",
  _Height difference: "Height difference",
  _Space distance: "Space distance",
  _Horizontal distance: "Horizontal distance",
  _Calculating volume: "Calculating volume",
  _The volume of fill: "The volume of fill",
  _Excavation volume: "Excavation volume",
  _Crosscutting area: "Crosscutting area",
  _face: "Up",
  _Under: "Down",
  _meter: "m",
  _km: "km",
  _Myriametre: "myriametre",
  _海里: "mile",
  _Zhang: "zhang",
  _square meter: "m²",
  _square kilometers: "km²",
  _acre: "mu",
  _ha: "ha",
  _cubic meter: "m³",
  _10,000 cubic meters: "wm³",
  _seconds: "S",
  _minutes: "M",
  _Hour: "H",

  // Plot tooltip
  _Click to start drawing: "Click to start drawing",
  _Click to finish drawing: "Click to finish drawing",
  _Double click to finish drawing: "Double click to finish drawing",
  _Click to add point: "left click add point",
  _Right click delete point: "right click delete point",

  _Click to activate editing: "Click to activate editing",
  _Right click menu to delete: "Right click menu to delete",
  _For more functions, right click: "For more functions, right click",

  _Stop editing: "Stop editing",
  _Delete that point: "Delete that point",
  _Translation by axis: "Translation by axis",
  _Stop translation along axis: "Stop translation along axis",
  _Rotation on axis: "Rotation on axis",
  _Stop rotation on axis: "Stop rotation on axis",
  _Adjust scale: "Edit Scale",
  _Stop adjusting scale: "Stop edit scale",

  _Complete the modification after release: "Complete the modification after release",
  _This object does not allow editing: "This object does not allow editing",
  _After dragging the point: "Drag that point",
  _After dragging the object: "Drag that object",
  _Modify the position: "Modify the position",
  _The overall translation: "The overall translation",
  _Add point: "Add point",
  _Modify the height: "Modify the height",
  _Modify the radius: "Modify the radius",
  _Modify the length: "Modify the length(X direction )",
  _Modify the width: "Change the width(Y direction)",
  _Modify direction: "Change direction",
  _Modify the scale: "Modify the Scale",
  _Cannot delete, the number of dots cannot be less than",
  _Delete: "Delete",
  _Radius: "Radius",

  // src\graphic\entity\ModelEntity.js
  _Loading model: "Load Model…"
}
