(function () {
    angular.module('axpress')
    .controller('FeaturesController', FeaturesController);

    FeaturesController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state','$ionicPopup'];

    function FeaturesController ($rootScope, $scope, $cordovaDialogs, $state, $ionicPopup) {
        initialize();

        $scope.saveCaracteristics = function () {
            $state.go($scope.extraData.featuresNext);
        };

        function initialize () {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;

        }
    }
})();
