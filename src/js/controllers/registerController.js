/**
 * @class RegisterController

 * @constructor register

 * @function doRegister
 *
 */
angular.module('axpress')
.controller('RegisterController', ['$scope', 'Client','$ionicPopup', function($scope, Client,$ionicPopup) {
    $scope.users = {
        name: "test",
        pass: "12345",
        email: "youremail@gmail.com",
        phone: "56-555-5555",
    };
    $scope.doRegister = function(registerForm) {
        if (registerForm.$valid) {
            $ionicPopup.alert({title:'goodResponse',template:"Registro test."});
            Client.register($scope.users.email, $scope.users.pass, $scope.users.name)
                .then(function(data) {
                    $ionicPopup.alert({title:'goodResponse',template:JSON.stringify(data)});
                }, function(error) {
                    $ionicPopup.alert({title:'badResponse',template:JSON.stringify(error)})
                });
        }
    };
}]);
