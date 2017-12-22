$(document).ready(function(){
	var dummyData = {
	roomRatio: {
		x: 10,
		y: 10
	},
	items:	[
			{
				id: "chair",
				position: {
					x: 0,
					z: -2
				}
			},{
				id: "table",
				position: {
					x: 1,
					z: -3
				}
			},{
				id: "lamp",
				position: {
					x: 2,
					z: -4
				}
			}
		]

	}


	dummyData =  JSON.stringify(dummyData);


	AFRAME.registerComponent("position-items",{
		init: function() {
			this.positionItems = this.positionItems.bind(this);
			var data = JSON.parse(dummyData).items;
			this.el.sceneEl.addEventListener("item-data-loaded",this.positionItems) ;
			this.el.emit("item-data-loaded", {
				items: data
			})
		},
		positionItems: function(e) {
			var data = e.detail.items
			var self = this;
			data.forEach(function(item){
				var el = self.el.querySelector("#" + item.id);
				el.setAttribute("position",item.position);
				el.setAttribute("visible",true)

			})
		}


	});

	AFRAME.registerComponent("room-controller",{
		init: function() {
			var roomRatio = JSON.parse(dummyData).roomRatio;
			this.el.setAttribute("room",{
				depth: roomRatio.y,
				width: roomRatio.x
			})
		},
		dependencies: ["room"]
	})

	AFRAME.registerComponent("room",{
		schema: {
			depth: {
				default: 10
			},
			width: {
				default: 10
			},

		},
		init: function() {
		  this.el.setAttribute("geometry",{
		  	depth:  this.data.depth,
		  	width: this.data.width,
		  	height: 4,
		  });
		  this.el.setAttribute("position","0 1.99 0")
		  this.el.setAttribute("material",{
		  	side: "back"
		  });

		},
		update: function() {
			var depth = this.data.depth;
			var width = this.data.width;
			this.el.setAttribute("geometry",{
				depth: depth,
				width: width
			})
		}
	})


});