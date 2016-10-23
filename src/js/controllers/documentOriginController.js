angular.module('axpress')
.controller('DocumentOriginController', ['$scope', '$cordovaDialogs', '$state', 'NgMap', function($scope,$cordovaDialogs, $state ,NgMap){
    var vm = this;
    NgMap.getMap().then(function (map) {
        vm.map = map;
    });
    //Inherited data from parent, can be shared between children injecting $state
   /* var documento = $state.current.data.documento;*/

    vm.address = "";
    vm.place="";
    vm.types="['address']";
    vm.placeChanged = function() {
        vm.place = this.getPlace();
        console.log('location', vm.place.geometry.location);
        vm.map.setCenter(vm.place.geometry.location);

    };
    vm.confirmOrigin = function(){
        console.log("documentsdetailorigin");
       /* $cordovaDialogs.confirm('Estas seguro?',confirmClosed,"Confirmation",["Si", "No"]);*/
    };
    function confirmClosed(buttonIndex) {
        $cordovaDialogs.alert("Button selected: "+buttonIndex);

    };


}]);
