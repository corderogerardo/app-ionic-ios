(function () {
    angular.module('axpress')
    .controller('MapsOriginController', MapsOriginController);

    MapsOriginController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup'];

    function MapsOriginController ($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup){

        initialize();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.confirmOrigin = function(){
            $rootScope.originAddress = $scope.place.formatted_address;
            $rootScope.originLocation= $scope.place.geometry.location;
            $state.go("mapsdestiny");
        };

        function initialize () {
            $scope.markers = [{
                title: 'Origen'
            }];
        }
    }

})();
