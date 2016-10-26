angular.module('axpress')
.controller('MapsOriginController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ,NgMap){

    /*$scope.mapsTitle = JSON.stringify($rootScope.mapsTitle);*/
    $scope.mapsTitle = 'test';
    NgMap.getMap().then(function (map) {
        $scope.map = map;
    });
    //Inherited data from parent, can be shared between children injecting $state
   /* var documento = $state.current.data.documento;*/

    $scope.address = "";
    $scope.place="";
    $scope.types="['address']";
    $scope.placeChanged = function() {
        $scope.place = this.getPlace();
        console.log('location', $scope.place.geometry.location);
        $scope.map.setCenter($scope.place.geometry.location);

    };
    $scope.confirmOrigin = function(){
        /*console.log(JSON.stringify($scope.place.geometry.location));
        console.log(JSON.stringify($scope.place.formatted_address));
        $ionicPopup.alert({title: 'option', template:"Data from address: "+JSON.stringify($scope.place.formatted_address)});*/
        $rootScope.originAddress = $scope.place.formatted_address;
        $rootScope.originLocation= $scope.place.geometry.location;
        $state.go("mapsdestiny");
       /* $cordovaDialogs.confirm('Estas seguro?',confirmClosed,"Confirmation",["Si", "No"]);*/
    };
    function confirmClosed(buttonIndex) {

        $cordovaDialogs.alert("Button selected: "+buttonIndex);

    };


}]);
