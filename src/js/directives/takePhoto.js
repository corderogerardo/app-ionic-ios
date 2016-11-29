/**
 * @desc helps take a photo using cordova libraries
 * @example <select-photo onPhotoSelected="function" onError="function"></select-photo>
 */
(function () {
    angular.module('axpress')
    .directive('takePhoto', takePhoto);

    function takePhoto () {
        return {
            restric: 'E',
            scope: {
                options: '@',
                successCallback: '=onPhotoTaken',
                errorCallback: '=onError'
            },
            controller: takePhotoController,
            templateUrl: 'templates/directives/takePhoto.html'
        };
    }

    takePhotoController.$inject = ['$scope', '$cordovaCamera'];

    function takePhotoController ($scope, $cordovaCamera) {
        activate();

        function activate () {
            document.addEventListener("deviceready", function () {
                var tempOptions = {
                    quality:            100,
                    destinationType:    Camera.DestinationType.DATA_URL,
                    sourceType:         Camera.PictureSourceType.CAMERA,
                    allowEdit:          true,
                    encodingType:       Camera.EncodingType.JPEG,
                    targetWidth:        800,
                    targetHeight:       800,
                    popoverOptions:     CameraPopoverOptions,
                    saveToPhotoAlbum:   false,
                    correctOrientation: true
                };

                //Sets custom options over the default ones
                $scope.options = Object.assign(tempOptions, $scope.options);
            }, false);
        }
        $scope.takePhoto = function () {
            $cordovaCamera.getPicture($scope.options)
                .then(function(imageData){
                    $scope.imageSrc = "data:image/jpeg;base64, " + imageData;
                    $scope.successCallback(imageData);
                }, function (err) {
                    $scope.errorCallback(err);
                });
        };
    }
})()
