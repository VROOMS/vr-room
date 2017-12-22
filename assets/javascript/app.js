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
	});

	AFRAME.registerComponent("firebase-sync",{
		init: function() {
		   var self = this;
		   var config = {
		      apiKey: "AIzaSyBx-TRdttTPiVKW_8yQ0OdMDYwxt2tORNI",
		      authDomain: "frameyourroom-110ed.firebaseapp.com",
		      databaseURL: "https://frameyourroom-110ed.firebaseio.com",
		      projectId: "frameyourroom-110ed",
		      storageBucket: "frameyourroom-110ed.appspot.com",
		      messagingSenderId: "313702378796"
	  		};
    		firebase.initializeApp(config);
    		this.database = firebase.database();

   			this.roomDataRef = this.database.ref("-L0lnD2HZtHWqW9cmZYk");
   			this.roomDataRef.on("value", function(snapshot){
	   			var roomData = snapshot.val()
   				self.el.emit("firebase-room-data",{
   					roomData: roomData
   				})
   			});

		}

	});

	AFRAME.registerComponent("position-items",{
		init: function() {
			this.positionItems = this.positionItems.bind(this);
			// var data = JSON.parse(dummyData).items;
			this.el.sceneEl.addEventListener("firebase-room-data",this.positionItems);

		},
		positionItems: function(e) {
			var self = this;
			var roomData = e.detail.roomData;
			console.log("roomData",roomData)
			var roomRatio = roomData[0];
			roomData.forEach(function(item, idx){
				if(idx===0) return; //skip first idx which is room ratio data
				console.log("itemID",item.id)
				var el = document.getElementById(item.id)
				//transform data from canvas coordinate system to three.js coordinate system
				var scalar = 0.02;
				var xOffset = roomRatio.ratio.x/2;
				var zOffset = roomRatio.ratio.y/2;
				var xPosition = (item.position.x - xOffset)*scalar;
				var zPosition = (item.position.y - zOffset)*scalar;
				var position = {
					x: xPosition,
					y: 0,
					z: zPosition
				}
				var degreeRotation =  item.degree
				el.setAttribute("position",position);
				el.setAttribute("rotation",{
					x: 0,
					y: degreeRotation,
					z: 0
				})
				el.setAttribute("visible",true)
			})



		}


	});

	AFRAME.registerComponent("scale-room",{
		init: function() {
			this.scaleRoom = this.scaleRoom.bind(this);
			this.el.sceneEl.addEventListener("firebase-room-data",this.scaleRoom)
		},
		scaleRoom: function(e) {
			var roomRatio = e.detail.roomData[0].ratio;
			var scalar = 0.02
			this.el.setAttribute("room",{
				width: roomRatio.x*scalar,
				depth: roomRatio.y*scalar
			})

		}
	})




});