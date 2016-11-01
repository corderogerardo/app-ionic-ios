(function () {
    angular.module('axpress')
    .controller('ServiceTypeController', ServiceTypeController);

    ServiceTypeController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state'];

    function ServiceTypeController ($rootScope, $scope, $cordovaDialogs, $state) {
        initialize();

        $scope.confirmServiceType = function(){
            $scope.doc.typeServices = $state.params.serviceType;
            $scope.doc.bagId = $scope.choice.bag.shipping_bag_id;
            $scope.extraData.bag = $scope.choice.bag;
            if($scope.extraData.editFeatures === true){
                $scope.extraData.editFeatures = false;
                $state.go("document.resume");

            }else{
                $state.go("document.features");
            }
        };

        function initialize () {
            $scope.choice = {};
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
            $scope.menu.forEach(function (option) {
                if(option.service_provider_id == $state.params.serviceType){
                    $scope.bagservice = option.bag_services;
                    return;
                }
            });
        }
    }
})();
