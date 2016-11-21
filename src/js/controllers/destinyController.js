(function() {
    angular.module('axpress')
        .controller('DestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$state', '$cordovaGeolocation', 'NgMap',
        '$timeout', 'GoogleMapGeocoder'];

    function DocumentDestinyController($rootScope, $scope, $state, $cordovaGeolocation, NgMap,
                                       $timeout, GoogleMapGeocoder) {
        activate();

        $scope.placeChanged = function(place) {
            $scope.place = (typeof place == "object" ? place : this.getPlace());
            $timeout(function() {
                $scope.markers[$scope.markers.length-1].position = $scope.place.geometry.location;
            }, 0);
            if ( typeof place == "object" )
                $scope.tempData.address = $scope.place.formatted_address;
            $scope.focused = true;
        };

        $scope.pickHere = function() {
            $scope.buttonState = true;
            $scope.markers[$scope.markers.length-1].icon = "{url: 'img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
        };

        $scope.addNewDirection = function() {
            $scope.markers.push({
                title   : "Another destiny",
                position: [$scope.place.geometry.location.lat(), $scope.place.geometry.location.lng()],
                icon    : "{url: 'img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
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

        $scope.mapCallbacks = {
            mapTapped: mapTap,
            markerDragend: markerDraged
        };

        function geocoderCallback(results) {
            $scope.placeChanged(results[0]);
            setMapCenter(results[0].geometry.location);
        }

        function markerDraged(marker) {
            var latlng = {lat: marker.latLng.lat(), lng: marker.latLng.lng()};
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function setMapCenter(position) {
            $scope.map.center = position;
        }

        function mapTap(event) {
            var latlng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function setExistingAddress() {
            var latlng = { lat: $scope.data.destinyLatitude, lng: $scope.data.destinyLongitude };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function initialUIStates() {
            $scope.focused = false;
            $scope.focused2 = false;
            $scope.buttonState = false;
            $scope.focusedphonedestinatary = false;
            $scope.focusednamedestinatary = false;
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.markers = [{
                title   : 'Origen',
                icon    : "{url: 'img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}",
                position: [$scope.data.originLatitude, $scope.data.originLongitude]
            }];
            $scope.tempData = {};
            $scope.address = "";
            initialUIStates();
            if ( $scope.data.editStopIndex != undefined ) {
                var index = $scope.data.editStopIndex;
                $scope.tempData.phone = $scope.data.destiniesData[index].phone;
                $scope.tempData.address = $scope.data.destiniesData[index].address;
                $scope.tempData.name = $scope.data.destiniesData[index].name;

                $scope.data.destiniesData.forEach(function(destiny) {
                    $scope.markers.push({
                        title   : 'Destino',
                        icon    : "{url: 'img/inputs/pin-mapa2.png', scaledSize: [48,48]}",
                        position: [destiny.longitude, destiny.latitude]
                    })
                });
            } else {
                $scope.data.destiniesData = [];
                $scope.markers.push({
                    title: 'Destino',
                    icon : "{url: 'img/inputs/pin-mapa2.png', scaledSize: [48,48]}"
                });
            }
            NgMap.getMap().then(function(map) {
                $scope.map = map;
            });
            if ($scope.data.destinyLatitude && $scope.data.destinyLongitude)
                setExistingAddress();
        }

        /**
         * For GPS Geolocation ngcordova geolocation
         */
        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        $scope.gpsHere = function() {
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $scope.gps.lat = position.coords.latitude;
                    $scope.gps.lng = position.coords.longitude;
                }, function(err) {
                    // error
                });
        };

        function getStopElement(data) {
            return {
                phone    : data.phone,
                longitude: $scope.place.geometry.location.lng(),
                latitude : $scope.place.geometry.location.lat(),
                address  : $scope.place.formatted_address,
                name     : data.name
            }
        }

        function resetTempData() {
            $scope.tempData = {
                address: '',
                phone: '',
                name: ''
            };
        }
    }

})();
