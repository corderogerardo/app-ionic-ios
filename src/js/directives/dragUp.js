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
