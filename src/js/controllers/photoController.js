(function() {
    angular.module('axpress')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['$rootScope', '$scope', '$state', 'Logger', 'Util'];

    function PhotoController($rootScope, $scope, $state, Logger, Util) {
        var preBase64 = "data:image/jpeg;base64,";
        activate();

        $scope.photoTaken = function(imageData) {
            $scope.data.picture = preBase64 + imageData;
            $state.reload();
        };

        $scope.photoSelected = function(imageData) {
            $scope.data.picture = preBase64 + imageData;
            $state.reload();
        };

        $scope.confirmImagePhoto = function() {
            if (!hasCompletedFeatures()) return;
            $state.go($scope.extraData.photoNext);
        };

        function hasCompletedFeatures() {
            if (!$scope.data.amountDeclared || !$scope.data.descriptionText) {
                Logger.toast("Debe declarar un valor y añadir una descripción");
                return false;
            }
            return true;
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
