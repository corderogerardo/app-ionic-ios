angular.module('axpress')
    .controller('ShipmentTrackingController',  ['$rootScope','$scope', '$cordovaDialogs', '$state', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state ,NgMap){
        $scope.originAdd =  $rootScope.originLocation.toString().replace("(","").replace(")","");
        $scope.destinyAdd =  $rootScope.originDestinyLocation.toString().replace("(","").replace(")","");

        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });

        $scope.goToChat = function(){
            $state.go("chat");
        }
        $scope.goToCall = function(){
            console.log("Call phone number...");
        }
    }]);
