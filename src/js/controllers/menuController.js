angular.module('axpress')
.controller('MenuController', ['$rootScope','$scope','$state','$ionicPopup', function($rootScope,$scope,$state,$ionicPopup){
    /*We are going to fill the bag_services data in MenuController following the option selected*/

    $scope.menuoptions = $rootScope.menu;

    var urlsPerServiceType = {1: 'document.origin', 2: 'package.origin'};

    $scope.moveTo = function(option){
        $state.go(urlsPerServiceType[option]);
    };

}]);
