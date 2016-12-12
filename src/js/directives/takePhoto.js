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

    function takePhotoController ($scope) {
        activate();
        var camera;

        function activate () {
            $scope.options = {};
            document.addEventListener("deviceready", function () {
                camera = navigator.camera;
                var tempOptions = {
                    destinationType:    camera.DestinationType.DATA_URL,
                    sourceType:         camera.PictureSourceType.CAMERA,
                    encodingType:       camera.EncodingType.JPEG,
                    mediaType:          camera.MediaType.PICTURE, 
                    quality:            90,
                    allowEdit:          false,
                    targetWidth:        800,
                    targetHeight:       800,
                    saveToPhotoAlbum:   false,
                    correctOrientation: true
                };
                //Sets custom options over the default ones
                $scope.options = Object.assign(tempOptions, $scope.options);
            }, false);
        }

        $scope.takePhoto = function () {
            document.addEventListener("deviceready", function () {
                camera.cleanup();
                camera.getPicture(function(imageData){
                    $scope.successCallback(imageData);
                }, function (err) {
                    if (typeof $scope.errorCallback != "undefined")
                        $scope.errorCallback(err);
                }, $scope.options);
            }, false);
        };
    }
})();
