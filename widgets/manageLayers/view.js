 "use script" //It is recommended to turn on strict mode in the development environment

//Corresponds to the object instantiated by MyWidget in widget.js
let thisWidget
let layers = []
let layersObj = {}

//Current page business
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget

  //right click
  bindRightMenuEvnet()

  //Initialize tree
  let setting = {
    check: {
      enable: true
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onCheck: treeOverlays_onCheck,
      onRightClick: treeOverlays_OnRightClick,
      onDblClick: treeOverlays_onDblClick,
      onClick: treeOverlays_onClick
    },

    view: {
      addDiyDom: addOpacityRangeDom
    }
  }

  let zNodes = []
  layers = thisWidget.getLayers()
  for (let i = layers.length - 1; i >= 0; i--) {
    let node = _getNodeConfig(layers[i])
    if (node) {
      zNodes.push(node)
    }
  }
  $.fn.zTree.init($("#treeOverlays"), setting, zNodes)
}

function _getNodeConfig(layer) {
  if (layer == null || !layer.options || layer.isPrivate || layer.parent) {
    return
  }

  let item = layer.options

  if (!item.name || item.name == "Unnamed") {
    console.log("Unnamed layers are not added to layer management", layer)
    return
  }

  let node = {
    id: layer.id,
    pId: layer.pid,
    name: layer.name,
    checked: layer.isAdded && layer.show
  }

  if (layer.hasEmptyGroup) {
    //empty array
    node.icon = "img/folder.png"
    node.open = item.open == null ? true : item.open
  } else if (layer.hasChildLayer) {
    //Array with child nodes
    node.icon = "img/layerGroup.png"
    node.open = item.open == null ? true : item.open
  } else {
    node.icon = "img/layer.png"
    if (layer.parent) {
      node._parentId = layer.parent.id
    }
  }
  //record layer
  layersObj[node.id] = layer
  return node
}

function addNode(item) {
  let treeObj = $.fn.zTree.getZTreeObj("treeOverlays")

  let parentNode
  if (item.pid && item.pid != -1) {
    parentNode = treeObj.getNodeByParam("id", item.pid, null)
  }

  let node = _getNodeConfig(item)
  if (!node) {
    return
  }

  treeObj.addNodes(parentNode, 0, [node], true)

  //Update child node layer
  if (item.hasChildLayer) {
    item.eachLayer((childLayer) => {
      removeNode(childLayer)
      addNode(childLayer)
    })
  }
}

function removeNode(layer) {
  let treeObj = $.fn.zTree.getZTreeObj("treeOverlays")

  let node = treeObj.getNodeByParam("id", layer.id, null)
  if (node) {
    treeObj.removeNode(node)
  }
}

function updateNode(layer) {
  let treeObj = $.fn.zTree.getZTreeObj("treeOverlays")

  let node = treeObj.getNodeByParam("id", layer.id, null)
  let show = layer.isAdded && layer.show
  if (node) {
    //update node
    if (node.checked == show) {
      return
    }

    node.checkedOld = node.checked
    node.checked = show

    treeObj.updateNode(node)
  } else {
    addNode(layer, show)
  }
}

//====================================Double-click to position the layer========== ===========================
function treeOverlays_onClick(e, treeId, treeNode, clickFlag) {
  // if (treeNode == null || treeNode.id == null) {
  //   return
  // }
  // var layer = layersObj[treeNode.id]
  // if (layer) {
  //   thisWidget.checkClickLayer(layer, treeNode.checked)
  // }
}

function treeOverlays_onDblClick(event, treeId, treeNode) {
  if (treeNode == null || treeNode.id == null) {
    return
  }
  let layer = layersObj[treeNode.id]
  if (layer && layer.show) {
    layer.flyTo()
  }
}

//================================== Check to show hidden layers======== =============================
function removeArrayItem(arr, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1)
      return true
    }
  }
  return false
}

function treeOverlays_onCheck(e, treeId, chktreeNode) {
  let treeObj = $.fn.zTree.getZTreeObj(treeId)
  //Get all nodes that change check status
  let changedNodes = treeObj.getChangeCheckedNodes()

  removeArrayItem(changedNodes, chktreeNode)
  changedNodes.push(chktreeNode)

  for (let i = 0; i < changedNodes.length; i++) {
    var treeNode = changedNodes[i]
    treeNode.checkedOld = treeNode.checked

    if (treeNode.check_Child_State == 1) {
      // 0: No child nodes are checked, 1: Some child nodes are checked, 2: All child nodes are checked, -1: There are no child nodes or all child nodes are set to nocheck = true
      continue
    }

    var layer = layersObj[treeNode.id]
    if (layer == null) {
      continue
    }

    //Show hide transparency setting view
    if (treeNode.checked) {
      $("#slider" + treeNode.tId).css("display", "")
    } else {
      $("#slider" + treeNode.tId).css("display", "none")
    }

    //Specially handle the mutually exclusive nodes of single selection in the same directory. You can configure "radio":true in the corresponding layer node of config.
    if (layer.options.radio && treeNode.checked) {
      let nodes = treeObj.getNodesByFilter(
        function (node) {
          let item = layersObj[node.id]
          return item.options.radio && item.pid == layer.pid && node.id != treeNode.id
        },
        false,
        treeNode.getParentNode()
      )
      for (let nidx = 0; nidx < nodes.length; nidx++) {
        nodes[nidx].checkedOld = false
        treeObj.checkNode(nodes[nidx], false, true)

        $("#" + nodes[nidx].tId + "_range").hide()

        let layertmp = layersObj[nodes[nidx].id]
        layertmp.show = false
      }
    }

    //Processing layer display and hiding
    thisWidget.updateLayerShow(layer, treeNode.checked)
  }

  let layerThis = layersObj[chktreeNode.id]
  if (layerThis) {
    thisWidget.checkClickLayer(layerThis, chktreeNode.checked)
  }
}

//====================================Transparency settings============ =========================

//Add custom control after node
function addOpacityRangeDom(treeId, tNode) {
  //if (tNode.icon == "images/folder.png") return;

  let layer = layersObj[tNode.id]
  if (!layer || (!layer.hasOpacity && !layer.options.hasOpacity)) {
    return
  }

  let view = $("#" + tNode.tId)
  let silder = '<input id="' + tNode.tId + '_range" style="display:none" />'
  view.append(silder)
  $("#" + tNode.tId + "_range")
    .slider({ id: "slider" + tNode.tId, min: 0, max: 100, step: 1, value: (layer.opacity || 1) * 100 })
    .on("change", (e) => {
      let opacity = e.value.newValue / 100
      let layer = layersObj[tNode.id]
      //Set the transparency of the layer
      // thisWidget.udpateLayerOpacity(layer, opacity)
      layer.opacity = opacity
    })

  if (!tNode.checked) {
    $("#slider" + tNode.tId).css("display", "none")
  }
}

//====================================Right-click menu============ =========================
let lastRightClickTreeId
let lastRightClickTreeNode

function treeOverlays_OnRightClick(event, treeId, treeNode) {
  if (treeNode == null) {
    return
  }

  let layer = layersObj[treeNode.id]
  if (!layer || !layer.hasZIndex) {
    return
  }

  //Node when right clicked
  lastRightClickTreeId = treeId
  lastRightClickTreeNode = treeNode

  let top = event.clientY
  let left = event.clientX
  let maxtop = document.body.offsetHeight - 100
  let maxleft = document.body.offsetWidth - 100

  if (top > maxtop) {
    top = maxtop
  }
  if (left > maxleft) {
    left = maxleft
  }

  $("#content_layer_manager_rMenu")
    .css({
      top: top + "px",
      left: left + "px"
    })
    .show()
  $("body").bind("mousedown", onBodyMouseDown)
}

function onBodyMouseDown(event) {
  if (!(event.target.id == "content_layer_manager_rMenu" || $(event.target).parents("#content_layer_manager_rMenu").length > 0)) {
    hideRMenu()
  }
}

function hideRMenu() {
  $("body").unbind("mousedown", onBodyMouseDown)
  $("#content_layer_manager_rMenu").hide()
}

function bindRightMenuEvnet() {
  $("#content_layer_manager_rMenu li").on("click", function () {
    hideRMenu()

    let type = $(this).attr("data-type")
    moveNodeAndLayer(type)
  })
}

//Move node and layer position
function moveNodeAndLayer(type) {
  let treeObj = $.fn.zTree.getZTreeObj(lastRightClickTreeId)

  //Get all sibling nodes of the current node
  let childNodes
  let parent = lastRightClickTreeNode.getParentNode()
  if (parent == null) {
    childNodes = treeObj.getNodes()
  } else {
    childNodes = parent.children
  }

  let thisNode = lastRightClickTreeNode
  let thisLayer = layersObj[thisNode.id]

  switch (type) {
    default:
      break
    case "up": //Move the layer up one layer
      {
        let moveNode = thisNode.getPreNode()
        if (moveNode) {
          treeObj.moveNode(moveNode, thisNode, "prev")
          let moveLayer = layersObj[moveNode.id]

          exchangeLayer(thisLayer, moveLayer)
        }
      }
      break

    case "top": //The layer is placed on top
      {
        if (thisNode.getIndex() == 0) {
          return
        }
        while (thisNode.getIndex() > 0) {
          //bubble exchange
          let moveNode = thisNode.getPreNode()
          if (moveNode) {
            treeObj.moveNode(moveNode, thisNode, "prev")

            let moveLayer = layersObj[moveNode.id]
            exchangeLayer(thisLayer, moveLayer)
          }
        }
      }
      break

    case "down": //Move the layer down one layer
      {
        let moveNode = thisNode.getNextNode()
        if (moveNode) {
          treeObj.moveNode(moveNode, thisNode, "next")

          let moveLayer = layersObj[moveNode.id]
          exchangeLayer(thisLayer, moveLayer)
        }
      }
      break
    case "bottom": //The layer is placed at the bottom
      {
        if (thisNode.getIndex() == childNodes.length - 1) {
          return
        }

        while (thisNode.getIndex() < childNodes.length - 1) {
          //bubble exchange
          let moveNode = thisNode.getNextNode()
          if (moveNode) {
            treeObj.moveNode(moveNode, thisNode, "next")

            let moveLayer = layersObj[moveNode.id]
            exchangeLayer(thisLayer, moveLayer)
          }
        }
      }
      break
  }

  //Reorder by order
  layers.sort(function (a, b) {
    return a.zIndex - b.zIndex
  })
}

/**
 * Swap adjacent layers: layer1 is the layer to be moved, layer2 is the target layer to move
 */
function exchangeLayer(layer1, layer2) {
  if (layer1 == null || layer2 == null) {
    return
  }
  let or = layer1.zIndex
  layer1.zIndex = layer2.zIndex //Move up
  layer2.zIndex = or //Move down

  console.log(`${layer1.name}:${layer1.zIndex},  ${layer2.name}:${layer2.zIndex}`)

  // //Move up
  // thisWidget.udpateLayerZIndex(layer1, layer1.zIndex)
  // //Move Downward
  // thisWidget.udpateLayerZIndex(layer2, layer2.zIndex)
}

//====================================Other============ ========================

//Add and remove monitoring for map layer, automatically checked
function updateCheckd(name, checked) {
  let treeObj = $.fn.zTree.getZTreeObj("treeOverlays")
  let nodes = treeObj.getNodesByParam("name", name, null)
  if (nodes && nodes.length > 0) {
    treeObj.checkNode(nodes[0], checked, false)
  } else {
    console.log("Layer "" + name + "" was not found in the layer tree and cannot be automatically checked for processing")
  }
}
