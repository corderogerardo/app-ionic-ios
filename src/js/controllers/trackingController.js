(function() {
    angular.module('axpress')
        .controller('TrackingController', TrackingController);

    TrackingController.$inject = ['$rootScope', '$scope', '$state', 'constants', 'logisticResource', '$timeout', 'Shipping', 'Logger'];

    function TrackingController($rootScope, $scope, $state, constants, logisticResource, $timeout, Shipping, Logger) {
        activate();

        $scope.loadCourierPosition = loadCourierPosition;

        $scope.goToCall = function() {
            console.log("Call phone number...");
        };

        function findStatusText(status) {
            return constants.shipmentStatuses.find(function(statusType) {
                return status == statusType.value;
            });
        }

        function loadCourierPosition() {
            logisticResource.getLocation($scope.shipping.currier.currier_id).then(function(data) {
                if (data.return && data.status == 200) {
                    loadMarkers(data.data);
                }
            });
        }

        function loadMarkers(courier) {
            var markers = [{
                position: [$scope.shipping.origin_latitude, $scope.shipping.origin_longitude],
                icon: "{url: 'img/Pindestino/Pindetsino3x.png.png', scaledSize: [48,48]}",
                title: 'Origen'
            }, {
                position: [$scope.shipping.destiny_latitude, $scope.shipping.destiny_longitude],
                icon: "{url: 'img/PinOrigen/Origen3x.png.png', scaledSize: [48,48]}",
                title: 'Destino'
            }];

            if (courier) {
                markers.push({
                    position: [courier.latitud, courier.longitud],
                    icon: "{url: 'img/PinOrigen/Origen3x.png.png', scaledSize: [48,48]}",
                    title: 'Courier'
                });
            }
            $timeout(function() {
                $scope.markers = markers;
            }, 0);
        }

        function loadHistory() {
            Logger.displayProgressBar();
            Shipping.history($rootScope.user.id).then(function(history) {
                var tempHistory = history.data.remitent.concat(history.data.receptor);
                tempHistory.forEach(function(item) {
                    if (item.currier) {
                        item.currier.fullName = item.currier.name + ' ' + item.currier.last;
                    }
                    item.status = findStatusText(item.status);
                });
                $scope.history = tempHistory;

                // Detailed history
                $scope.shipping = $scope.history.filter(function(item) {
                    return item.shipping_id == parseInt($state.params.shippingId);
                }).pop();
                loadMarkers();
                loadCourierPosition();
            }, function() {
                Logger.hideProgressBar();
            });
        }

        function activate() {
            loadHistory();
        }
    }
})();
