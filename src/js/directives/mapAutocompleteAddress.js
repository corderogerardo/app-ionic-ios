(function() {
    angular.module('axpress')
    .directive('mapAutocompleteAddress', mapAutocompleteAddress);

    function mapAutocompleteAddress() {
        return {
            restrict: 'EA',
            scope: {
                onPlaceChanged: "=",
                address: "="
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
