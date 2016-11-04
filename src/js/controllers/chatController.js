(function() {
    angular.module('axpress')
        .controller("ChatController", ChatController);

    ChatController.$inject = ['$scope', '$rootScope', 'Chat', 'history'];

    function ChatController($scope, $rootScope, Chat, history) {
        activate();

        function activate() {
            console.log("activate");
            $scope.chat = history;
            console.log(history);
        }
    }
})();
