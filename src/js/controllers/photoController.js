(function() {
    angular.module('axpress')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['$rootScope', '$scope', '$state'];

    function PhotoController($rootScope, $scope, $state) {
        activate();

        $scope.photoTaken = function(imageData) {
            $scope.imageData = "data:image/jpeg;base64, " + imageData;
        };

        $scope.photoSelected = function(results) {
            $scope.imageData = results[0];
        };

        $scope.confirmImagePhoto = function() {
            $state.go($scope.extraData.photoNext);
        };

        function activate() {
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
