var request = new XMLHttpRequest();
request.open("GET", "latlong.csv", false);
request.send(null);

var data = request.responseText.split(" "),
        latitude = data[0],
        longitude = data[1];

var map = 1;
var point = null;
var points = [];
var zoomer = 15;
var flightPlan = [];
var flightPath, flightDistance, nextDistance;

var initialize = function() {
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    flightPlan.shift();
    flightPlan.unshift(myLatlng);
    var mapOptions = {
        zoom: zoomer,
        center: myLatlng
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var quadPosition = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5
        },
        title: 'Current position of your Quadcopter'
    });
    flightPath = new google.maps.Polyline({
        path: flightPlan,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        points.push(point);
        flightPlan.push(point);
        var path = flightPath.getPath();
        path.push(point);
        flightPath.setPath(path);
        flightDistance = google.maps.geometry.spherical.computeLength(path.getArray());
        nextDistance = google.maps.geometry.spherical.computeLength(path.getArray().slice(0, 2));
        console.log('Points: ' + points.toString());
        console.log('Flightplan: ' + flightPlan.toString());
        console.log('Flight Distance: ' + flightDistance + ' meters');
        console.log('Distance to next: ' + nextDistance + ' meters');
    });
    function previousMarkers() {
        if (points === null) {
            return;
        }
        else {
            for (var i = 0; i < points.length; i++) {
                placeMarker(points[i]);
            }
        }
    }

    function placeMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP
        });
        point = marker.getPosition();
        google.maps.event.addListener(marker, 'rightclick', function() {
            point = marker.getPosition();
            marker.setMap(null);
            var index = points.indexOf(point);
            points.splice(index, 1);
            flightPlan.splice(index + 1, 1);
            initialize();
            flightDistance = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray());
            nextDistance = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray().slice(0, 2));
            console.log('Points: ' + points.toString());
            console.log('Flightplan: ' + flightPlan.toString());
            console.log('Flight Distance: ' + flightDistance + ' meters');
            console.log('Distance to next: ' + nextDistance + ' meters');
        });
    }
    if (point === null) {
        return;
    }
    else {
        previousMarkers();
    }
    setInterval(function() {
        var request = new XMLHttpRequest();
        request.open("GET", "latlong.csv", false);
        request.send(null);

        var data = request.responseText.split(" "),
                latitude = data[0],
                longitude = data[1];

        var myLatlng = new google.maps.LatLng(latitude, longitude);
        quadPosition.setPosition(myLatlng);
        flightPlan.shift();
        flightPlan.unshift(myLatlng);
        map.panTo(myLatlng);
    }, 2500);
};
$(document).ready(function() {
    $("#resize-icon").on("click", function() {
        map *= -1;
        if (map === -1) {
            $("#map-canvas").css({"height": "400px",
                "width": "100%"});
            $("#map-panel").css({"height": "460px",
                "width": "97%"});
            $("#map").css({"height": "400px",
                "width": "100%"});
            $("#resize-icon").attr("src", "img/appbar.arrow.collapsed.white.svg");
            zoomer = 11;
        } else {
            $("#map-canvas").css({"height": "250px",
                "width": "250px"});
            $("#map-panel").css({"height": "310px",
                "width": "250px"});
            $("#map").css({"height": "250px",
                "width": "100%"});
            $("#resize-icon").attr("src", "img/appbar.arrow.expand.white.svg");
            zoomer = 14;
        }
        initialize();
    });
});
google.maps.event.addDomListener(window, 'load', initialize);