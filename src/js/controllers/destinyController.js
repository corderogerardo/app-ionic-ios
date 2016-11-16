(function() {
    angular.module('axpress')
        .controller('DestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$state', '$cordovaGeolocation'];

    function DocumentDestinyController($rootScope, $scope, $state, $cordovaGeolocation) {
        activate();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[1].position = $scope.place.geometry.location;
        };

        $scope.pickHere = function() {
            $scope.buttonState = true;
            $scope.markers[1].icon = "{url: 'img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
        };

        $scope.addNewDirection = function() {
            $scope.markers.push({
                title: "Another destiny",
                position: [$scope.place.geometry.location.lat(), $scope.place.geometry.location.lng()],
                icon: "{url: 'img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
            });

            $scope.data.destiniesData.push({
                phone: $scope.data.cellphoneDestinyClient,
                longitude: $scope.place.geometry.location.lng(),
                latitude: $scope.place.geometry.location.lat(),
                address: $scope.place.formatted_address,
                name: $scope.data.destinyName
            });
            $scope.data.destinyDetail = '';
            $scope.address = "\n";
        };

        $scope.confirmDestiny = function() {
            if ($state.params.serviceType == 45) {
                if ($scope.data.arrayPositionDestiny >= 0) {
                    console.log("Estoy en editar");
                    console.log("Data " + $scope.data.arrayPositionDestiny);
                    console.log("DataDestinies " + $scope.data.destiniesData);
                    $scope.data.destiniesData[$scope.data.arrayPositionDestiny].phone = $scope.data.cellphoneDestinyClient;
                    $scope.data.destiniesData[$scope.data.arrayPositionDestiny].longitude = $scope.place.geometry.location.lng();
                    $scope.data.destiniesData[$scope.data.arrayPositionDestiny].latitude = $scope.place.geometry.location.lat();
                    $scope.data.destiniesData[$scope.data.arrayPositionDestiny].address = $scope.place.formatted_address;
                    $scope.data.destiniesData[$scope.data.arrayPositionDestiny].name = $scope.data.destinyName;
                    $scope.address = "\n";
                } else {
                    console.log("Estoy en agregar");
                    $scope.data.destiniesData.push({
                        phone: $scope.data.cellphoneDestinyClient,
                        longitude: $scope.place.geometry.location.lng(),
                        latitude: $scope.place.geometry.location.lat(),
                        address: $scope.place.formatted_address,
                        name: $scope.data.destinyName
                    });
                    $scope.address = "\n";
                }
                $scope.buttonState = false;
            } else {
                $scope.data.destinyAddress = $scope.place.formatted_address;
                $scope.data.destinyLatitude = $scope.place.geometry.location.lat();
                $scope.data.destinyLongitude = $scope.place.geometry.location.lng();
                $scope.data.destinyPlace = $scope.place;
                $scope.address = "\n";
                $scope.buttonState = false;
            }
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.destinyNext);
            }
        };

        function setExistingAddress() {
            $scope.markers[1].position = "" + $scope.data.destinyLatitude + "," + $scope.data.destinyLongitude;
            $scope.address = $scope.data.destinyAddress;
            $scope.place = $state.current.data.data.destinyPlace;
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
            initialUIStates();
            if ($scope.data.arrayPositionDestiny >= 0) {
                $scope.address = $scope.data.destiniesData[$scope.data.arrayPositionDestiny].address;
                $scope.data.cellphoneDestinyClient = $scope.data.destiniesData[$scope.data.arrayPositionDestiny].phone;
                $scope.data.destinyName = $scope.data.destiniesData[$scope.data.arrayPositionDestiny].name;
                $scope.markers = [{
                    title: 'Origen',
                    icon: "{url: 'img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}",
                    position: [$scope.data.originLatitude, $scope.data.originLongitude]
                }];
                $scope.data.destiniesData.forEach(function(destiny) {
                    $scope.markers.push({
                        title: 'Destino',
                        icon: "{url: 'img/inputs/pin-mapa2.png', scaledSize: [48,48]}",
                        position: [destiny.longitude, destiny.latitude]
                    })
                })
            } else {
                $scope.address = "";
                $scope.data.destiniesData = [];
                $scope.markers = [{
                    title: 'Origen',
                    icon: "{url: 'img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}",
                    position: [$scope.data.originLatitude, $scope.data.originLongitude]
                }, {
                    title: 'Destino',
                    icon: "{url: 'img/inputs/pin-mapa2.png', scaledSize: [48,48]}"
                }];
            }
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
    }

})();
