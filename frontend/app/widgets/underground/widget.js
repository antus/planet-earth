"use script";
(function (window, mars3d) {
  class MyWidget extends es5widget.BaseWidget {
    
    get resources() {
      return ["../../../lib/winbox/winbox.min.js",
			  "../../../lib/winbox/winbox.min.css",
			  "../../../widgets/underground/view.css",
			 ];
    }
	
	get view() {
      return {
        type: "append",
        url: "./widgets/underground/view.html",
      };
    }
	
    create() {
		
		this.tiles3dLayer = new mars3d.layer.TilesetLayer({
			name: "Underground pipe network",
			url: "//data.mars3d.cn/3dtiles/max-piping/tileset.json",
			position: { lng: 117.215457, lat: 31.843363, alt: -3.6 },
			rotation: { z: 336.7 },
			maximumScreenSpaceError: 2,
			maximumMemoryUsage: 1024,
			highlight: { type: "click", outlineEffect: true, width: 8, color: "#FFFF00" },
			popup: "all",
			center: { lat: 31.838081, lng: 117.216584, alt: 406, heading: 1, pitch: -34 },
		});
		this.map.addLayer(this.tiles3dLayer);
		this.tiles3dLayer.flyTo();
		
	}
	
    winCreateOK(opt, result) {
    }
	
    activate() {
		this.closing = false;
		this.winbox = new WinBox("Underground tools", {
			// unique ID
			//id: "my-window",
			// root element
			root: this.config.parent!=null?document.getElementById(this.config.parent):"body",
			// modal mode
			modal: false,
			// background color
			background: this.config.properties.background || "#1e243299",
			// margin width
			border: this.config.properties.border || 0,
			// width/height
			width: this.config.properties.width || 400,
			height: this.config.properties.height || 300,
			// x/y position
			x: this.config.properties.x || "center",
			y: this.config.properties.y || "center",
			top:this.config.properties.top || 50,
			left:this.config.properties.left || 0,
			bottom:this.config.properties.bottom || 26,
			right:this.config.properties.right || 0,
		    onclose: function(){
				if (!underground_widget.closing) {
					underground_widget.closing = true;
					underground_widget.removeAll();
					mars3d.widget.disable("widgets/underground/widget.js");
					underground_widget.closing = false;
				}
				
			},
			class: this.config.properties.class || [
				//"no-min",
				"no-max",
				"no-full",
				//"no-close"
			],
			// maximize the dialog on init
			max: false,
			mount: document.getElementById("underground_element")
		});
		$("#underground_element").css("display", "block");
		//toastr.info("winbox sample activate");

		this.initialize();
    }


	disable() {
		//toastr.info("winbox sample disable");
		$("#view_underground").toggleClass('fa-eye-slash');
		$("#view_underground").toggleClass('fa-eye');
		if (!this.closing) {
			this.closing = true;
			this.removeAll();
			this.winbox.close();
			this.closing = false;
		}
    }

	removeAll() {
		//this.tiles3dLayer = null;
		this.map.removeThing(this.underground);
		//this.underground = null;
		this.map.removeThing(this.terrainPlanClip);
		//this.terrainPlanClip = null;
	}

	initialize() {
		// Alpha
		$("#alpha").bootstrapSlider({ min: 0.0, max: 1.0, step: 0.1, value: 0.5 }).on("change", (e) => {
			if (e && e.value) {
			underground_widget.underground.alpha = e.value.newValue;
			}
		});
		//Underground think
		this.underground = new mars3d.thing.Underground({
		alpha: Number($("#alpha").val()),
		enabled: $("#chkUnderground").is(":checked"),
		});
		this.map.addThing(this.underground);

		$("#chkUnderground").change(function () {
			var val = $(this).is(":checked");
			underground_widget.underground.enabled = val;
		});

		//TerrainClip think
		this.terrainPlanClip = new mars3d.thing.TerrainPlanClip({
			/*
			positions: [
				[117.214769, 31.842048, 42.63],
				[117.217764, 31.842048, 42.63],
				[117.217764, 31.843312, 42.63],
				[117.214769, 31.843312, 42.63],
			],
			*/
			diffHeight: Number($("#txtHeight").val()), 
			image: "./img/textures/excavate_side_min.jpg", 
			imageBottom: "./img/textures/excavate_bottom_min.jpg", 
			splitNum: 50, 
		});
		this.map.addThing(this.terrainPlanClip);

		$("#chkTestTerrain").change(function () {
		var val = $(this).is(":checked");
			underground_widget.map.scene.globe.depthTestAgainstTerrain = val;
		});

		$("#chkClippingPlanes").change(function () {
		var val = $(this).is(":checked");
			underground_widget.terrainPlanClip.enabled = val;
		});
		$("#txtHeight").change(function () {
		var num = Number($(this).val());
			underground_widget.terrainPlanClip.height = num;
		});

		$("#clearWJ").click(function () {
			underground_widget.terrainPlanClip.clear(); 
		});

		$("#btnDraw").click(function () {
			underground_widget.terrainPlanClip.clear(); 
			underground_widget.map.graphicLayer.startDraw({
				type: "polygon",
				style: {
				color: "#007be6",
				opacity: 0.5,
				clampToGround: true,
				},
				success: function (graphic) {
					//绘制成功后回调
					var positions = graphic.positionsShow;
					underground_widget.map.graphicLayer.clear();

					console.log(JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))); 

					//挖地区域
					underground_widget.terrainPlanClip.positions = positions;
				},
			});
		});

		$("#btnDrawExtent").click(function () {
			underground_widget.terrainPlanClip.clear(); 

			underground_widget.map.graphicLayer.startDraw({
				type: "rectangle",
				style: {
				color: "#007be6",
				opacity: 0.8,
				outline: false,
				},
				success: function (graphic) {
				//绘制成功后回调
				var positions = graphic.getOutlinePositions(false);
				underground_widget.map.graphicLayer.clear();

				console.log(JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))); 

				//挖地区域
				underground_widget.terrainPlanClip.positions = positions;
				},
			});
		});
	}

	centerAtDX1() {
		map.setCameraView({
			lat: 31.840106,
			lng: 117.216768,
			alt: 554.36,
			heading: 0,
			pitch: -59.3,
			roll: 0,
		});
	}

    centerAtDX2() {
        map.setCameraView({
          lat: 31.841263,
          lng: 117.21538,
          alt: -13.35,
          heading: 40.6,
          pitch: 15.7,
          roll: 0.1,
        });
    }
	
  }

  underground_widget = es5widget.bindClass(MyWidget);

})(window, mars3d);
