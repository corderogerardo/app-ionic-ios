(function () {
    angular.module('axpress')
    .controller('DocumentDestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup'];

    function DocumentDestinyController ($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup){

        initialize();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[1].position = $scope.place.geometry.location;
        };

        $scope.confirmDestiny = function(){
            $scope.doc.destinyAddress = $scope.place.formatted_address;
            $scope.doc.destinyLatitude = $scope.place.geometry.location.lat();
            $scope.doc.destinyLongitude = $scope.place.geometry.location.lng();
            $state.go("document.servicetype");
        };

        function setExistingAddress () {
            $scope.markers[1].position = ""+$scope.doc.destinyLatitude+","+$scope.doc.destinyLongitude;
            $scope.address = $scope.doc.originAddress;
        }

        function initialize () {
            $scope.doc = $state.current.data.doc;
            $scope.markers = [{
                title: 'Origen',
                position: [$scope.doc.originLatitude, $scope.doc.originLongitude]
            },{
                title: 'Destino'
            }];

            if ($scope.doc.destinyLatitude && $scope.doc.destinyLongitude)
                setExistingAddress();
        }
    }

})();
