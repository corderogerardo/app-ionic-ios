(function() {
    angular.module('axpress')
        .controller("ChatController", ChatController);

    ChatController.$inject = ['$scope', '$rootScope', 'Chat', 'history', '$stateParams'];

    function ChatController($scope, $rootScope, Chat, history, $stateParams) {
        activate();

        $scope.sendMessage = function () {
            Chat.post($stateParams.shippingId, $rootScope.user.id, 1, $scope.chat.message)
            .then(function (response) {
                if (response.status == 200 && response.message == "SUCCESS OPERATION") {
                    $scope.history.push({
                        conversacion: $scope.chat.message,
                        rol: 1,
                        fecha_registro: moment().format("HH:mm")
                    });
                    $scope.chat = {};
                }
            }, function (error) {
                console.error(error);
            });
        };

        function activate() {
            $scope.chat = {};
            if (history.return && history.status == 200) {
                history.data.forEach(function (message) {
                    message.fecha_registro = moment(message.fecha_registro).format("HH:mm");
                });
                $scope.history = history.data;
            }
        }
    }
})();
