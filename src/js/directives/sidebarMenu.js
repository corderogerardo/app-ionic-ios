(function () {
    angular.module('axpress')
        .directive('sidebarMenu', sidebarMenu);

    function sidebarMenu () {
        return {
            restric: 'E',
            scope: {},
            templateUrl: 'templates/directives/sidebarMenu.html',
            controller: sidebarMenuController
        };
    }

    sidebarMenuController.$inject = ['$rootScope', '$scope', 'Client'];

    function sidebarMenuController ($rootScope, $scope, Client) {
        $scope.logout = logout;

        function logout () {
            Client.logout();
            $rootScope.$state.go('root');
        }
    }
})();
