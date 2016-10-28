/**
 * Created by gerardo on 21/10/16.
 */
(function () {
    angular.module('axpress')
    .controller('PhotoController', PhotoController);

        PhotoController.$inject = ['$rootScope','$scope', '$cordovaDialogs','$cordovaCamera', '$state','$ionicPopup'];

        function PhotoController ($rootScope,$scope,$cordovaDialogs,$cordovaCamera, $state,$ionicPopup) {
            initialize();

            $scope.photoTaken = function (imageData) {
                $scope.imageData = "data:image/jpeg;base64, " + imageData;
            };

            $scope.photoSelected = function (imageData) {
                $scope.imageData = "data:image/jpeg;base64, " + imageData;
            }

            $scope.confirmImagePhoto = function () {
                $state.go($scope.extraData.photoNext);
            }

            function initialize () {
                $scope.extraData = $state.current.data.extraData;
            }
        }
})();
