(function () {
    angular.module('axpress')
    .controller("AccountController", AccountController);

    AccountController.$inject = ['$scope','$rootScope','$ionicPopup', 'Client'];

    function AccountController ($scope,$rootScope,$ionicPopup, Client) {
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
                    },function(error){
                    });

            }
        };

    }
})();
