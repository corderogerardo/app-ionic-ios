(function () {
    angular.module('axpress')
    .controller('FeaturesController', FeaturesController);

    FeaturesController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state','$ionicPopup'];

    function FeaturesController ($rootScope, $scope, $cordovaDialogs, $state, $ionicPopup) {
        initialize();

        $scope.saveCaracteristics = function () {
            $state.go($scope.extraData.featuresNext);
        };

        function initialize () {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;

            //Test Data
            $scope.doc.emailDestinyClient = "youremail@gmail.com";
            $scope.doc.cellphoneDestinyClient = "56-555-5555";
            $scope.doc.destinyName = "Carlos Perez";
            $scope.doc.destinyClient = "123456789";
            $scope.doc.amountDeclared = 30000;
            $scope.doc.descriptionText = "Pequeña descripcion";
        }
    }
})();
