angular.module('axpress')
.controller('loginController', ['$scope', '$rootScope', 'Client', function($scope, $rootScope, Client){

    $scope.login = function () {
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
        }, function (error) {
            console.warn("error...");
            console.log(error);
        });
    };

    $scope.loginWithFacebook = function () {
        Client.loginWithFacebook();
    };

    $scope.facebookAvailable = $rootScope.facebookLoaded;

    
}]);