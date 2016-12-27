(function() {
    angular.module('axpress')
        .controller('PaymentMethodsController', PaymentMethodsController);

    PaymentMethodsController.$inject = ['$rootScope', '$scope', '$state', 'constants', 'Logger', 'Shipping', 'Diligence', 'Util'];

    function PaymentMethodsController($rootScope, $scope, $state, constants, Logger, Shipping, Diligence, Util) {
        activate();

        $scope.confirmPaymentMethod = function() {
            Logger.displayProgressBar();
            switch ($state.params.serviceType) {
                case 43: //Documents
                    Shipping.registerDocument($scope.data, $rootScope.user)
                        .then(function(response) {
                            if (response.return && response.status == 200) {
                                successfullyRegisteredRequest();
                            }
                        }, function(error) {
                            Logger.hideProgressBar();
                            Logger.toast("Ha ocurrido un error registrando su documento, por favor intente de nuevo.")
                        });
                    break;
                case 44: //Packages
                    Shipping.registerPackage($scope.data, $rootScope.user)
                        .then(function(response) {
                            if (response.return && response.status == 200) {
                                successfullyRegisteredRequest();
                            }
                        }, function(error) {
                            Logger.hideProgressBar();
                            Logger.toast("Ha ocurrido un error registrando su paquete, por favor intente de nuevo.")
                        });
                    break;
                case 45: //Diligence
                    Diligence.post($scope.user.id, $scope.data.destiniesData, $state.params.serviceType, $scope.data.samepoint, $scope.data.descriptionText, $scope.data.distance, $scope.data.pay, $scope.data.amount).then(function(response) {
                        if (response.return && response.status == 200) {
                            successfullyRegisteredRequest();
                        }
                    }, function(error) {
                        Logger.hideProgressBar();
                        Logger.toast("Ha ocurrido un error registrando su diligencia, por favor intente de nuevo.")
                    });
            }
        };

        $scope.selectPaymentMethod = function (method) {
            $scope.data.pay = method.value;
        }

        function successfullyRegisteredRequest() {
            $scope.data = {};
            $state.current.data.data = {};
            Logger.hideProgressBar();
            Util.stateGoAndReload("app.main");
            Logger.toast("Solicitud registrada correctamente");
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.user = $rootScope.user;
            $scope.extraData = $state.current.data.extraData;
            $scope.paymentMethods = constants.paymentMethods;
        }
    }
})();
