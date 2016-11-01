(function() {
    angular.module('axpress')
        .controller('DocumentOriginController', DocumentOriginController);

    DocumentOriginController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup'];

    function DocumentOriginController($rootScope, $scope, $cordovaDialogs, $state, $ionicPopup) {

        activate();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.confirmOrigin = function() {
            $scope.doc.originAddress = $scope.place.formatted_address;
            $scope.doc.originLatitude = $scope.place.geometry.location.lat();
            $scope.doc.originLongitude = $scope.place.geometry.location.lng();
            $scope.extraData.originPlace = $scope.place;
            if ($scope.extraData.editOrigin === true) {
                $scope.extraData.editOrigin = false;
                $state.go("document.resume");

            } else {
                $state.go("document.destiny");
            }
        };

        function setExistingAddress() {
            $scope.markers[0].position = "" + $scope.doc.originLatitude + "," + $scope.doc.originLongitude;
            $scope.address = $scope.doc.originAddress;
            $scope.place = $state.current.data.extraData.originPlace;
        }

        function activate() {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
            $scope.markers = [{
                title: 'Origen'
            }];
            if ($scope.extraData.originPlace)
                setExistingAddress();
        }
    }

})();
