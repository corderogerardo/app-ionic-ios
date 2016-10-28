/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('ResumeController', ['$rootScope','$scope', '$cordovaDialogs', '$state','Shipping', function($rootScope,$scope,$cordovaDialogs, $state,Shipping){

        initialize();

        $scope.originAddress = $scope.doc.originAddress;
        $scope.destinyAddress = $scope.doc.destinyAddress;

        $scope.destinataryResume = $scope.doc.destinatary;
        $scope.caracteristicsResume = $scope.doc.caracteristics;

        $scope.confirmResume = function(){
            console.log($scope.servicePrice);
            $scope.doc.pay = $scope.servicePrice;
            $state.go("document.paymentmethods")
        };

        function initialize () {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
            $scope.servicePrice = Shipping.quotation($scope.doc.originLatitude,$scope.doc.originLongitude,$scope.doc.destinyLatitude,$scope.doc.destinyLongitude,$scope.doc.bagId);
        }
    }]);
