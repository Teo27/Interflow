//Used to remember markers
var markerStore = {};
var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 56.2639, lng: 9.5018},
        zoom: 13
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        })
    }


}

function searchMarker() {

    var markerNum = $("input#searchId").val();
    if(!$.isNumeric(markerNum)){
        alert("Please enter a valid number.");
    }
    if(markerStore.hasOwnProperty(markerNum)){
        google.maps.event.trigger(markerStore[markerNum], 'click');
    }else{
        alert("There is no such marker on the map.");
    }


}

$(document).ready(function() {
    GetMarkers();
    var Interval = 5000;
    var selectedMarker;
    setInterval(GetMarkers, Interval);
    function GetMarkers() {
        $.ajax({
            type: 'GET',
            url: '../Backend/getResults.php',
            success: function (data) {
                UpdateMarkers(data);
            }
        })
    }

    function UpdateMarkers(markerArray) {

        $.each(JSON.parse(markerArray), function (key, data) {
            //Do we have this marker already?

            if(markerStore.hasOwnProperty(data.DeviceID)) {
                markerStore[data.DeviceID].setPosition(new google.maps.LatLng(data.Latitude,data.Longitude));
                if(selectedMarker && data.DeviceID == selectedMarker.id){
                    selectedMarker.infowindow.close();

                    selectedMarker.info = '<div>' + '<b>Device: </b>' + data.DeviceID +
                        '<br><b>Humidity: </b>' + data.Humidity +
                        '<br><b>Temperature: </b>' + data.Temperature +
                        '<br><b>Barometric Pressure: </b>' + data.Barometric_Pressure +
                        '<br><b>RSSI: </b>' + data.RSSI +
                        '<br><b>dbm: </b>' + data.dbm +
                        '<br><b>Battery: </b>' + data.Battery +
                        '<br><b>Time Stamp: </b>' + data.Time_Stamp +
                        '</div>';

                    selectedMarker.infowindow.setContent(selectedMarker.info);
                    selectedMarker.infowindow.open(map, selectedMarker);
                }

            }
            else {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.Latitude,data.Longitude),
                    title: 'Device: ' + data.DeviceID,
                    map:map
                });

                marker.infowindow = new google.maps.InfoWindow();
                marker.id = data.DeviceID;


                marker.info = '<div>' + '<b>Device: </b>' + data.DeviceID +
                    '<br><b>Humidity: </b>' + data.Humidity +
                    '<br><b>Temperature: </b>' + data.Temperature +
                    '<br><b>Barometric Pressure: </b>' + data.Barometric_Pressure +
                    '<br><b>RSSI: </b>' + data.RSSI +
                    '<br><b>dbm: </b>' + data.dbm +
                    '<br><b>Battery: </b>' + data.Battery +
                    '<br><b>Time Stamp: </b>' + data.Time_Stamp +
                    '</div>';

                marker.addListener('click', function() {
                    map.setZoom(16);
                    map.setCenter(marker.getPosition());
                    if (selectedMarker) {
                        selectedMarker.setIcon(null);
                        selectedMarker.infowindow.close();
                    }
                    //List of Icons: http://stackoverflow.com/questions/17746740/google-map-icons-with-visualrefresh
                    marker.setIcon('https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2');
                    selectedMarker = marker;


                    marker.infowindow.setContent(marker.info);
                    marker.infowindow.open(map, marker);

                });

                markerStore[data.DeviceID] = marker;
            }
        })
    }

    function UpdateInfoWindow(marker, data) {
        //TODO: Sum up both info windows here later
    }


});