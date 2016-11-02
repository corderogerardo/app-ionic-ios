(function() {
    angular.module('axpress')
        .controller('ResumeController', ResumeController);

    ResumeController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', 'Logger', 'Shipping'];

    function ResumeController($rootScope, $scope, $cordovaDialogs, $state, Logger, Shipping) {

        activate();

        $scope.editOrigin = function() {
            $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
            $state.go($scope.extraData.flow + '.origin');
        };

        $scope.editDestiny = function() {
            $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
            $state.go($scope.extraData.flow + '.destiny');

        };

        $scope.editFeatures = function() {
            $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
            $state.go($scope.extraData.flow + '.features');

        };

        $scope.editDestinatary = function() {
            $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
            $state.go($scope.extraData.flow + '.receiver');

        };

        $scope.confirmResume = function() {
            $state.go("document.paymentmethods");
        };

        function requestQuotation() {
            Shipping.quotation($scope.doc.originLatitude, $scope.doc.originLongitude,
                    $scope.doc.destinyLatitude, $scope.doc.destinyLongitude, $state.params.serviceType, $scope.doc.bagId)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        quotationSuccessful(response.data);
                    }
                }, function(error) {
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        function quotationSuccessful(response) {
            $scope.extraData.quotation = response;
            $scope.doc.amount = response.price;
            $scope.doc.distance = response.meters;

        }

        function activate() {
            $scope.doc = $state.current.data.doc;
            $scope.extraData = $state.current.data.extraData;
            requestQuotation();
        }
    }
})();
