(function() {
    angular.module('axpress')
        .controller("AccountController", AccountController);

    AccountController.$inject = ['$scope', '$rootScope', 'Client', 'Logger', '$state', 'Util'];

    function AccountController($scope, $rootScope, Client, Logger, $state, Util) {
        var preBase64 = "data:image/jpeg;base64,";
        activate();

        function activate() {
            $scope.user = $rootScope.user;
            $rootScope.$watch('user', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.user = $rootScope.user;
                }
            }, true);
        }

        $scope.doAccountUpdate = function(accountForm) {
            if (hasFilledCurrentPassword() && accountForm.$valid) {
                Logger.displayProgressBar();
                $scope.user.isSocialAccount = $scope.isSocialAccount();
                Client.edit($scope.user)
                    .then(function(response) {
                        if (response.return && response.status == 200)
                            successfullyUpdatedAccount();
                        else {
                            Logger.hideProgressBar();
                            Logger.toast(response.message);
                        }
                    }, function(error) {
                        Logger.hideProgressBar();
                        Logger.toast("Ha ocurrido un problema actualizando su información.");
                    });
            }
        };

        function hasFilledCurrentPassword() {
            if (!$scope.user.access_token && !$scope.user.pass) {
                Logger.toast("Debe colocar su contraseña actual para actualizar sus datos");
                return false;
            }
            return true;
        }

        $scope.isSocialAccount = function() {
            return ($scope.user.access_token != undefined);
        };

        function hasFilledCurrentPassword() {
            if (!$scope.user.access_token && !$scope.user.pass) {
                Logger.toast("Debe colocar su contraseña actual para actualizar sus datos");
                return false;
            }
            return true;
        }

        $scope.isSocialAccount = function() {
            return ($scope.user.access_token != undefined && $scope.user.social_id != undefined);
        };

        /**
         * Receives the user updated data from the server
         */
        function successfullyUpdatedAccount() {
            delete $scope.user.pass;
            delete $scope.user.newPass;
            localStorage.setItem('axpress.user', JSON.stringify($scope.user));
            Logger.hideProgressBar();
            $state.go('app.main');
            Logger.toast("Su información se ha actualizado correctamente.");
        }

        /**
         * Gets and saves to localStorage a profile image selected by the user
         *
         * @param      {<type>}  imageData  The image data
         */
        $scope.imageSelected = function(imageData) {
            $scope.user.selectedPhoto = preBase64 + imageData;
            localStorage.setItem('axpress.user', JSON.stringify($scope.user));
            $state.reload();
        };
    }
})();
