(function() {
    angular.module('axpress')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$rootScope', '$scope', '$state'];

    function MenuController($rootScope, $scope, $state) {
        $scope.menuoptions = $rootScope.menu;

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
