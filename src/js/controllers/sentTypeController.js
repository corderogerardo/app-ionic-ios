/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('SentTypeController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ) {


        $scope.confirmSentType = function(){
            $state.go("caracteristicsdocuments");
        }

 }]);
