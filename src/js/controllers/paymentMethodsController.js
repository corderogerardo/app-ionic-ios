(function(){
angular.module('axpress')
    .controller('PaymentMethodsController',PaymentMethodsController);
    PaymentMethodsController.$inject = ['$rootScope','$scope', '$cordovaDialogs', '$state','Logger','Shipping'];
        function PaymentMethodsController($rootScope, $scope, $cordovaDialogs, $state,Logger,Shipping) {
            initialize();



            $scope.confirmPaymentMethod = function () {
                console.log($scope.doc.paymentChoice.name);
                console.log(typeof(new Date()));
                Shipping.register($scope.doc.descriptionText,1,$scope.doc.quotation.kilometers_text,$rootScope.user.name,$scope.doc.originAddress,$scope.doc.originLatitude,$scope.doc.originLongitude,$scope.doc.destinyAddress,$scope.doc.destinyLatitude,$scope.doc.destinyLongitude,$scope.doc.quotation.price,$scope.doc.quotation.declaredvalue,$scope.doc.typeServices,0,new Date()).then(function(response){
                    console.log(response);
                    $state.go("menu");
                },function(error){
                    console.log(error);
                });
            };

            function initialize (){
                $scope.doc = $state.current.data.doc;
                $scope.extraData = $state.current.data.extraData;
                $scope.doc.paymentChoice = {name: ''};
                console.log($scope.doc);
                console.log($scope.doc.paymentChoice);
                console.log($scope.extraData);
                console.log($rootScope.user);
            }
        }
})();
