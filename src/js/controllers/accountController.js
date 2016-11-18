(function() {
    angular.module('axpress')
        .controller("AccountController", AccountController);

    AccountController.$inject = ['$scope', '$rootScope', 'Client'];

    function AccountController($scope, $rootScope, Client) {
        activate();

        function activate() {
            $scope.user = $rootScope.user;
        }

        $scope.doAccountUpdate = function(accountForm) {
            if (accountForm.$valid) {
                Client.edit($scope.user.id, $scope.user.email, $scope.user.name, $scope.user.pass, $scope.user.phone,
                        $scope.user.localPhone, $scope.user.identify)
                    .then(function(response) {
                        if (response.return && response.status == 200)
                            successfullyUpdatedAccount();
                    }, function(error) {
                        //Couldn update user data
                    });
            }
        };

        /**
         * Receives the user updated data from the server
         */
        function successfullyUpdatedAccount () {
            localStorage.setItem('axpress.user', JSON.stringify($scope.user));
        }
    }
})();
