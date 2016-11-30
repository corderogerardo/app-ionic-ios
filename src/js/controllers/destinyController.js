(function() {
    angular.module('axpress')
        .controller('DestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$state', 'Location', 'NgMap',
        '$timeout', 'GoogleMapGeocoder'];

    function DocumentDestinyController($rootScope, $scope, $state, Location, NgMap,
                                       $timeout, GoogleMapGeocoder) {
        activate();

        $scope.placeChanged = function(place) {
            $scope.place = (typeof place == "object" ? place : this.getPlace());
            $timeout(function() {
                // If editing a previously added stop, edit that index plus one (because of the origin),
                // If adding a destiny/stop, edit last
                var index = ($scope.data.editStopIndex >= 0 ? ($scope.data.editStopIndex + 1) : ($scope.markers.length - 1));
                $scope.markers[index].position = $scope.place.geometry.location;
            }, 0);
            if ( typeof place == "object" )
                $scope.tempData.address = $scope.place.formatted_address;
            $scope.focused = true;
        };

        $scope.pickHere = function() {
            $scope.buttonState = true;
            var marker = $scope.markers[$scope.markers.length - 1];
            marker.icon = "{url: 'img/Pindestino/Pindetsinomdpi.png', scaledSize: [28,38]}";
            marker.draggable = false;
        };

        $scope.addNewAddress = function() {
            var lastMarker = $scope.markers[$scope.markers.length - 1];
            lastMarker.draggable = false;
            lastMarker.icon = "{url: 'img/Pindestino/Pindetsinomdpi.png', scaledSize: [28,38]}";
            $scope.markers.push({
                icon: "{url: 'img/Pindestino/Pindetsinomdpi.png', scaledSize: [28,38]}"
            });
            $scope.data.destiniesData.push(getStopElement($scope.tempData));
            resetTempData();
        };

        $scope.confirmDestiny = function() {
            if ( $state.params.serviceType == 45 ) {
                if ( $scope.data.editStopIndex >= 0 ) {
                    //Editing a previous added stop
                    var index = $scope.data.editStopIndex;
                    $scope.data.destiniesData[index] = getStopElement($scope.tempData);
                    delete $scope.data.editStopIndex;
                } else {
                    //Adding a new stop
                    $scope.data.destiniesData.push(getStopElement($scope.tempData));
                }
            } else {
                $scope.data.destinyAddress = $scope.place.formatted_address;
                $scope.data.destinyLatitude = $scope.place.geometry.location.lat();
                $scope.data.destinyLongitude = $scope.place.geometry.location.lng();
                $scope.data.destinyPlace = $scope.place;
            }
            resetTempData();
            $scope.buttonState = false;
            if ( $scope.extraData.navigateTo ) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.destinyNext);
            }
        };

        /**
         * For GPS Geolocation
         **/
        $scope.gpsHere = function() {
            Location.getCurrentPosition()
                .then(function(pos) {
                    GoogleMapGeocoder.reverseGeocode(pos)
                        .then(geocoderCallback);
                })
        };

        $scope.mapCallbacks = {
            mapTapped    : mapTap,
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
            var latlng = { lat: $scope.data.destinyLatitude, lng: $scope.data.destinyLongitude };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function getStopElement(data) {
            return {
                phone    : data.phone,
                longitude: $scope.place.geometry.location.lng(),
                latitude : $scope.place.geometry.location.lat(),
                address  : $scope.place.formatted_address,
                name     : data.name
            };
        }

        function resetTempData() {
            $scope.tempData = {
                address: '',
                phone  : '',
                name   : ''
            };
        }


        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.markers = [{
                icon    : "{url: 'img/PinOrigen/Origenmdpi.png', scaledSize: [28,38]}",
                position: [$scope.data.originLatitude, $scope.data.originLongitude]
            }];
            $scope.tempData = {};
            $scope.address = "";
            NgMap.getMap().then(function(map) {
                $scope.map = map;
            });
            if ( Array.isArray($scope.data.destiniesData) && $scope.data.destiniesData.length > 0 ) {
                var index = $scope.data.editStopIndex;
                $scope.data.destiniesData.forEach(function(destiny, destIndex) {
                    $scope.markers.push({
                        icon     : (destIndex == index ? "{url: 'img/Pindestino/Pindetsinomdpi.png', scaledSize: [28,38]}" : "{url: 'img/Pindestino/Pindetsinomdpi.png', scaledSize: [28,38]}"),
                        position : [destiny.latitude, destiny.longitude],
                        draggable: (destIndex == index)
                    });
                });
                if ( typeof index != "undefined" ) {
                    var destiny = $scope.data.destiniesData[index];
                    $scope.tempData.phone = destiny.phone;
                    $scope.tempData.address = destiny.address;
                    $scope.tempData.name = destiny.name;
                    GoogleMapGeocoder.reverseGeocode({ lat: destiny.latitude, lng: destiny.longitude })
                        .then(geocoderCallback);
                }
            } else {
                $scope.data.destiniesData = [];
                $scope.markers.push({
                    icon     : "{url: 'img/Pindestino/Pindetsinomdpi.png', scaledSize: [28,38]}",
                    draggable: true
                });
            }

            if ( $scope.data.destinyLatitude && $scope.data.destinyLongitude )
                setExistingAddress();
        }
    }

})();
