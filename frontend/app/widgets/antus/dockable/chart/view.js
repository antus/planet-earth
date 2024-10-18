class Chart {
  constructor(widget, properties) {
    this.widget = widget;
    this.properties = properties;
    this.init();
  }

  /********** Widget Initialization  **********/
  init() {
      console.log("Init Component obj with id: " + this.properties.id)
      if (this.widget.map) {
          // Set camera channge listener
          this.widget.map.on(mars3d.EventType.cameraChanged, this.refresh, this)
          this.widget.map.on(mars3d.EventType.cameraMoveEnd, this.refresh, this)
      }
      const id = this.properties.id;
      // get the reference div 
      var refDiv = $("#" + id)[0];
      if (refDiv) {
          // Load view
          fetch(this.widget.path + "view.html")
          .then((response) => response.text())
              .then((htmlTemplate) => {
                  var id = this.properties.id;
                  // Substitute variables
                  var html = htmlTemplate.replaceAll("${id}", id);
                  $(refDiv).html( html);
                  // init component              
                  this.initPayload();
              });
      }
  }
  
  // Init payload
  initPayload() {
    const obj = this;
    // load payload template
    fetch(this.widget.path+ "payload.xml")
    .then((response) => response.text())
    .then((xmlString) => {
        // Set payload template
        this.properties.payloadTemplate = xmlString;
        var dom = $("#dchart-" + this.properties.id)[0];
        this.chart = echarts.init(dom, 'dark', {
            renderer: 'canvas',
            useDirtyRect: false
          });
        this.refresh();
    });
  }
      
  // Call the WPS  
  refresh() {
    if (this.widget.map) {
        if (this.properties.payloadTemplate) {
            const properties = this.properties;
            const extent = this.widget.map.getExtent({scale:-0.1});
            const bbox =  extent.xmin + " " + extent.ymin + " " +
                        extent.xmin + " " + extent.ymax + " " + 
                        extent.xmax + " " + extent.ymax + " " + 
                        extent.xmax + " " + extent.ymin + " " + 
                        extent.xmin + " " + extent.ymin;
            var xmlString = properties.payloadTemplate;                
            xmlString = xmlString.replace("$layer", properties.layer);
            xmlString = xmlString.replace("$xAttribute", properties.xAttribute);
            xmlString = xmlString.replace("$yAttribute", properties.yAttribute);
            xmlString = xmlString.replace("$function", properties.function);
            xmlString = xmlString.replace("$bbox", bbox);
            //console.log(xmlString);
            var url = properties.server + "?service=WPS&version=1.0.0&REQUEST=Execute"
            const ref = this;
            // Send the data using post
            $.ajax({
            url: 'http://localhost:8888/' + url,
            data: xmlString, 
            type: 'POST',
            contentType: "application/xml",
            dataType: "text",
            success : function(result) {
                const res = JSON.parse(result);
                ref.buildChart(res, ref.properties.type);
            },
            error : function (xhr, ajaxOptions, thrownError){  
                console.log(xhr.status);          
                console.log(thrownError);
            } 
            }); 
        }
    }
  }
  /********** End of Widget Initialization  **********/

  buildChart(result, type) {
      var option = {};
      switch (type)
      {
        case "bar":
        case "line":
          option = this.getBarLineOpt(result, type);
          break;
        case "pie":
          option = this.getPieOpt(result);
          break;
      }
      this.chart.setOption(option);
  }
    
  getBarLineOpt(result,type) {
      // Create dataset
      var xData=[]
      var yData=[]
      result.AggregationResults.forEach(element => {
        xData.push(element[0]);
        yData.push(element[1])
      });
    
      // Set chart options
      var option = {
        backgroundColor: '#222222',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: type,
            barWidth: '60%',
            data: yData
          }
        ]
      };
      return option;
  }
    
    
  getPieOpt(result) {
      // Create dataset
      var data=[]
      result.AggregationResults.forEach(element => {
        data.push(
          {
          value: element[1],
          name: element[0]
          }
        );
      });
    
      // Set chart options
      var option = {
        backgroundColor: '#222222',
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      return option;
  }

  resize() {
    this.chart.resize();
  }

}