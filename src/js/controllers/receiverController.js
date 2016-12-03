(function() {
    angular.module('axpress')
        .controller('ReceiverController', ReceiverController);

    ReceiverController.$inject = ['$rootScope', '$scope', '$state', 'Logger'];

    function ReceiverController($rootScope, $scope, $state, Logger) {
        activate();

        $scope.saveCaracteristics = function() {
            if (isFormValid()) {
                if ($scope.extraData.navigateTo) {
                    $state.go($scope.extraData.navigateTo);
                    delete $scope.extraData.navigateTo;
                } else {
                    $state.go($scope.extraData.receiverNext);
                }
            } else {
                Logger.toast("Debe completar el nombre, correo electrónico y teléfono");
            }
        };

        function isFormValid () {
            return $scope.data.destinyName != "" &&
                $scope.data.emailDestinyClient != "" &&
                $scope.data.cellphoneDestinyClient != "";
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;

        }
    }
})();
