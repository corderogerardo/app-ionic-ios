(function () {
    angular.module('axpress')
    .directive('takePhoto', takePhoto);

    function takePhoto () {
        return {
            restric: 'E',
            scope: {
                options: '='
            },
            controller: takePhotoController
        };
    }

    takePhotoController.$inject = ['$scope', '$cordovaCamera', '$ionicPopup'];

    function takePhotoController ($scope, $cordovaCamera, $ionicPopup) {
        activate();

        function activate () {
            var tempOptions = {
                quality:75,
                destinationType:Camera.DestinationType.DATA_URL,
                sourceType:Camera.PictureSourceType.CAMERA,
                allowEdit:true,
                encodingType:Camera.EncodingType.JPEG,
                targetWidth:300,
                targetHeight:300,
                popoverOptions:CameraPopoverOptions,
                saveToPhotoAlbum:false
            };

            //Sets custom options over the default ones
            $scope.options = Object.assign(tempOptions, $scope.options);
        }

        $scope.takePhoto = function () {
            $cordovaCamera.getPicture($scope.options).then(function(imageData){
                //Success! Image data is here
                // This dataImageBase is the Base64 Image.
                $scope.dataImageBase = imageData;
                console.log($scope.dataImageBase);
                $scope.imgSrc = "data:image/jpeg;base64, "+imageData;
            },function (err) {
                $ionicPopup.alert({title: 'An error happen when taking the picture.', template:err});
            });
        };
    }

})();