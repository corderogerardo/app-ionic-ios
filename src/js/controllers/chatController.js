(function() {
    angular.module('axpress')
        .controller("ChatController", ChatController);

    ChatController.$inject = ['$scope', '$rootScope', 'Chat', 'history'];

    function ChatController($scope, $rootScope, Chat, history) {
        activate();

        function activate() {
            if (history.return && history.status == 200) {
                $scope.history = history.data;
            }
        }
    }
})();
