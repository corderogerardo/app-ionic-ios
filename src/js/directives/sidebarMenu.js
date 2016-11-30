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

    sidebarMenuController.$inject = ['$rootScope', '$scope', 'Client', '$ionicSideMenuDelegate'];

    function sidebarMenuController($rootScope, $scope, Client, $ionicSideMenuDelegate) {
        $scope.logout = logout;
        $scope.isHome = isHome;
        $scope.cancelService = cancelService;
        $scope.isServiceActive = isServiceActive;

        function logout() {
            Client.logout();
            $rootScope.$state.go('root');
        }

        function isHome() {
            return $rootScope.$state.current.name == "app.main";
        }

        function cancelService() {
            $rootScope.$state.get('app.document').data.data = {};
            $rootScope.$state.get('app.package').data.data = {};
            $rootScope.$state.get('app.diligence').data.data = {};
            if ($rootScope.$state.current.name != "app.main") {
                $rootScope.$state.go('app.main');
                $ionicSideMenuDelegate.toggleLeft();
            }
        }

        function isServiceActive() {
            return !isEmpty($rootScope.$state.get('app.document').data.data) ||
                !isEmpty($rootScope.$state.get('app.package').data.data) ||
                !isEmpty($rootScope.$state.get('app.diligence').data.data);
        }

        function isEmpty(obj) {
            for (var i in obj)
                if (obj.hasOwnProperty(i)) return false;
            return true;
        }
    }
})();
