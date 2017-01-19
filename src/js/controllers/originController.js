(function() {
    angular.module('axpress')
        .controller('OriginController', OriginController);

    OriginController.$inject = ['$rootScope', '$scope', '$state', 'Location', 'NgMap',
        '$timeout', 'GoogleMapGeocoder', 'Logger', 'Util'
    ];

    function OriginController($rootScope, $scope, $state, Location, NgMap,
        $timeout, GoogleMapGeocoder, Logger, Util) {
        activate();

        $scope.placeChanged = function(place) {
            $scope.place = (typeof place == "object" ? place : this.getPlace());
            $timeout(function() {
                $scope.markers[0].position = $scope.place.geometry.location;
            }, 0);
            if (typeof place == "object")
                $scope.address = GoogleMapGeocoder.removeStateAndCountry($scope.place.formatted_address);
        };

        $scope.pickHere = function() {
            $scope.markers[0].icon = "{url: 'img/PinOrigen/Origen3x.png.png', scaledSize: [28,38]}";
        };

        $scope.confirmOrigin = function() {
            //If cant continue
            if (!canContinue()) return;

            $scope.data.originAddress = GoogleMapGeocoder.removeStateAndCountry($scope.place.formatted_address);
            $scope.data.originLatitude = $scope.place.geometry.location.lat();
            $scope.data.originLongitude = $scope.place.geometry.location.lng();
            $scope.data.originPlace = $scope.place;
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.originNext);
            }
        };

        function canContinue() {
            if (!$scope.place) {
                Logger.toast("Debe añadir una dirección válida");
                return false;
            }

            return true;
        }

        /**
         * For GPS Geolocation
         **/
        $scope.gpsHere = function() {
            Location.getCurrentPosition()
                .then(function(pos) {
                    GoogleMapGeocoder.reverseGeocode(pos)
                        .then(geocoderCallback);
                });
        };

        $scope.mapCallbacks = {
            mapTapped: mapTap,
            markerDragend: markerDraged
        };

        function geocoderCallback(results) {
            $scope.placeChanged(results[0]);
            setMapCenter(results[0].geometry.location);
        }

        function markerDraged(marker) {
            var latlng = { lat: marker.latLng.lat(), lng: marker.latLng.lng() };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function setMapCenter(position) {
            $scope.map.setCenter(position);
        }

        function mapTap(event) {
            var latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function setExistingAddress() {
            var latlng = { lat: $scope.data.originLatitude, lng: $scope.data.originLongitude };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.markers = [{
                title: 'Origen',
                icon: "{url: 'img/PinOrigen/Origen3x.png.png', scaledSize: [28,38]}",
                draggable: true
            }];
            NgMap.getMap().then(function(map) {
                $scope.map = map;
                if ($scope.data.originAddress)
                    setExistingAddress();
                //google.maps.event.trigger(map, 'resize');
            });
        }
    }
})();
