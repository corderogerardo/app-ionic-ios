/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('PaymentMethodsController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope, $scope, $cordovaDialogs, $state){
        $scope.choice = {name:''};


    $scope.confirmPaymentMethod = function(){
        console.log($scope.choice.name);
        $state.go("menu");
    };

}]);
