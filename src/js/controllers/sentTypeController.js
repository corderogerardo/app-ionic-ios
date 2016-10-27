/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('SentTypeController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ) {

        $scope.menu = $rootScope.menu;
        $scope.bagservice = "";
        $scope.bagservicedata ="";
        $scope.choice = {name:''};

        $scope.menu.forEach(function(option){
           if(option.title === $rootScope.mapsTitle.toString()){
               $scope.bagservice = option.bag_services;
               $scope.bagservicedata = option.bag_services["0"];
           }
        });

        console.log($scope.menu);
        console.log($scope.bagservice+" "+$scope.bagservice.length);

        $scope.confirmSentType = function(){
            console.log($scope.choice.name);
            console.log($scope.bagservicedata);
            $rootScope.bagserviceselected = $scope.choice.name;
            $rootScope.bagservicedata = $scope.bagservicedata;
            $state.go("document.caracteristics");
        }

 }]);
