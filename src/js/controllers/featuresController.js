(function() {
    angular.module('axpress')
        .controller('FeaturesController', FeaturesController);

    FeaturesController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state'];

    function FeaturesController($rootScope, $scope, $cordovaDialogs, $state) {
        activate();

        $scope.confirmServiceType = function() {
            $scope.data.typeServices = $state.params.serviceType;
            $scope.data.bagId = $scope.choice.bag;
            $scope.extraData.bagId = $scope.choice.bag;
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.featuresNext);
            }
        };
        $scope.confirmPackage = function() {

            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.packageNext);
            }
        };

        function setExistingChoice () {
            $scope.choice = {
                bag: $scope.extraData.bagId
            };
        }

        function activate() {
            $scope.choice = {};
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.menu.forEach(function(option) {
                if (option.service_provider_id == $state.params.serviceType) {
                    $scope.bagservice = option.bag_services;
                    return;
                }
            });
            if ($scope.extraData.bagId) {
                setExistingChoice();
            }
        }
    }
})();
