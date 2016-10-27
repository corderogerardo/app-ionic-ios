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
