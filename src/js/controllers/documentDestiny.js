(function () {
    angular.module('axpress')
    .controller('DocumentDestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup'];

    function DocumentDestinyController ($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup){

        initialize();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.confirmDestiny = function(){
            $state.current.data.doc.destinyAddress = $scope.place.formatted_address;
            $state.current.data.doc.destinyLatitude = $scope.place.geometry.location.lat();
            $state.current.data.doc.destinyLongitude = $scope.place.geometry.location.lng();
            $state.go("document.sendtype");
        };

        function initialize () {
            $scope.markers = [{
                title: 'Destino'
            }];
        }
    }

})();
