/**
 * Created by Gerardo Cordero on 20/10/2016.
 */
angular.module('axpress')
    .controller('CaracteristicsController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup) {
        console.log("Caracteristics Controller");
        $scope.mapsTitle = $rootScope.mapsTitle.toString();
        $scope.destinatary ={
            email: "youremail@gmail.com",
            username: "test",
            phone: "56-555-5555",
            cinit: "12345",
        }
        $scope.caracteristics = {
            declaredvalue: "30000",
            shortdescription: "Pequeña descripcion",
        }
        $scope.data ={};
        $scope.data.destinatary =  $scope.destinatary;
        $scope.data.caracteristics =  $scope.caracteristics;


        $scope.saveCaracteristics = function () {
           /* $ionicPopup.alert({title: 'Destinatary', template: JSON.stringify( $scope.data)});*/
           $rootScope.destinatary = $scope.destinatary;
           $rootScope.caracteristics = $scope.caracteristics;
            if($scope.mapsTitle === "Documentos"){
                console.log(" "+$scope.mapsTitle);
                $state.go("document.imagephoto");
            }
            if($scope.mapsTitle === "Paquetes"){
                console.log(" "+$scope.mapsTitle);
                $state.go("caracteristicspackages");
            }
            /*Caracteristics Service*/

           /* Caracteristics.save($scope.data.destinatary,$scope.data.caracteristics)
                .then(function(data){
                    console.log(data);
                },function(error){
                    console.log(error);
                })*/

        }

}]);
