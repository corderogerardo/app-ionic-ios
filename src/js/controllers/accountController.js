(function() {
		angular.module('axpress')
				.controller("AccountController", AccountController);

		AccountController.$inject = ['$scope', '$rootScope', 'Client', 'Logger', '$state'];

		function AccountController($scope, $rootScope, Client, Logger, $state) {
				activate();

				function activate() {
						$scope.user = $rootScope.user;
				}

				$scope.doAccountUpdate = function(accountForm) {
						if (accountForm.$valid) {
								Logger.displayProgressBar();
								Client.edit($scope.user.id, $scope.user.email, $scope.user.name, $scope.user.pass, $scope.user.newPass, $scope.user.phone,
												$scope.user.localPhone, $scope.user.identify)
										.then(function(response) {
												if (response.return && response.status == 200)
														successfullyUpdatedAccount();
										}, function(error) {
												Logger.toast("Ha ocurrido un problema actualizando su información.");
										});
						}
				};

				/**
				 * Receives the user updated data from the server
				 */
				function successfullyUpdatedAccount () {
						localStorage.setItem('axpress.user', JSON.stringify($scope.user));
						Logger.hideProgressBar();
						$state.go('app.main');
						Logger.toast("Su información se ha actualizado correctamente.");
				}
		}
})();
