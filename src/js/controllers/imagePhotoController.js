/**
 * Created by gerardo on 21/10/16.
 */
(function(){


angular.module('axpress')
.controller('ImagePhotoController',ImagePhotoController);
    ImagePhotoController.$inject = ['$rootScope','$scope', '$cordovaDialogs','$cordovaCamera', '$state','$ionicPopup'];
    function ImagePhotoController($rootScope,$scope,$cordovaDialogs,$cordovaCamera, $state,$ionicPopup){
    $scope.takePicture = function(){
        $ionicPopup.alert({title: 'Clicked on take a picture', template:"Taking a picture"});

        var options = {
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
        $cordovaCamera.getPicture(options).then(function(imageData){
            //Success! Image data is here
            // This dataImageBase is the Base64 Image.
            $scope.dataImageBase = imageData;
            console.log($scope.dataImageBase);
            $scope.imgSrc = "data:image/jpeg;base64, "+imageData;
        },function (err) {
            $ionicPopup.alert({title: 'An error happen when taking the picture.', template:err});
        });
    };
    $scope.selectPicture = function () {
        $ionicPopup.alert({title: 'Clicked on select a picture', template:"Selecting a picture"});

        var options = {
            destinationType:Camera.DestinationType.FILE_URI,
            sourceType:Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options).then(function (imgUri) {
            // This dataImageBase is the Base64 Image.
            $scope.dataImageUriBase = imgUri;
            console.log($scope.dataImageUriBase);
            $scope.imgSrc =  "data:image/jpeg;base64, "+imgUri;
        },function (err) {
            $ionicPopup.alert({title: 'An error happen when selecting the picture.', template:err});
        })
    };
    $scope.confirmImagePhoto = function(){
        $state.go("document.sentresume");
    }
}
})();
