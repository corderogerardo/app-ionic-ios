(function () {
    angular.module('axpress')
    .controller('MapsOriginController', MapsOriginController);

    MapsOriginController.$inject = ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap'];

    function MapsOriginController ($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ,NgMap){

        initialize();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.map.setCenter($scope.place.geometry.location);
        };

        $scope.confirmOrigin = function(){
            $rootScope.originAddress = $scope.place.formatted_address;
            $rootScope.originLocation= $scope.place.geometry.location;
            $state.go("mapsdestiny");
        };

        function initialize () {
            $scope.mapsTitle = 'test';
            NgMap.getMap().then(function (map) {
                $scope.map = map;
            });
        }


    }

})();
