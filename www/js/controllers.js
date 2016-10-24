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

    /**
     * Handles the logic of oAuth prompt, getting user info and retrying if failure
     *
     * @param      {Function}  successCallback  The callback to use on success
     */
    function googleGetUserInfo (successCallback) {
        Client.loginWithGoogle().then(function (response) {
            Client.googleGetUserInfo().then(function (response) {
                successCallback(response);
            }, function (error) {
                // If there's an error fetching user details, credentials are removed
                // and we have to login again
                Client.loginWithGoogle().then(function (response) {
                    Client.googleGetUserInfo().then(function (response) {
                        successCallback(response);
                    });
                });
            });
        });
    }

    /**
     * Handles the logic of oAuth prompt, getting user info and retrying if failure
     *
     * @param      {Function}  successCallback  The callback to use on success
     */
    function facebookGetUserInfo (successCallback) {
        Client.loginWithFacebook().then(function () {
            Client.facebookGetUserInfo().then(function (response) {
                successCallback(response);
            }, function (error) {
                // If there's an error fetching user details, access token it's removed
                // and we have to login again
                Client.loginWithFacebook().then(function (response) {
                    Client.facebookGetUserInfo().then(function (response) {
                        successCallback(response);
                    });
                });
            });
        });
    }

    function processFacebookLogin (details) {
        Client.facebookLogin(details.email, Client.socialPassword(details.id), details.id)
            .then(function (response) {
                $rootScope.user = response.data.user;
                $rootScope.menu = response.data.menu;
                $state.go('menu');
            }, function (error) {
                if (error.message)
                    Logger.error(error.message);
                else
                    Logger.error('');
            });
    }

    $scope.loginWithFacebook = function () {
        facebookGetUserInfo(processFacebookLogin);
    };

    function processGoogleLogin (details) {
        Client.googleLogin(details.email, Client.socialPassword(details.id), details.id)
            .then(function (response) {
                $rootScope.user = response.data.user;
                $rootScope.menu = response.data.menu;
                $state.go('menu');
            }, function (error) {
                if (error.message)
                    Logger.error(error.message);
                else
                    Logger.error('');
            });
    }

    $scope.loginWithGoogle = function () {
        googleGetUserInfo(processGoogleLogin);
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

    /**
     * Callback that receives the data fetched from Google to register a user
     *
     * @param      {Object}  userInfo  The user information
     */
    function processFacebookRegister (userInfo) {
        Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
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

    /**
     * Function that handles the oAuth prompt and user data fetch
     * to pass this data to a callback to handle the proccess.
     */
    $scope.registerWithFacebook = function () {
        facebookGetUserInfo(processFacebookRegister);
    };

    /**
     * Callback that receives the data fetched from Google to register a user
     *
     * @param      {Object}  userInfo  The user information
     */
    function processGoogleRegister (userInfo) {
        Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
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

    /**
     * Function that handles the oAuth prompt and user data fetch
     * to pass this data to a callback to handle the proccess.
     */
    $scope.registerWithGoogle = function () {
        googleGetUserInfo(processGoogleRegister);
    };

}]);;

angular.module('axpress')
.controller('DocumentOrigin', ['$scope', '$state', function($scope, $state){
    
    //Inherited data from parent, can be shared between children inyecting $state
    var documento = $state.current.data.documento;
}]);;

/**
 * @summary HistoryController
 *
 */
angular.module('axpress')
.controller('HistoryController', ['$scope', function($scope) {

    $scope.groups = [{
        "id": 1,
        "name": "DOCUMENTOS",
        "fecha": "30 - 09 - 2016",
        "iconURL": "http://ionicframework.com/img/docs/venkman.jpg"
    }, {
        "id": 2,
        "name": "PAQUETES",
        "fecha": "30 - 09 - 2016",
        "iconURL": "http://ionicframework.com/img/docs/barrett.jpg"
    }];

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
    
}]);
;

angular.module('axpress')
.controller('MenuController', ['$scope', function($scope){
}]);