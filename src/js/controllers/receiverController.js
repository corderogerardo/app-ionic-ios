(function() {
    angular.module('axpress')
        .controller('ReceiverController', ReceiverController);

    ReceiverController.$inject = ['$rootScope', '$scope', '$state'];

    function ReceiverController($rootScope, $scope, $state) {
        activate();

        $scope.saveCaracteristics = function() {
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.receiverNext);
            }
        };

        function activate() {
            $scope.focusedReceiverEmail = false;
            $scope.focusedReceiverName = false;
            $scope.focusedReceiverPhone = false;
            $scope.focusedReceiverCI = false;
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;

        }
    }
})();
