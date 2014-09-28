function initialize() {
  var myLatlng = new google.maps.LatLng(57.706815, 11.936870);
  var mapOptions = {
    zoom: 18,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Current position of the QI Quadcopter'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);