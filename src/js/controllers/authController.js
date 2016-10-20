angular.module('axpress')
.controller('AuthController', ['$scope', '$rootScope', 'Client', '$ionicPopup',
function($scope, $rootScope, Client, $ionicPopup){
    
    $scope.user = {
        name: "Reinaldo Diaz",
        pass: "123456",
        email: "reinaldo122@gmail.com"
    };

    $scope.login = function () {
        //use $scope.user
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
            $ionicPopup.alert({title: 'goodResponse', template:JSON.stringify(data)});
        }, function (error) {
            $ionicPopup.alert({title: 'badResponse', template:JSON.stringify(error)});
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

    $scope.doRegister = function(registerForm) {
        if (registerForm.$valid) {
            Client.register($scope.user.name, $scope.user.pass, $scope.user.email)
                .then(function(data) {

                    if (data.return && data.status == 200) {
                        //Successfully registered
                    } else if (data.return && data.status == 409) {
                        $ionicPopup.alert({title: 'Usuario ya registrado', template:data.message});
                    }
                }, function(error) {
                    console.war("error...");
                    console.log(error);
                });
        }
    };

    $scope.recoverPassword = function () {
        Client.forgotPassword($scope.user.email)
            .then(function (response) {
                $ionicPopup.alert({title: 'Recuperación de Contraseña', template:response.message});
            });
    };
    
}]);