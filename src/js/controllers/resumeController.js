(function(){
angular.module('axpress')
    .controller('ResumeController',ResumeController);
    ResumeController.$inject = ['$rootScope','$scope', '$cordovaDialogs', '$state','Shipping'];
    function ResumeController($rootScope,$scope,$cordovaDialogs, $state,Shipping){

        initialize();

        $scope.editOrigin = function(){
            $scope.extraData.editOrigin = true;

            $state.go("document.origin");

        };
        $scope.editDestiny = function(){
            $scope.extraData.editDestiny = true;

            $state.go("document.destiny");

        };
        $scope.editFeatures = function(){
            $scope.extraData.editFeatures = true;

            $state.go("document.features");

        };

        $scope.confirmResume = function(){
            /*console.log($scope.servicePrice);
            $scope.doc.pay = $scope.servicePrice;*/
            $state.go("document.paymentmethods")
        };

        function initialize () {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
          /*  $scope.doc.quotation = Shipping.quotation($scope.doc.originLatitude,$scope.doc.originLongitude,$scope.doc.destinyLatitude,$scope.doc.destinyLongitude,$scope.doc.bagId,$scope.doc.bagId);*/
        }
    }
})();
