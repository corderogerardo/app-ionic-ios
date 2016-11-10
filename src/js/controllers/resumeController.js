(function() {
    angular.module('axpress')
        .controller('ResumeController', ResumeController);

    ResumeController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', 'Logger', 'Shipping','Diligence'];

    function ResumeController($rootScope, $scope, $cordovaDialogs, $state, Logger, Shipping, Diligence) {

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
            $state.go($scope.extraData.resumeNext);
        };

        function requestQuotation() {
            Shipping.quotation($scope.data.originLatitude, $scope.data.originLongitude,
                    $scope.data.destinyLatitude, $scope.data.destinyLongitude, $state.params.serviceType, $scope.data.bagId)
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
            $scope.data.amount = response.price;
            $scope.data.distance = response.meters;

        }
        function requestQuotationDiligence() {
            Diligence.quotation($state.params.serviceType,$scope.data.samepoint,$scope.data.destiniesData,$scope.data.originLatitude, $scope.data.originLongitude)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        quotationDiligenceSuccessful(response.data);
                    }
                }, function(error) {
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        function quotationDiligenceSuccessful(response) {
            $scope.extraData.quotation = response;
            $scope.data.amount = response.price;
            $scope.data.distance = response.meters;

        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            console.log("Service Type Selected "+$state.params.serviceType);
            if($state.params.serviceType===45){
                requestQuotationDiligence();
            }else{
                requestQuotation();
            }
            console.log($scope.data);
            console.log($scope.extraData);
        }
    }
})();
