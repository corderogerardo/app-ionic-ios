(function() {
    angular.module('axpress')
        .controller('OriginController', DocumentOriginController);

    DocumentOriginController.$inject = ['$rootScope', '$scope', '$state', '$cordovaGeolocation'];

    function DocumentOriginController($rootScope, $scope, $state, $cordovaGeolocation) {
        activate();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.buttonState = false;

        $scope.pickHere = function() {
            $scope.buttonState = true;
            $scope.markers[0].icon = "{url: 'img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}"
        };

        $scope.confirmOrigin = function() {
            $scope.data.originAddress = $scope.place.formatted_address;
            $scope.data.originLatitude = $scope.place.geometry.location.lat();
            $scope.data.originLongitude = $scope.place.geometry.location.lng();
            $scope.extraData.originPlace = $scope.place;
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.originNext);
            }
        };

        function setExistingAddress() {
            $scope.markers[0].position = "" + $scope.data.originLatitude + "," + $scope.data.originLongitude;
            $scope.address = $scope.data.originAddress;
            $scope.place = $state.current.data.extraData.originPlace;
        }

        function activate() {
            $scope.focused = false;
            $scope.focused2 = false;
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.customIconOrigin = {

            };
            $scope.markers = [{
                title: 'Origen',
                icon: "{url: 'img/inputs/pin-mapa1.png', scaledSize: [48,48]}"
            }];
            if ($scope.extraData.originPlace)
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
    }
})();
