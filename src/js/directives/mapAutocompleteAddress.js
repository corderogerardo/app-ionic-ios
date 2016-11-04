/**
 * @desc helps select an address by using Google Maps autocomplete functionality
 * @example <address-selection center="centerObject" markers="arrayOfMarkers"></address-selection>
 */
(function() {
    angular.module('axpress')
        .directive('mapAutocompleteAddress', mapAutocompleteAddress);

    function mapAutocompleteAddress() {
        return {
            restrict: 'EA',
            scope: {
                onPlaceChanged: "=",
                address: "=",
            },
            templateUrl: 'templates/directives/mapAutocompleteAddress.html',
            controller: function($scope) {
                activate();

                function activate() {
                    $scope.restrictions = { country: 'col' };
                    $scope.types = "['address']";
                }

                /**
                 * Disables the tap allowing the use on mobile devices.
                 *
                 * @param      {Object}  event   The event
                 */
                $scope.disableTap = function(event) {
                    var input = event.target;
                    // Get the predictions element
                    var container = document.getElementsByClassName('pac-container');
                    container = angular.element(container);

                    // Apply css to ensure the container overlays the other elements, and
                    // events occur on the element not behind it
                    container.css('z-index', '10000');
                    container.css('pointer-events', 'auto');

                    // Disable ionic data tap
                    container.attr('data-tap-disabled', 'true');

                    // Leave the input field if a prediction is chosen
                    container.on('click', function() {
                        $scope.focused = true;
                        input.blur();
                    });
                };
            }
        };
    }
})();
