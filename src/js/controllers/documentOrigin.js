(function () {
    angular.module('axpress')
    .controller('DocumentOriginController', DocumentOriginController);

    DocumentOriginController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup'];

    function DocumentOriginController ($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup){

        initialize();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.confirmOrigin = function(){
            $state.current.data.doc.originAddress = $scope.place.formatted_address;
            $state.current.data.doc.originLatitude = $scope.place.geometry.location.lat();
            $state.current.data.doc.originLongitude = $scope.place.geometry.location.lng();
            $state.go("mapsdestiny");
        };

        function initialize () {
            $scope.markers = [{
                title: 'Origen'
            }];
        }
    }

})();
