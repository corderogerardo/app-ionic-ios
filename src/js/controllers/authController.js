angular.module('axpress')
.controller('AuthController', ['$scope', '$rootScope', 'Client', 'Logger', '$state',
function($scope, $rootScope, Client, Logger, $state){


		activate();

		function activate () {
			processFacebookLogin({"id":"118882175249424","name":"Prueba Axpress","email":"axpressprueba1@gmail.com"});
				if (localStorage.getItem('axpress.user') && localStorage.getItem('axpress.menu')) {
						$rootScope.user = JSON.parse(localStorage.getItem('axpress.user'));
						$rootScope.menu = JSON.parse(localStorage.getItem('axpress.menu'));
						$state.go('menu');
				}
		}


		/**
		 * Logins a user in the system using the nomal user/password method
		 */
		$scope.login = function () {
				Client.login($scope.user.email,$scope.user.password)
				.then(function (response) {
						//User/Pass do not match
						if (response.status == 409) {
								Logger.alert('Usuario o Contraseña no coinciden', response.message);
						}
						//Login successfull
						if (response.return && response.status == 200) {
								loginSuccessfull(response.data.user, response.data.menu);
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

		/**
		 * Callback that processes the successfull response from Facebook API
		 * to login the user in the system
		 *
		 * @param      {Object}  details  The details given by Faceboook
		 */
		function processFacebookLogin (details) {
				Client.facebookLogin(details.email, Client.socialPassword(details.id), details.id)
						.then(function (response) {
								//User/Pass do not match
								if (response.status == 409) {
										Logger.alert('Usuario o Contraseña no coinciden', response.message);
								}
								//Login successfull
								if (response.return && response.status == 200) {
										loginSuccessfull(response.data.user, response.data.menu);
								}
						}, function (error) {
								if (error.message)
										Logger.error(error.message);
								else
										Logger.error('');
						});
		}

		/**
		 * Logins the user in the system using Facebook Login
		 */
		$scope.loginWithFacebook = function () {
				facebookGetUserInfo(processFacebookLogin);
		};

		/**
		 * Callback that processes the successfull response from Google API
		 * to login the user in the system
		 *
		 * @param      {Object}  details  The details given by Google
		 */
		function processGoogleLogin (details) {
				Client.googleLogin(details.email, Client.socialPassword(details.id), details.id)
						.then(function (response) {
								//User/Pass do not match
								if (response.status == 409) {
										Logger.alert('Usuario o Contraseña no coinciden', response.message);
								}
								//Login successfull
								if (response.return && response.status == 200) {
										loginSuccessfull(response.data.user, response.data.menu);
								}
						}, function (error) {
								if (error.message)
										Logger.error(error.message);
								else
										Logger.error('');
						});
		}

		/**
		 * Logins the user in the system using Google Plus
		 */
		$scope.loginWithGoogle = function () {
				googleGetUserInfo(processGoogleLogin);
		};


		/**
		 * Registers a user in the system
		 *
		 * @param      {Object}  registerForm  The user register form
		 */
		$scope.doRegister = function(registerForm) {
				if (registerForm.$valid) {
						Client.register($scope.user.name, $scope.user.password, $scope.user.email)
								.then(function(data) {
										if (data.return && data.status == 200) {
												loginSuccessfull(data.data.user, data.data.menu);
										} else if (data.return && data.status == 409) {
												Logger.alert('Usuario ya registrado', data.message);
										}
								}, function(error) {
										Logger.error('Ha ocurrido un error inesperado, por favor verifique que la información ingresada es válida.');
								});
				}
		};

		/**
		 * Recovers a user password
		 */
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
										loginSuccessfull(response.data.user, response.data.menu);
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
										loginSuccessfull(response.data.user, response.data.menu);
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

		/**
		 * Saves the data on $rootScope to use in the app
		 *
		 * @param      {<type>}  user    The user
		 * @param      {<type>}  menu    The menu
		 */
		function loginSuccessfull (user, menu) {
				$rootScope.user = user;
				$rootScope.menu = menu;
				localStorage.setItem('axpress.user', JSON.stringify(user));
				localStorage.setItem('axpress.menu', JSON.stringify(menu));
				$state.go('menu');
		}

}]);
