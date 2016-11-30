(function() {
    angular.module('axpress')
        .controller('PaymentMethodsController', PaymentMethodsController);

    PaymentMethodsController.$inject = ['$rootScope', '$scope', '$state', 'constants', 'Logger', 'Shipping', 'Diligence'];

    function PaymentMethodsController($rootScope, $scope, $state, constants, Logger, Shipping, Diligence) {
        activate();

        $scope.confirmPaymentMethod = function() {
            switch ($state.params.serviceType) {
                case 43: //Documents
                    Shipping.registerDocument($scope.data, $rootScope.user)
                        .then(function(response) {
                            if (response.return && response.status == 200) {
                                successfullyRegisteredRequest();
                            }
                        }, function(error) {
                            console.error(error);
                        });
                    break;
                case 44: //Packages
                    Shipping.registerPackage($scope.data, $rootScope.user)
                        .then(function(response) {
                            if (response.return && response.status == 200) {
                                successfullyRegisteredRequest();
                            }
                        }, function(error) {
                            console.error(error);
                        });
                    break;
                case 45: //Diligence
                    Diligence.post($scope.user.id, $scope.data.destiniesData, $state.params.serviceType, $scope.data.samepoint, $scope.data.descriptionText, $scope.data.distance, $scope.data.pay, $scope.data.amount).then(function(response) {
                        if (response.return && response.status == 200) {
                            successfullyRegisteredRequest();
                        }
                    }, function(error) {
                        if (error.message)
                            Logger.error(error.message);
                        else
                            Logger.error('');
                    });
            }
        };

        function successfullyRegisteredRequest() {
            $scope.data = {};
            $state.go("app.main");
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.user = $rootScope.user;
            $scope.extraData = $state.current.data.extraData;
            $scope.paymentMethods = constants.paymentMethods;
        }
    }
})();
