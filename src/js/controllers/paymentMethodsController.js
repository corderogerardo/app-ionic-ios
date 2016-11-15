(function() {
    angular.module('axpress')
        .controller('PaymentMethodsController', PaymentMethodsController);

    PaymentMethodsController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', 'constants', 'Logger', 'Shipping','Diligence'];

    function PaymentMethodsController($rootScope, $scope, $cordovaDialogs, $state, constants, Logger, Shipping,Diligence) {
        activate();

        $scope.confirmPaymentMethod = function() {
            if($state.params.serviceType === 45){
                Diligence.post($scope.user.id, $scope.data.destiniesData,$state.params.serviceType,$scope.data.samepoint,$scope.data.descriptionText,$scope.data.distance,$scope.data.pay,$scope.data.amount).then(function(response){
                    if (response.return && response.status == 200) {
                        console.log(response);
                        successfullyRegisteredRequest();
                    }
                }, function(error){
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
            }else{
                Shipping.registerDocument($scope.data, $rootScope.user)
                    .then(function(response) {
                        if (response.return && response.status == 200) {
                            successfullyRegisteredRequest();
                        }
                    }, function(error) {
                        console.error(error);
                    });
            }
        };

        function successfullyRegisteredRequest() {
            $state.go("menu");
        }


        function activate() {
            $scope.data = $state.current.data.data;
            $scope.user = $rootScope.user;
            $scope.extraData = $state.current.data.extraData;
            $scope.paymentMethods = constants.paymentMethods;
        }
    }
})();
