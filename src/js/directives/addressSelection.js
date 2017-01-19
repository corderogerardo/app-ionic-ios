/**
 * @desc helps select an address by using Google Maps to display markers
 * @example <address-selection center="centerObject" markers="arrayOfMarkers"></address-selection>
 */
(function() {
    angular.module('axpress')
        .directive('addressSelection', addressSelection);

    function addressSelection() {
        return {
            restrict: 'E',
            scope: {
                center: "=",
                markers: "=",
                callbacks: "="
            },
            templateUrl: 'templates/directives/addressSelection.html',
            controller: function($scope) {
                activate();

                function activate() {
                    $scope.fallbackCenter = "[40.74, -74.18]";
                }
            }
        };
    }
})()
