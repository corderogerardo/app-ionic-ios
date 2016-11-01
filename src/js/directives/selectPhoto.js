/**
 * @desc helps select an image from the gallery using cordova libraries
 * @example <select-photo onPhotoSelected="function" onError="function"></select-photo>
 */
(function () {
    angular.module('axpress')
    .directive('selectPhoto', selectPhoto);

    function selectPhoto () {
        return {
            restric: 'E',
            scope: {
                options: '@',
                successCallback: '=onPhotoSelected',
                errorCallback: '=onError'
            },
            controller: selectPhotoController,
            templateUrl: 'templates/directives/selectPhoto.html'
        };
    }

    selectPhotoController.$inject = ['$scope', '$cordovaImagePicker'];

    function selectPhotoController ($scope, $cordovaImagePicker) {
        activate();

        function activate () {
            $scope.options = {};
            document.addEventListener("deviceready", function () {
                var tempOptions = {
                    maximumImagesCount: 1,   // Max number of selected images
                    width:              800,
                    height:             800,
                    quality:            100  // Higher is better
                };
                //Sets custom options over the default ones
                $scope.options = Object.assign(tempOptions, $scope.options);
            }, false);
        }

        $scope.selectPhoto = function () {
            $cordovaImagePicker.getPictures($scope.options)
                .then(function (results) {
                    $scope.successCallback(results);
                }, function (err) {
                    $scope.errorCallback(err);
                });
        };
    }

})();