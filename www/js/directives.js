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
                    $scope.fallbackCenter = "[40.74, -74.18]";
                }
            }
        };
    }
})();
;

// Drag up for the menu
(function(){
    angular.module('axpress')
    .directive('dragUp', dragUp);

    function dragUp ($ionicGesture) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                $ionicGesture.on('touch', function(e) {
                    e.gesture.stopDetect();
                    e.gesture.preventDefault();
                    $element.parent().toggleClass('slide-in-up');
                }, $element);
            }
        };
    }
})();
;

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

                $scope.disableTap = function (event) {
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
                    container.on('click', function(){
                        input.blur();
                    });
                };
            }
        };
    }
})();
;

