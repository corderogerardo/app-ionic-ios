(function() {
    angular.module('axpress')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['$rootScope', '$scope', 'history', 'constants'];

    function HistoryController($rootScope, $scope, history, constants) {
        activate();

        var openShipping = null; //Locally save the id of the currently open shipping

        $scope.itemTypesIcons = {
            Documentos: 'img/documento.png',
            Paquetes: 'img/paquete.png',
            Diligencias: 'img/diligencia.png'
        };

        $scope.toggleShipping = function(shippingId) {
            openShipping = (openShipping == shippingId ? null : shippingId);
        };

        $scope.isShippingShown = function(shippingId) {
            return openShipping == shippingId;
        };

        function findStatusText (status) {
            return constants.shipmentStatuses.find(function (statusType) {
                return status == statusType.value;
            });
        }

        $scope.isStatus = function (statusValue, status) {
            return statusValue == status.value;
        };

        function activate () {
            var tempHistory = history.data.remitent.concat(history.data.receptor);
            tempHistory.forEach(function (item) {
                if (item.currier) {
                    item.currier.fullName = item.currier.name + ' ' + item.currier.last;
                }
                item.status = findStatusText(item.status);
            });
            $scope.history = tempHistory;
        }
    }
})();
