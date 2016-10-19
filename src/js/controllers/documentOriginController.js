angular.module('axpress')
.controller('DocumentOrigin', ['$scope', '$state', function($scope, $state){
    
    //Inherited data from parent, can be shared between children inyecting $state
    var documento = $state.current.data.documento;
}]);