(function() {
    angular.module('axpress')
        .controller('PaymentMethodsController', PaymentMethodsController);

    PaymentMethodsController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', 'constants', 'Logger', 'Shipping'];

    function PaymentMethodsController($rootScope, $scope, $cordovaDialogs, $state, constants, Logger, Shipping) {
        activate();

        $scope.confirmPaymentMethod = function() {
            Shipping.registerDocument($scope.data, $rootScope.user)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        successfullyRegisteredRequest();
                    }
                }, function(error) {
                    console.error(error);
                });
        };

        function successfullyRegisteredRequest() {
            $state.go("menu");
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.paymentMethods = constants.paymentMethods;
        }
    }
})();
