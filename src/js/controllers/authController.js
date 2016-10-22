angular.module('axpress')
.controller('AuthController', ['$scope', '$rootScope', 'Client', 'Logger', '$state',
function($scope, $rootScope, Client, Logger, $state){
    
    $scope.user = {
        name: "Reinaldo Diaz",
        password: "123456",
        email: "reinaldo122@gmail.com"
    };

    $scope.login = function () {
        Client.login($scope.user.email,$scope.user.password)
        .then(function (response) {
            console.log(response);
            //User/Pass do not match
            if (response.status == 409) {
                Logger.alert('Usuario o Contraseña no coinciden', response.message);
            }
            //Login successfull
            if (response.return && response.status == 200) {
                $state.go('menu');
            }
        }, function (error) {
            Logger.alert('badResponse', JSON.stringify(error));
        });
    };

    function processFacebookLogin (details) {
        //TODO: Do something with user details
        Logger.alert('facebook info', JSON.stringify(details));
    }

    $scope.loginWithFacebook = function () {
        Client.loginWithFacebook().then(function (response) {
            Client.facebookGetUserInfo().then(function (response) {
                Logger.alert('success getting info', '');
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
        Logger.alert('gInfo', JSON.stringify(details));
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
            Client.register($scope.user.name, $scope.user.password, $scope.user.email)
                .then(function(data) {
                    if (data.return && data.status == 200) {
                        $state.go('menu');
                    } else if (data.return && data.status == 409) {
                        Logger.alert('Usuario ya registrado', data.message);
                    }
                }, function(error) {
                    Logger.error('Ha ocurrido un error inesperado, por favor verifique que la información ingresada es válida.');
                });
        }
    };

    $scope.recoverPassword = function () {
        Client.forgotPassword($scope.user.email)
            .then(function (response) {
                Logger.alert('Recuperación de Contraseña', response.message);
            }, function (error) {
                Logger.error('Ha ocurrido un error, por favor intente luego.');
            });
    };

    function processFacebookRegister (userInfo) {
        /*var data = {
            email: userInfo.email,
            pass: Client.socialPassword(userInfo.id),
            name: userInfo.name,
            facebook_id: userInfo.id
        };*/
        var data = {
            "email":"reinaldo122@gmail.com",
            "pass":"d178443f8cc43ea38c210bc8b9c91bb0",
            "name":"Reinaldo Díaz Lugo",
            "facebook_id":"10209895547121607"
        };
        console.log(JSON.stringify(data));
        console.log("-----------");
        Client.register(data)
            .then(function (response) {
                Logger.alert('REGISTRO', JSON.stringify(response));
            }, function (error) {
                console.error(JSON.stringify(error));
            });
    }

    $scope.registerWithFacebook = function () {
        processFacebookRegister();
        /*Client.loginWithFacebook().then(function (response) {
            Client.facebookGetUserInfo().then(function (response) {
                processFacebookRegister(response);
            }, function (error) {
                // If there's an error fetching user details, access token it's removed
                // and we have to login again
                Client.loginWithFacebook().then(function (response) {
                    Client.facebookGetUserInfo().then(function (response) {
                        processFacebookRegister(response);
                    });
                });
            });
        });*/
    };

    function processGoogleRegister (userInfo) {
        Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.google_id)
            .then(function (response) {
                if (response.return && response.status == 200) {
                    //We save globally accessible data
                    $rootScope.user = response.data.user;
                    $rootScope.menu = response.data.menu;
                    $state.go('menu');
                } else if (response.status == 409 && response.message!= '') {
                    Logger.error(response.message);
                }
            }, function (error) {
                if (error.message)
                    Logger.error(error.message);
                else
                    Logger.error('');
            });
    }

    $scope.registerWithGoogle = function () {
        Client.loginWithGoogle().then(function (response) {
            Client.googleGetUserInfo().then(function (response) {
                processGoogleRegister(response);
            }, function (error) {
                // If there's an error fetching user details, credentials are removed
                // and we have to login again
                Client.loginWithGoogle().then(function (response) {
                    Client.googleGetUserInfo().then(function (response) {
                        processGoogleRegister(response);
                    });
                });
            });
        });
    };

}]);