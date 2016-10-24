angular.module('axpress')
.controller('MenuController', ['$scope','$rootScope','$ionicPopup', '$state', function($scope,$rootScope,$ionicPopup, $state){
    
    /*We are going to fill the bag_services data in MenuController following the option selected*/

    $scope.menuoptions = $rootScope.menuoptions;

    var urlsPerServiceType = {1: 'document.origin', 2: 'package.origin'};

    $scope.moveTo = function(option){
        $state.go(urlsPerServiceType[option]);
    };


}]);
