(function() {
    angular.module('axpress')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$rootScope', '$scope', '$state'];

    function MenuController($rootScope, $scope, $state) {
        $scope.menuoptions = $rootScope.menu.filter(function (item) {
            var serviceId = item.service_provider_id;
            return (serviceId == 43 || serviceId == 44 || serviceId == 45);
        });

        var urlsPerServiceType = {
            43: 'app.document.origin',
            44: 'app.package.origin',
            45: 'app.diligence.clientfeatures'
        };

        $scope.moveTo = function(option) {
            $state.go(urlsPerServiceType[option.service_provider_id], { serviceType: option.service_provider_id });
        };
    }
})();
