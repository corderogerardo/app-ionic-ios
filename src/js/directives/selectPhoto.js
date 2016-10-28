(function () {
    angular.module('axpress')
    .directive('selectPhoto', selectPhoto);

    function selectPhoto () {
        return {
            restric: 'E',
            scope: {
                options: '=',
                successCallback: '=onPhotoSelected',
                errorCallback: '=onError'
            },
            controller: selectPhotoController,
            templateUrl: 'templates/directives/selectPhoto.html'
        };
    }

    selectPhotoController.$inject = ['$scope', '$cordovaCamera'];

    function selectPhotoController ($scope, $cordovaCamera) {
        activate();

        function activate () {
            document.addEventListener("deviceready", function () {
                var tempOptions = {
                    destinationType:Camera.DestinationType.FILE_URI,
                    sourceType:Camera.PictureSourceType.PHOTOLIBRARY
                };
                //Sets custom options over the default ones
                $scope.options = Object.assign(tempOptions, $scope.options);
            }, false);
        }

        $scope.selectPhoto = function () {
            $cordovaCamera.getPicture($scope.options)
                .then(function (imgUri) {
                    $scope.successCallback(imgUri);
                }, function (err) {
                    $scope.errorCallback(err);
                });
        };
    }

})();