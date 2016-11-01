(function() {
    angular.module('axpress')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['$scope'];

    function HistoryController($scope) {

        $scope.groups = [{
            "id": 1,
            "name": "DOCUMENTOS",
            "fecha": "30 - 09 - 2016",
            "iconURL": "http://ionicframework.com/img/docs/venkman.jpg"
        }, {
            "id": 2,
            "name": "PAQUETES",
            "fecha": "30 - 09 - 2016",
            "iconURL": "http://ionicframework.com/img/docs/barrett.jpg"
        }];

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
            // $ionicScrollDelegate.resize();
        };

        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };

    }
})();
