(function() {
    angular.module('axpress')
        .controller('DestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup','$cordovaGeolocation'];

    function DocumentDestinyController($rootScope, $scope, $cordovaDialogs, $state, $ionicPopup,$cordovaGeolocation) {
        activate();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[1].position = $scope.place.geometry.location;
        };
        $scope.buttonState = false;
        $scope.pickHere = function(){
            $scope.buttonState = true;
            $scope.markers[1].icon="{url: '../../img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
        };
        $scope.addNewDirection = function(){
            $scope.markers.push({
                title:"Another destiny",
                position: [$scope.place.geometry.location.lat(),$scope.place.geometry.location.lng()],
                icon: "{url: '../../img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
            });

            $scope.data.destiniesData.push({
                phone:$scope.data.cellphoneDestinyClient,
                longitude:$scope.place.geometry.location.lng(),
                latitude:$scope.place.geometry.location.lat(),
                address:$scope.place.formatted_address,
                name:$scope.data.destinyName
            });
            $scope.data.destinyDetail = '';
            $scope.address = "\n";
            $scope.data.cellphoneDestinyClient="";
            $scope.data.destinyName ="";
        };

        $scope.confirmDestiny = function() {
            if ($state.params.serviceType == 45) {
                $scope.data.destiniesData.push({
                    phone:$scope.data.cellphoneDestinyClient,
                    longitude:$scope.place.geometry.location.lng(),
                    latitude:$scope.place.geometry.location.lat(),
                    address:$scope.place.formatted_address,
                    name:$scope.data.destinyName
                });
            } else {
                $scope.data.destinyAddress = $scope.place.formatted_address;
                $scope.data.destinyLatitude = $scope.place.geometry.location.lat();
                $scope.data.destinyLongitude = $scope.place.geometry.location.lng();
                $scope.extraData.destinyPlace = $scope.place;
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
            $scope.place = $state.current.data.extraData.destinyPlace;
        }

        function activate() {
            $scope.focused=false;
            $scope.focused2=false;
            $scope.focusedphonedestinatary=false;
            $scope.focusednamedestinatary=false;
            $scope.address="";
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.data.destiniesData = [];
            $scope.data.destinyDetail = '';
            $scope.markers = [{
                title: 'Origen',
                icon:"{url: '../../img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}",
                position: [$scope.data.originLatitude, $scope.data.originLongitude]
            }, {
                title: 'Destino',
                icon:"{url: '../../img/inputs/pin-mapa2.png', scaledSize: [48,48]}"
            }];

            if ($scope.data.destinyLatitude && $scope.data.destinyLongitude)
                setExistingAddress();
        }
        /**
         * For GPS Geolocation ngcordova geolocation
         */
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $scope.gpsHere = function(){
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.gps.lat = position.coords.latitude;
                    $scope.gps.lng = position.coords.longitude;
                }, function(err) {
                    // error
                });
        };
        //another way
        /*$scope.watchOptions = {
         timeout : 3000,
         enableHighAccuracy: false // may cause errors if true
         };

         $scope.watch = $cordovaGeolocation.watchPosition(watchOptions);
         $scope.watch.then(
         null,
         function(err) {
         // error
         },
         function(position) {
         var lat  = position.coords.latitude
         var long = position.coords.longitude
         });


         $scope.watch.clearWatch();*/
    }

})();
