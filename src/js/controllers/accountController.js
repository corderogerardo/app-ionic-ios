/**
 * Created by gerardo on 19/10/16.
 */
angular.module('axpress')
.controller("AccountController",['$scope','$rootScope','$ionicPopup',function($scope,$rootScope,$ionicPopup){
    $rootScope.user={
        name: "Developer",
        pass: "123456",
        email: "developer@gmail.com",
        phone: "55-555-5555",
    };
    $scope.users = $rootScope.user;

    $scope.doAccountUpdate = function(accountForm){
        if(accountForm.$valid){
            $ionicPopup.alert({title:'goodResponse',template:"Tu Cuenta Test."});
            Client.updateUser($scope.users)
                .then(function(data){
                    console.log(data);
                    $ionicPopup.alert({title:'goodResponse',template:JSON.stringify(data)});
                },function(error){
                    $ionicPopup.alert({title:'badResponse',template:JSON.stringify(error)})
                });

        }
    };

}]);
