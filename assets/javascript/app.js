$(document).ready(function(){

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
			//set all furniture invisible, to be set visible if in roomData array
			var furnitureElements =  this.el.children;
			for(var i=0; i<furnitureElements.length;i++) {
				furnitureElements[i].setAttribute("visible",false)
			}
			var roomData = e.detail.roomData;
			console.log("roomData",roomData)
			var roomRatio = roomData[0];
			roomData.forEach(function(item, idx){
				if(idx===0) return; //skip first idx which is room ratio data

				console.log("itemID",item.id)
				var el = document.getElementById(item.id)
				el.setAttribute("visible",true)

				//transform data from canvas coordinate system to three.js coordinate system

				var scalar = 0.01;
				var xRoomOffset = roomRatio.size.width/2;
				var zRoomOffset = roomRatio.size.height/2;

				var dimensionArr = item.dimensions.match(/\d+\s/g);
				var xItemOffset = dimensionArr[0]/2;
				var yItemOffset = dimensionArr[1]/2;



				var xPosition = (item.position.x - xRoomOffset + xItemOffset)*scalar;
				var zPosition = (item.position.y - zRoomOffset + yItemOffset)*scalar;
				var position = {
					x: xPosition,
					y: 0,
					z: zPosition
				}
				var degreeRotation =  item.degree
				el.setAttribute("position",position);
				el.setAttribute("rotation",{
					x: 0,
					y: degreeRotation * -1,
					z: 0
				})
			})



		}


	});

	AFRAME.registerComponent("scale-room",{
		init: function() {
			this.scaleRoom = this.scaleRoom.bind(this);
			this.el.sceneEl.addEventListener("firebase-room-data",this.scaleRoom)
		},
		scaleRoom: function(e) {
			var roomRatio = e.detail.roomData[0].size;
			var scalar = 0.01
			this.el.setAttribute("room",{
				width: roomRatio.width*scalar,
				depth: roomRatio.height*scalar
			})

		}
	})



});