(function () {
    angular.module('axpress')
    .controller('ServiceTypeController', ServiceTypeController);

    ServiceTypeController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup', 'NgMap'];

    function ServiceTypeController ($rootScope, $scope, $cordovaDialogs, $state, $ionicPopup) {
        initialize();

        $scope.confirmServiceType = function(){
            $scope.doc.typeServices = $state.params.serviceType;
            $scope.doc.bagId = $scope.choice.bag.shipping_bag_id;
            $scope.extraData.bag = $scope.choice.bag;
            $state.go("document.features");
        };

        function initialize () {
            $scope.choice = {};
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
            $scope.menu.forEach(function(option){
                if(option.type_service == $state.params.serviceType){
                    $scope.bagservice = option.bag_services;
                }
            });
        }
    }
})();
