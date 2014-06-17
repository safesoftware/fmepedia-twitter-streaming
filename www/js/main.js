function initialize() {
	// see FMEServer.js for parameter values
	fmeserver = new FMEServer("fmepedia2014-safe-software.fmecloud.com", "8be243c0fc2f5f34977050bdab57ebbdd3e72aa2");

	var myLatlng = new google.maps.LatLng(17.7850,-12.4183);
  	var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
	var myOptions = {
		zoom: 3,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
    styles: light_grey_style
	}

	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var heatmap;
	var liveTweets = new google.maps.MVCArray();
  var countryJSON = {
    total:0,
    countries:[]
  };

	heatmap = new google.maps.visualization.HeatmapLayer({
		data: liveTweets,
    radius: 25
	});

 heatmap.setMap(map);

	// Storage for WebSocket connections
	var ws; 
	// Do we have web sockets?
	if ("WebSocket" in window) {


		// ============= AIS ====================
		ws = fmeserver.getWebSocketConnection("twitter-stream-out");

		// receive
		ws.onmessage = function (evt) {

			var data = evt.data;
			dataObj = jQuery.parseJSON(data);
			var tweetLocation = new google.maps.LatLng(dataObj.lng,dataObj.lat);
			liveTweets.push(tweetLocation);

      var image = "css/small-dot-icon.png";

       var marker = new google.maps.Marker({
         position: tweetLocation,
         map: map,
         icon: image
       });

       
       setTimeout(
        function(){  
          marker.setMap(null);
        }, 500);
   };
    
    // close
    ws.onclose = function() {
    };

	} else {
		alert("You have no web sockets. Try using the latest Firefox, Chrome or Safari browser.");

	};

}