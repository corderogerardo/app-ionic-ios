(function() {
    angular.module('axpress')
        .controller('StopsController', StopsController);
    StopsController.$inject = ['$rootScope', '$scope', '$state', 'Logger'];

    function StopsController($rootScope, $scope, $state, Logger) {
        activate();

        var valux = "";

        $scope.editDestiny = function(valux) {
            console.log(valux);
            $scope.extraData.arrayPositionDestiny = valux;
            $scope.extraData.editing = true;
            $scope.extraData.navigateTo = $scope.extraData.flow + '.stops';
            $state.go($scope.extraData.flow + '.destiny');
        };

        $scope.goBack = function() {
            $state.go($scope.extraData.flow + '.resume');
        };

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
