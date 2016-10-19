angular.module('axpress')
.controller('loginController', ['$scope', 'Client', function($scope, Client){
    $scope.login = function () {
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
        }, function (error) {
            console.warn("error...");
            console.log(error);
        });
    };
}]);