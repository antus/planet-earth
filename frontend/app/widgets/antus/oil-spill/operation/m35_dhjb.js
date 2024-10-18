/* eslint-disable no-undef */
//Script object method
function initEditorJS(map) {
  let first = {
    activate: function () {
      JB.showPanel("The first step is to send a signal")
      firstStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let second = {
    activate: function () {
      JB.showPanel("Step 2: Send signal")
      secondStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let third = {
    activate: function () {
      JB.showPanel("The third step is to issue the command")
      thirdStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let forth = {
    activate: function () {
      JB.showPanel("Step 4: Get ready to go")
      forthStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let fifth = {
    activate: function () {
      JB.showPanel("Step 5: Start")
      fifthStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let sixth = {
    activate: function () {
      JB.showPanel("Step 6: Deal with leaks")
      sixthStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let seventh = {
    activate: function () {
      JB.showPanel("Step 7: Complete rescue")
      seventhStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  //Script configuration information (including sequence, time, business objects)
  let data = [
    {
      text: "Rescue Steps",
      state: {
        opened: true,
        selected: true
      },
      children: [
        {
          text: "Send signal",
          times: 4,
          widget: first
        },
        {
          text: "Transmit signal",
          times: 4,
          widget: second
        },
        {
          text: "Give instructions",
          times: 4,
          widget: third
        },
        {
          text: "Ready to go",
          times: 4,
          widget: forth
        },
        {
          text: "Departure",
          times: 6,
          widget: fifth
        },
        {
          text: "Handling leaks",
          times: 4,
          widget: sixth
        },
        {
          text: "Rescue completed",
          times: 4,
          widget: seventh
        }
      ]
    }
  ]
  // eslint-disable-next-line no-undef
  dataWork.initData(data)
}
