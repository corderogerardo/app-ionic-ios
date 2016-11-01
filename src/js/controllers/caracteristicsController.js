(function(){
    angular.module('axpress')
    .controller('CaracteristicsController',CaracteristicsController);

    CaracteristicsController.$inject = ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup'];

    function CaracteristicsController($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup) {
        console.log("Caracteristics Controller");

        initialize();

        $scope.saveCaracteristics = function () {
            /* $ionicPopup.alert({title: 'Destinatary', template: JSON.stringify( $scope.data)});*/
            $scope.doc.destinatary = $scope.destinatary;
            $scope.doc.caracteristics = $scope.caracteristics;
            $state.go("document.imagephoto");
        };
        function initialize(){
            $scope.destinatary = {
                email: "",
                username: "",
                phone: "",
                cinit: ""
            };
            $scope.caracteristics = {
                declaredvalue: "",
                shortdescription: ""
            };
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
        }
    }

})();
