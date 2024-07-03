function initTable() {
  $("#showEditor").hide()
  $("#show").change(function () {
    let val = $(this).is(":checked")
    thisLayer.show = val
  })

  // brightness
  $("#brightness")
    .slider({
      min: 0,
      max: 3,
      step: 0.01,
      value: 1
    })
    .on("change", (e) => {
      //modify step size
      if (e && e.value) {
        setLayerOptions("brightness", e.value.newValue)
      }
    })
  // contrast
  $("#contrast")
    .slider({
      min: 0,
      max: 3,
      step: 0.01,
      value: 1
    })
    .on("change", (e) => {
      //modify step size
      if (e && e.value) {
        setLayerOptions("contrast", e.value.newValue)
      }
    })
  // color
  $("#hue")
    .slider({
      min: 0,
      max: 3,
      step: 0.01,
      value: 0.1
    })
    .on("change", (e) => {
      //modify step size
      if (e && e.value) {
        setLayerOptions("hue", e.value.newValue)
      }
    })
  // saturation
  $("#saturation")
    .slider({
      min: 0,
      max: 3,
      step: 0.01,
      value: 1
    })
    .on("change", (e) => {
      //modify step size
      if (e && e.value) {
        setLayerOptions("saturation", e.value.newValue)
      }
    })
  // saturation
  $("#gamma")
    .slider({
      min: 0,
      max: 3,
      step: 0.01,
      value: 0.2
    })
    .on("change", (e) => {
      //modify step size
      if (e && e.value) {
        setLayerOptions("gamma", e.value.newValue)
      }
    })
  // transparency
  $("#opacity")
    .slider({
      min: 0,
      max: 1,
      step: 0.01,
      value: 1
    })
    .on("change", (e) => {
      //modify step size
      if (e && e.value) {
        setLayerOptions("opacity", e.value.newValue)
      }
    })

  const layers = map.getLayers()
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]
    if (layer.isPrivate) {
      continue
    }

    tileLayerList.push({
      key: layer,
      name: `${layer.type} - ${layer.name || "Unnamed"}`,
      isTile: layer.isTile
    })
  }

  selectedFirst()
  addTable()

  if ( tileLayerList . length ) {
    $("#showEditor").show()
  }

  //Add a new layer and add data to the array
  map.on(mars3d.EventType.addLayer, function (event) {
    const layer = event.layer
    thisLayer = event.layer
    if (layer.isPrivate || layer.name === "POI Query") {
      return
    }

    tileLayerList.push({
      key: layer,
      name: `${layer.type} - ${layer.name || "Unnamed"}`,
      isTile: layer.isTile
    })

    selectedFirst()
    addTable()
  })

  // Delete layer
  map.on(mars3d.EventType.removeLayer, function (event) {
    const layerId = event.layer

    const idx = tileLayerList.findIndex((item) => item.key === layerId)
    tileLayerList . splice ( idx , 1 ) ;

    addTable()

    if (thisLayer === layerId) {
      thisLayer = null
    }
    $("#layerName").html("") // Hide the editing panel
    $("#showEditor").hide()
  })
}

function selectedFirst() {
  setTimeout(() => {
    //Select the first one
    if (tileLayerList.length === 1) {
      const layer = tileLayerList[0]

      if (!layer.isTile) {
        return
      }

      $("#layerName").html(layer.name) // Obtained information about the corresponding layer
      $("#showEditor").show()
      thisLayer = map.getLayerById(layer.key.id)
      $("#show").attr("checked", thisLayer)
    }
  }, 50)
}

function setLayerOptions(attribute, val) {
  if (thisLayer) {
    thisLayer[attribute] = val
  }
}

//Add a row to the table to record item - data
function addTable() {
  //Add tr and td tables
  let tbody = document.getElementById("tbPoly")
  tbody.innerHTML = ``

  tileLayerList.forEach((item) => {
    let tr = document.createElement("tr")
    tr.innerHTML = `
            <tr>
              <td>${item.name}</td>
              <td>
                <a class="flyTo" href="javascript:void(0)" title="飞行定位"><i class="fa fa-send-o"></i></a>&nbsp;&nbsp;
                <a class="remove" href="javascript:void(0)" title="删除区域"><i class="fa fa-trash"></i></a>
              </td>
            </tr>`
    tbody.appendChild(tr)

    //Bind click event positioning
    tr.querySelector(".flyTo").addEventListener("click", function (e) {
      const layer = map.getLayerById(item.key.uuid)
      if (layer) {
        layer.flyTo()
      }
    })

    //Delete flattening data and flattening lines
    tr.querySelector(".remove").addEventListener("click", function (e) {
      const layer = map.getLayerById(item.key.uuid)
      if (layer) {
        layer.remove(true)
        // formState.layerName = "" // Hide the editing panel
      }
    })
  })
}