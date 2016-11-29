(function () {
    angular.module('axpress')
        .directive('sidebarMenu', sidebarMenu);

    function sidebarMenu () {
        return {
            restric: 'E',
            scope: {
            },
            templateUrl: 'templates/directives/sidebarMenu.html'
        };
    }
})()
