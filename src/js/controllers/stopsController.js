(function() {
    angular.module('axpress')
        .controller('StopsController', StopsController);
    StopsController.$inject = ['$rootScope', '$scope', '$state', 'Util'];

    function StopsController($rootScope, $scope, $state, Util) {
        activate();

        $scope.editDestiny = function(valux) {
            $scope.data.editStopIndex = valux;
            $scope.data.editing = true;
            $scope.extraData.navigateTo = $scope.extraData.flow + '.stops';
            Util.stateGoAndReload($scope.extraData.flow + '.destiny');
        };

        $scope.goBack = function() {
            Util.stateGoAndReload($scope.extraData.flow + '.resume');
        };

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
