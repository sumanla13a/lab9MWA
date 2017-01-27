    'use strict';

    function initMap() {
        var uluru = {lat: 41.01548, lng: -91.967092};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var markers = [];
        markers.push(new google.maps.Marker({
          position: uluru,
          map: map
        }));

        function clearMarkers() {
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
            }
        }
        function save(data) {
            var save = window.confirm('Do you want to save this location?');
            if(save) {
                window.$.ajax({
                    type: 'POST',
                    url: '/locations/',
                    data: data,
                    success: function() {
                        var marker = new google.maps.Marker({
                          position: {lat: data.lat, lng: data.lng},
                          map: map
                        });
                        markers.push(marker);
                    }
                });
            }
        }

        function find(data) {
            var find = window.confirm('Do you want to find nearest of this location?');
            if(find) {
                clearMarkers();
                window.$.ajax({
                    type: 'GET',
                    url: '/locations/near',
                    data: data,
                    success: function(data) {
                        data.data.map((e) => e.location.coordinates).forEach((e) => {
                            markers.push(new google.maps.Marker({
                              position: {lat: e[1], lng: e[0]},
                              map: map
                            }));   
                        });
                    }
                });
            }
        }

        window.google.maps.event.addListener(map, 'click', function(event) {
            var action = window.$('input[name="map"]:checked').val();
            if(action.toLowerCase() === 'save') {
                save({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                });
            } else {
                find({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                });
            }
        });

        window.onload = function() {
            document.getElementById('nearMe').onclick = function() {
                function success(position) {
                    find({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: document.getElementById('name').value
                    });
                }
                function fail(err) {
                    console.log(err);
                }
                navigator.geolocation.getCurrentPosition(success, fail);
            };
        };

    }
