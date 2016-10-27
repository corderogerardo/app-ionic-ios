(function() {
    angular.module('axpress')
    .directive('addressSelection', addressSelection);

    function addressSelection() {
        return {
            restrict: 'E',
            scope: {
                center: "=",
                markers: "=",

            },
            templateUrl: 'templates/directives/addressSelection.html',
            controller: function ($scope) {
                activate();

                function activate () {
                    console.log($scope);
                    $scope.fallbackCenter = "[40.74, -74.18]";
                }
            }
        };
    }
})();
