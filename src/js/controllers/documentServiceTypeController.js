(function () {
    angular.module('axpress')
    .controller('ServiceTypeController', ServiceTypeController);

    ServiceTypeController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup', 'NgMap'];

    function ServiceTypeController ($rootScope, $scope, $cordovaDialogs, $state, $ionicPopup) {
        initialize();

        function initialize () {
            $scope.choice = {};
            $scope.doc = $state.current.data.doc;
            $scope.menu.forEach(function(option){
                if(option.type_service == $state.params.serviceType){
                    $scope.bagservice = option.bag_services;
                }
            });
        }

        $scope.confirmServiceType = function(){
            $scope.doc.typeServices = $state.params.serviceType;
            $scope.doc.bagId = $scope.choice.id;
            $state.go("document.caracteristics");
        };
    }
})();
