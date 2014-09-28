var request = new XMLHttpRequest();
request.open("GET", "latlong.csv", false);
request.send(null);

var data = request.responseText.split(" "),
latitude = data[0],
longitude = data[1];

var initialize = function() {
  var myLatlng = new google.maps.LatLng(latitude, longitude);
  var mapOptions = {
    zoom: 18,
    center: myLatlng
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Current position of your Quadcopter'
  });
  
  setInterval(function() {
		var request = new XMLHttpRequest();
		request.open("GET", "latlong.csv", false);
		request.send(null);
		
		var data = request.responseText.split(" "),
			latitude = data[0],
			longitude = data[1];
		
		var myLatlng = new google.maps.LatLng(latitude, longitude);
		marker.setPosition(myLatlng);
		map.setCenter(myLatlng);
		
	}, 5000);
}

google.maps.event.addDomListener(window, 'load', initialize);