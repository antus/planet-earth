/* eslint-disable no-undef */
//Script object method
function initEditorJS(map) {
  let initSceneFun = {
    activate: function () {
      JB.showPanel("The first step is to send a signal")
      initScene()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let acceptanceFun = {
    activate: function () {
      JB.showPanel("Step 2: Send signal")
      acceptance()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let taskFun = {
    activate: function () {
      JB.showPanel("The third step is to issue the command")
      task()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let startTaskFun = {
    activate: function () {
      JB.showPanel("Step 4: Get ready to go")
      startTask()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let satelliteLookFun = {
    activate: function () {
      JB.showPanel("Step 5: Start")
      satelliteLook()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let sendDataActionFun = {
    activate: function () {
      JB.showPanel("Step 6: Deal with leaks")
      sendDataAction()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let transferringDataFun = {
    activate: function () {
      JB.showPanel("Step 7: Complete rescue")
      transferringData()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let productionFun = {
    activate: function () {
      JB.showPanel("Step 6: Deal with leaks")
      production()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let distributionFun = {
    activate: function () {
      JB.showPanel("Step 7: Complete rescue")
      distribution()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  //Script configuration information (including sequence, time, business objects)
  let data = [
    {
      text: "Satellite deduction",
      state: {
        opened: true,
        selected: false
      },
      children: [
        {
          text: "Initialization scene",
          times: 2,
          widget: initSceneFun
        },
        {
          text: "Demand Acceptance",
          times: 8,
          widget: acceptanceFun
        },
        {
          text: "Task Arrangement",
          times: 7,
          widget: taskFun
        },
        {
          text: "Task note",
          times: 10,
          widget: startTaskFun
        },
        {
          text: "Satellite Observation",
          times: 15,
          widget: satelliteLookFun
        },
        {
          text: "data reception",
          times: 10,
          widget: sendDataActionFun
        },
        {
          text: "Data transmission",
          times: 10,
          widget: transferringDataFun
        },
        {
          text: "Product Production",
          times: 5,
          widget: productionFun
        },
        {
          text: "Product Distribution",
          times: 5,
          widget: distributionFun
        }
      ]
    }
  ]
  // eslint-disable-next-line no-undef
  dataWork.initData(data)
}
