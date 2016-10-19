/**
 * @class RegisterController

 * @constructor register

 * @function doRegister
 *
 */
angular.module('axpress')
.controller('RegisterController',['$scope','Client',function($scope,Client){
	$scope.users={
		name:"test",
		pass:"12345",
		email:"youremail@gmail.com",
		phone:"56-555-5555",
	};
	$scope.doRegister=function(registerForm){
		if(registerForm.$valid){
			alert("Thanks user "+JSON.stringify($scope.users));
			Client.register($scope.users.email,$scope.users.pass,$scope.users.name)
					.then(function(data){
						console.log(data);
					},function(error){
						console.war("error...");
						console.log(error);
					});
		}
	};
}]);