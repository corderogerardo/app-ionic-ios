angular.module('axpress')
    .controller('MapsDestinyController', ['$rootScope','$scope', '$cordovaDialogs', '$state', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state ,NgMap){

        $scope.mapsTitle = $rootScope.mapsTitle.toString();
        $scope.originAdd =  $rootScope.originLocation.toString().replace("(","").replace(")","");
      /*  console.log("rootScope origin address: "+$rootScope.originAddress.toString());
        console.log("scope "+$scope.originAdd.toString().replace("(","").replace(")",""));*/

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
        $scope.confirmDestiny = function(){
            $rootScope.originDestinyAddress = $scope.place.formatted_address;
            $rootScope.originDestinyLocation = $scope.place.geometry.location;
            $state.go("sendtypedocuments");
            /* $cordovaDialogs.confirm('Estas seguro?',confirmClosed,"Confirmation",["Si", "No"]);*/
        };
        /*function confirmClosed(buttonIndex) {

            $cordovaDialogs.alert("Button selected: "+buttonIndex);

        }*/


    }]);
