(function() {
    angular.module('axpress')
        .service('Util', Util);

    Util.$inject = ['$rootScope'];

    function Util($rootScope) {
        return {
            stateGoAndReload: stateGoAndReload
        };

        function stateGoAndReload(state, params) {
            $rootScope.$state.go(state || 'app.main', params || {}).then(function() {
                $rootScope.$state.reload();
            });
        }
    }
})();
