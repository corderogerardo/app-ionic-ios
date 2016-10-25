/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('PaymentMethodsController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope, $scope, $cordovaDialogs, $state){



    $scope.confirmPaymentMethod = function(){
        $state.go("shipmenttracking");
    };

}]);
