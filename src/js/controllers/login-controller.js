angular.module('axpress')
.controller('loginController', ['$scope', 'Client', function($scope, Client){
    $scope.login = function () {
        Client.login({password: '123', username: 'reinaldo122@gmail.com'}, function (data) {
            console.log(data);
        }, function (error) {
            console.warn("error...");
            console.log(error);
        });
    };
}]);