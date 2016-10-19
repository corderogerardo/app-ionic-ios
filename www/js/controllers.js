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
.controller('LoginController', ['$scope', '$rootScope', 'Client', '$ionicPopup',
function($scope, $rootScope, Client, $ionicPopup){

    $scope.login = function () {
        //use $scope.user
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
        }, function (error) {
            console.warn("error...");
            console.log(error);
        });
    };

    function processFacebookLogin (details) {
        //TODO: Do something with user details
    }

    $scope.loginWithFacebook = function () {
        Client.loginWithFacebook().then(function (response) {
            Client.facebookGetUserInfo().then(function (response) {
                processFacebookLogin(response);
            }, function (error) {
                // If there's an error fetching user details, access token it's removed
                // and we have to login again
                Client.loginWithFacebook().then(function (response) {
                    Client.facebookGetUserInfo().then(function (response) {
                        processFacebookLogin(response);
                    });
                });
            });
        });
        
    };

    function processGoogleLogin (details) {
        //TODO: Do something with user details
        $ionicPopup.alert({title: 'gInfo', template:JSON.stringify(details)});
    }

    $scope.loginWithGoogle = function () {
        Client.loginWithGoogle().then(function (response) {
            Client.googleGetUserInfo().then(function (response) {
                processGoogleLogin(response);
            }, function (error) {
                // If there's an error fetching user details, credentials are removed
                // and we have to login again
                Client.loginWithGoogle().then(function (response) {
                    Client.googleGetUserInfo().then(function (response) {
                        processGoogleLogin(response);
                    });
                });
            });
        });
    };

    $scope.facebookAvailable = $rootScope.facebookLoaded;

    
}]);;

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