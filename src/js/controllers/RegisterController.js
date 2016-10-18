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
}]);