(function () {
    angular.module('axpress')
    .controller('FeaturesController', FeaturesController);

    FeaturesController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state'];

    function FeaturesController ($rootScope, $scope, $cordovaDialogs, $state) {
        initialize();

        $scope.saveCaracteristics = function () {
            if($scope.extraData.editDestinatary === true){
                $scope.extraData.editDestinatary = false;
                $state.go("document.resume");

            }else{
                $state.go($scope.extraData.featuresNext);
            }
        };

        function initialize () {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;

        }
    }
})();
