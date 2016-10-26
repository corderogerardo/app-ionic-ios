(function() {
    angular.module('axpress')
    .directive('autocompleteAddress', autocompleteAddress);

    function autocompleteAddress() {
        return {
            restrict: 'EA',
            scope: {
                onPlaceChanged: "="
            },
            templateUrl: 'templates/directives/mapAutocompleteAddress.html',
            controller: function ($scope) {
                activate();

                function activate () {
                    $scope.restrictions = { country: 'col' };
                    $scope.types = "['address']";
                }
            }
        };
    }
})();
