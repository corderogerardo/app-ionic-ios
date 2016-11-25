(function() {
    angular.module('axpress')
        .controller('ShipmentTrackingController', ShipmentTrackingController);

    ShipmentTrackingController.$inject = ['$rootScope', '$scope', '$state', 'NgMap'];

    function ShipmentTrackingController($rootScope, $scope, $state, NgMap) {

        $scope.originAdd = $rootScope.originLocation.toString().replace("(", "").replace(")", "");
        $scope.destinyAdd = $rootScope.originDestinyLocation.toString().replace("(", "").replace(")", "");

        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });

        $scope.goToChat = function() {
            $state.go("chat");
        };

        $scope.goToCall = function() {
            console.log("Call phone number...");
        };
    }
})();
