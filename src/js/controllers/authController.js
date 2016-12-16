(function() {
    angular.module('axpress')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$rootScope', 'Client', 'Logger', '$state'];

    function AuthController($scope, $rootScope, Client, Logger, $state) {
        activate();

        function activate() {
            $scope.user = {};
            checkFirstRun();
            if (localStorage.getItem('axpress.user') && localStorage.getItem('axpress.menu')) {
                $rootScope.user = JSON.parse(localStorage.getItem('axpress.user'));
                $rootScope.menu = JSON.parse(localStorage.getItem('axpress.menu'));
                $state.go('app.main');
            }
        }

        function checkFirstRun () {
            //If app has been ran before, redirect to login
            if (localStorage.getItem('axpress.hasRan')) {
                $state.go('auth.login');
            }
            localStorage.setItem('axpress.hasRan', 1);
        }

        /**
         * Logins a user in the system using the nomal user/password method
         */
        $scope.login = function() {
            Logger.displayProgressBar();
            Client.login($scope.user.email, Client.socialPassword($scope.user.password))
                .then(function(response) {
                    //User/Pass do not match
                    if (response.status == 409) {
                        Logger.hideProgressBar();
                        Logger.toast('Usuario o Contraseña no coinciden');
                    }
                    //Login successfull
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    }
                }, function(error) {
                    Logger.hideProgressBar();
                    Logger.toast('Ha ocurrido un error, por favor intente luego.');
                });
        };

        /**
         * Handles the logic of oAuth prompt, getting user info and retrying if failure
         *
         * @param      {Function}  successCallback  The callback to use on success
         */
        function googleGetUserInfo(successCallback) {
            Logger.displayProgressBar();
            Client.loginWithGoogle().then(function(response) {
                Client.googleGetUserInfo().then(function(response) {
                    successCallback(response);
                }, function(error) {
                    // If there's an error fetching user details, credentials are removed
                    // and we have to login again
                    Client.loginWithGoogle().then(function(response) {
                        Client.googleGetUserInfo().then(function(response) {
                            successCallback(response);
                        });
                    });
                });
            }, canceledCallback);
        }

        /**
         * Handles the logic of oAuth prompt, getting user info and retrying if failure
         *
         * @param      {Function}  successCallback  The callback to use on success
         */
        function facebookGetUserInfo(successCallback) {
            Logger.displayProgressBar();
            Client.loginWithFacebook().then(function() {
                Client.facebookGetUserInfo().then(function(response) {
                    successCallback(response);
                }, function(error) {
                    // If there's an error fetching user details, access token it's removed
                    // and we have to login again
                    Client.loginWithFacebook().then(function(response) {
                        Client.facebookGetUserInfo().then(function(response) {
                            successCallback(response);
                        });
                    });
                });
            }, canceledCallback);
        }

        /**
         * Callback that processes the successfull response from Facebook API
         * to login the user in the system
         *
         * @param      {Object}  details  The details given by Faceboook
         */
        function processFacebookLogin(details) {
            Client.facebookLogin(details.email, Client.socialPassword(details.id), details.id)
                .then(function(response) {
                    //User/Pass do not match
                    if (response.status == 409) {
                        Logger.hideProgressBar();
                        Logger.toast('Usuario o Contraseña no coinciden');
                    }
                    //Login successfull
                    if (response.return && response.status == 200) {
                        response.data.user.social_picture = details.picture.data.url;
                        loginSuccessfull(response.data.user, response.data.menu);
                    }
                }, function(error) {
                    Logger.hideProgressBar();
                    Logger.toast('Ha ocurrido un error, por favor intente luego.');
                });
        }

        /**
         * Logins the user in the system using Facebook Login
         */
        $scope.loginWithFacebook = function() {
            facebookGetUserInfo(processFacebookLogin);
        };

        /**
         * Callback that processes the successfull response from Google API
         * to login the user in the system
         *
         * @param      {Object}  details  The details given by Google
         */
        function processGoogleLogin(details) {
            Client.googleLogin(details.email, Client.socialPassword(details.id), details.id)
                .then(function(response) {
                    //User/Pass do not match
                    if (response.status == 409) {
                        Logger.hideProgressBar();
                        Logger.toast('Usuario o Contraseña no coinciden');
                    }
                    //Login successfull
                    if (response.return && response.status == 200) {
                        response.data.user.social_picture = details.picture;
                        loginSuccessfull(response.data.user, response.data.menu);
                    }
                }, function(error) {
                    Logger.hideProgressBar();
                    Logger.toast('Ha ocurrido un error, por favor intente luego.');
                });
        }

        /**
         * Logins the user in the system using Google Plus
         */
        $scope.loginWithGoogle = function() {
            googleGetUserInfo(processGoogleLogin);
        };


        /**
         * Registers a user in the system
         *
         * @param      {Object}  registerForm  The user register form
         */
        $scope.doRegister = function(registerForm) {
            if (registerForm.$valid) {
                Logger.displayProgressBar();
                Client.register($scope.user.name, Client.socialPassword($scope.user.password), $scope.user.email)
                    .then(function(data) {
                        if (data.return && data.status == 200) {
                            loginSuccessfull(data.data.user, data.data.menu);
                        } else if (data.return && data.status == 409) {
                            Logger.hideProgressBar();
                            Logger.toast('Usuario ya registrado');
                        } else {
                            Logger.hideProgressBar();
                            Logger.toast('Ha ocurrido un error.');
                        }
                    }, function(error) {
                        Logger.hideProgressBar();
                        Logger.toast('Ha ocurrido un error inesperado, por favor verifique que la información ingresada es válida.');
                    });
            }
        };

        /**
         * Recovers a user password
         */
        $scope.recoverPassword = function() {
            Logger.displayProgressBar();
            Client.forgotPassword($scope.user.email)
                .then(function(response) {
                    Logger.hideProgressBar();
                    $state.go('auth.login');
                    Logger.toast(response.message);
                }, function(error) {
                    Logger.hideProgressBar();
                    Logger.toast('Ha ocurrido un error, por favor intente luego.');
                });
        };

        /**
         * Callback that receives the data fetched from Google to register a user
         *
         * @param      {Object}  userInfo  The user information
         */
        function processFacebookRegister(userInfo) {
            Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    } else if (response.status == 409 && response.message != '') {
                        Logger.hideProgressBar();
                        Logger.toast(response.message);
                    } else {
                        Logger.hideProgressBar();
                        Logger.toast('Ha ocurrido un error, por favor intente luego.');
                    }
                }, function(error) {
                    Logger.hideProgressBar();
                    Logger.toast('Ha ocurrido un error, por favor intente luego.');
                });
        }

        /**
         * Function that handles the oAuth prompt and user data fetch
         * to pass this data to a callback to handle the proccess.
         */
        $scope.registerWithFacebook = function() {
            facebookGetUserInfo(processFacebookRegister);
        };

        /**
         * Callback that receives the data fetched from Google to register a user
         *
         * @param      {Object}  userInfo  The user information
         */
        function processGoogleRegister(userInfo) {
            Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    } else if (response.status == 409 && response.message != '') {
                        Logger.hideProgressBar();
                        Logger.toast(response.message);
                    } else {
                        Logger.hideProgressBar();
                        Logger.toast('Ha ocurrido un error, por favor intente luego.');
                    }
                }, function(error) {
                    Logger.hideProgressBar();
                    Logger.toast('Ha ocurrido un error, por favor intente luego.');
                });
        }

        /**
         * Function that handles the oAuth prompt and user data fetch
         * to pass this data to a callback to handle the proccess.
         */
        $scope.registerWithGoogle = function() {
            googleGetUserInfo(processGoogleRegister);
        };

        /**
         * Saves the data on $rootScope to use in the app
         *
         * @param      {Object}  user    The user
         * @param      {Object}  menu    The menu
         */
        function loginSuccessfull(user, menu) {
            $rootScope.user = user;
            $rootScope.menu = menu;
            localStorage.setItem('axpress.user', JSON.stringify(user));
            localStorage.setItem('axpress.menu', JSON.stringify(menu));
            Logger.hideProgressBar();
            $state.go('app.main');
            Logger.toast('Bienvenido!');
        }

        function canceledCallback () {
            Logger.hideProgressBar();
        }
    }
})();
