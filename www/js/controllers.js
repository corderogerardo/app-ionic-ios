/**
 * @summary HistoryController
 *
 */
angular.module('axpress')
.controller('HistoryController', ['$scope', function($scope){

	$scope.groups = [
		{
			"id": 1,
			"name": "DOCUMENTOS",
			"fecha": "30 - 09 - 2016",
			"iconURL": "http://ionicframework.com/img/docs/venkman.jpg"
		},
		{
			"id": 2,
			"name": "PAQUETES",
			"fecha": "30 - 09 - 2016",
			 "iconURL": "http://ionicframework.com/img/docs/barrett.jpg"
		}
		];

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


}]);;

angular.module('axpress')
.controller('RegisterController',['$scope',function($scope){
	$scope.register={
		name:"test",
		pass:"12345",
		email:"youremail@gmail.com",
		phone:"56-555-5555",
	};
	$scope.doRegister=function(registerForm){
		if(registerForm.$valid){
			alert("Thanks user "+JSON.stringify($scope.register));
		}
	};
}]);;

angular.module('axpress')
.controller('loginController', ['$scope', 'Client', function($scope, Client){
    $scope.login = function () {
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
        }, function (error) {
            console.warn("error...");
            console.log(error);
        });
    };
}]);