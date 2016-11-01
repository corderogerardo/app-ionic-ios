(function () {
    angular.module('axpress')
    .controller('MenuController', MenuController);

    MenuController.$inject = ['$rootScope', '$scope', '$state'];

    function MenuController ($rootScope, $scope, $state){
        /*We are going to fill the bag_services data in MenuController following the option selected*/

        $scope.menuoptions = $rootScope.menu;

        var urlsPerServiceType = {43: 'document.origin', 44: 'package.origin', 45: 'diligence.origin'};

        $scope.moveTo = function (option) {
            $state.go(urlsPerServiceType[option.service_provider_id], {serviceType: option.service_provider_id});
        };

    }
})();
