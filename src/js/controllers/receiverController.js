(function() {
    angular.module('axpress')
        .controller('ReceiverController', ReceiverController);

    ReceiverController.$inject = ['$rootScope', '$scope', '$state', 'Logger', 'Util'];

    function ReceiverController($rootScope, $scope, $state, Logger, Util) {
        activate();

        $scope.saveCaracteristics = function() {
            if (isFormValid()) {
                if ($scope.extraData.navigateTo) {
                    $state.go($scope.extraData.navigateTo);
                    delete $scope.extraData.navigateTo;
                } else {
                    $state.go($scope.extraData.receiverNext);
                }
            }
        };

        function isFormValid() {
            var name = $scope.data.destinyName,
                email = $scope.data.emailDestinyClient,
                phone = $scope.data.cellphoneDestinyClient;

            if (name == undefined || name == "") {
                Logger.toast("Debe completar el nombre");
                return false;
            }

            if (email == undefined || email == "") {
                Logger.toast("Debe completar el correo electrónico");
                return false;
            }

            if (phone == undefined || phone == "") {
                Logger.toast("Debe completar el teléfono");
                return false;
            }

            return true;
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;

        }
    }
})();
