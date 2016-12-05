(function() {
    angular.module('axpress')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['$rootScope', '$scope', '$state', 'Logger'];

    function PhotoController($rootScope, $scope, $state, Logger) {
        activate();

        $scope.photoTaken = function(imageData) {
            $scope.imageData = "data:image/jpeg;base64," + imageData;
        };

        $scope.photoSelected = function(results) {
            window.plugins.Base64.encodeFile(results[0], function(base64){
                $scope.imageData = base64;
            });
        };

        $scope.confirmImagePhoto = function() {
            if (!hasCompletedFeatures()) return;
            
            //We replace the meta data used to display the image
            $scope.data.picture = $scope.imageData
                .replace("data:image/jpeg;base64,", "")
                .replace("data:image/*;charset=utf-8;base64,","");
            $state.go($scope.extraData.photoNext);
        };

        function hasCompletedFeatures () {
            if (!$scope.data.amountDeclared || !$scope.data.descriptionText) {
                Logger.toast("Debe declarar un valor y añadir una descripción");
                return false;
            }
            return true;
        }

        function activate() {
            $scope.imageData = "";
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
