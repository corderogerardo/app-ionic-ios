angular.module('axpress')
.controller('DocumentOriginController', ['$scope', '$state','uiGmapGoogleMapApiProvider', function($scope, $state,uiGmapGoogleMapApiProvider){

    //Inherited data from parent, can be shared between children inyecting $state
    var documento = $state.current.data.documento;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
}]);
