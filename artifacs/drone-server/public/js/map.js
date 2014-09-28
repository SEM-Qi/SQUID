var myLatlng, quadPosition = null;
var mapper = 1;
var point = null;
var points = [];
var zoomer = 13;
var flightPlan = [];
var allDist = [];
var flightPath, finalFlight, nextDistance, flightDistance, myVar;


var initialize = function() {
    myLatlng, quadPosition = null;
    clearInterval(myVar);
    var marker, map;
    //latitude and longitude of GPS on quad is recieved from gamepad.js
    myLatlng = new google.maps.LatLng(lat, long);
    flightPlan.shift();
    flightPlan.unshift(myLatlng);
    //map is created with the options given
    var mapOptions = {
        zoom: zoomer,
        center: myLatlng
        
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //initial quad position is created and put onto map
    quadPosition = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5
        },
        title: 'Current position of your Quadcopter'
    });
    //flight path created and set on map, to be updated when markers are made
    flightPath = new google.maps.Polyline({
        path: flightPlan,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);
    //listener for clicking on the map
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        //updates the various arrays containing the paths and points
        points.push(point);
        flightPlan.push(point);
        var path = flightPath.getPath();
        path.push(point);
        flightPath.setPath(path);
        flightDistance = google.maps.geometry.spherical.computeLength(path.getArray());
        nextDistance = google.maps.geometry.spherical.computeLength(path.getArray().slice(0, 2));
        $("#total-distance").html(" " + Math.round(flightDistance) + "m");
        $("#next-distance").html(" " + Math.round(nextDistance) + "m");
    });
    //places markers at the stored points, which get deleted whenever the map is initialized.
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
    //places a marker at the given position when map is clicked
    function placeMarker(location) {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP
        });
        //listener for clicking on a marker already on the map
        google.maps.event.addListener(marker, 'click', function() {
            point = this.getPosition();
            //deletes the marker at this position and updates the various arrays containing the points and path
            this.setMap(null);
            var index = points.indexOf(point);
            points.splice(index, 1);
            flightPlan.splice(index + 1, 1);
            flightPath.setPath(flightPlan);
            flightDistance = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray());
            nextDistance = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray().slice(0, 2));
            $("#total-distance").html(" " + Math.round(flightDistance) + "m");
            $("#next-distance").html(" " + Math.round(nextDistance) + "m");
        });
        point = marker.getPosition();
    }
    previousMarkers();
    myVar = setInterval(function() {
        //update the quad position from 0 to current, and pan to it only once
        myLatlng = new google.maps.LatLng(lat, long);
        console.log(lat, long);
        quadPosition.setPosition(myLatlng);
        //updates the various arrays with the new quad position 
        flightPlan.shift();
        flightPlan.unshift(myLatlng);
        flightPath.setPath(flightPlan);
        flightDistance = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray());
        nextDistance = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray().slice(0, 2));
        $("#total-distance").html(" " + Math.round(flightDistance) + "m");
        $("#next-distance").html(" " + Math.round(nextDistance) + "m");
    }, 1000);
};
$(document).ready(function() {
    $("#resize-button").on("click", function() {
        //when map is small, clicking the resize button makes the map larger, vice versa
        mapper *= -1;
        if (mapper === -1) {
            $("#map-navbar").css({
                "width": "100%"
            });
            $("#map-canvas").css({
                "height": "400px",
                "width": "100%"
            });
            $("#map-panel").css({
                "height": "460px",
                "width": "97%"
            });
            $("#map").css({
                "height": "400px",
                "width": "100%"
            });
            //changes the image on the button
            $("#resize-icon").removeClass("glyphicon glyphicon-resize-full");
            $("#resize-icon").addClass("glyphicon glyphicon-resize-small");
            zoomer = 11;
        } else {
            $("#map-navbar").css({
                "width": "250px"
            });
            $("#map-canvas").css({
                "height": "250px",
                "width": "250px"
            });
            $("#map-panel").css({
                "height": "310px",
                "width": "250px"
            });
            $("#map").css({
                "height": "250px",
                "width": "100%"
            });
            //changes the image on the button
            $("#resize-icon").removeClass("glyphicon glyphicon-resize-small");
            $("#resize-icon").addClass("glyphicon glyphicon-resize-full");
            zoomer = 13;
        }
        $("#total-distance").html(" " + Math.round(flightDistance) + "m");
        $("#next-distance").html(" " + Math.round(nextDistance) + "m");
        initialize();
    });
    $("#wayremove-button").on("click", function() {
        //removes all waypoints and coresponding variables when button is pressed
        point = null,
                flightDistance = null,
                nextDistance = null;
        points = [];
        flightPlan = [];
        flightPath.setPath(flightPlan);
        $("#total-distance").html(" " + Math.round(flightDistance) + "m");
        $("#next-distance").html(" " + Math.round(nextDistance) + "m");
        initialize();
    });
    $("#shortpath-button").on("click", function() {
        //when button is pressed, add the current quad position to finalFlight(array with optimized flight path)
        var flight = flightPlan.slice();
        var fLength = flightPlan.length;
        finalFlight = [myLatlng];
        var firstDist = [];
        var shortPoint;
        //for loop going through each of the different points in 'flight' (copy of flightPlan)
        for (var i = 0; i < fLength - 1; i++) {
            //for each of the points, calculate the distance between it and each of the other points left in 'flight'
            allDist.length = 0;
            firstDist.length = 0;
            firstDistCalc = function() {
                shortPoint = flight[0];
                firstDist = [shortPoint];
                flight.shift();
                //find length from the given point to each of the others
                for (var i = 0; i < flight.length; i++) {
                    firstDist.push(flight[i]);
                    var dist = google.maps.geometry.spherical.computeLength(firstDist);
                    allDist.push(dist);
                    firstDist.pop();
                }
                firstDist.length = 0;
            };
            firstDistCalc();
            //find the point with the shortest distance from the given point, and push into finalFlight
            var shortest = Math.min.apply(Math, allDist);
            var index = allDist.indexOf(shortest);
            shortPoint = flight.splice(index, 1);
            flight.unshift(shortPoint[0]);
            finalFlight.push(shortPoint[0]);
        }
        //once all the different distances have been calculated, the new flight path is finished
        //All arrays are updated and the new flightpath is set once the map is re-initialized
        flightPlan = finalFlight;
        flightDistance = google.maps.geometry.spherical.computeLength(flightPlan);
        nextDistance = google.maps.geometry.spherical.computeLength(flightPlan.slice(0, 2));
        $("#total-distance").html(" " + Math.round(flightDistance) + "m");
        $("#next-distance").html(" " + Math.round(nextDistance) + "m");
        points = flightPlan.slice(1);
        initialize();
    });
});
google.maps.event.addDomListener(window, 'load', initialize);