/**
 * Created by gerardo on 21/10/16.
 */
angular.module('axpress')
.controller('ImagePhotoController',['$rootScope','$scope', '$cordovaDialogs','$cordovaCamera', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs,$cordovaCamera, $state,$ionicPopup){
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
            $scope.imgSrc = imgUri;
        },function (err) {
            $ionicPopup.alert({title: 'An error happen when selecting the picture.', template:err});
        })
    };
    $scope.confirmImagePhoto = function(){
        $state.go("document.sentresume");
    }
}]);
