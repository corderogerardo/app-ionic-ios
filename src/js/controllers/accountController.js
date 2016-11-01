/**
 * Created by gerardo on 19/10/16.
 */
angular.module('axpress')
.controller("AccountController",['$scope','$rootScope','$ionicPopup', 'Client', function($scope,$rootScope,$ionicPopup, Client){
    $rootScope.user={
        name: "Developer",
        pass: "123456",
        email: "developer@gmail.com",
        phone: "55-555-5555",
    };
    $scope.user = $rootScope.user;

    $scope.doAccountUpdate = function(accountForm){
        if(accountForm.$valid){
            Client.edit($scope.user)
                .then(function(data){
                    console.log(data);
                   /* $ionicPopup.alert({title:'Cambios guardados',template:"Exito."});*/
                },function(error){
                   /* $ionicPopup.alert({title:'badResponse',template:JSON.stringify(error)});*/
                });

        }
    };

}]);
