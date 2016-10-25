/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('ErrandsResumeController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope,$scope,$cordovaDialogs, $state){

        $scope.titleMenu = $rootScope.mapsTitle;
        $scope.originAddress = $rootScope.originAddress;
        $scope.destinyAddress = $rootScope.originDestinyAddress;

        $scope.destinataryResume = $rootScope.destinatary;
        $scope.caracteristicsResume = $rootScope.caracteristics;

        $scope.confirmResume = function(){
            $state.go("paymentmethods")
        }
    }]);
