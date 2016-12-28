(function() {
		angular.module('axpress')
				.controller('RatingController', RatingController);

		RatingController.$inject = ['$rootScope', '$scope', '$state', 'constants', 'Rating', '$timeout', 'Shipping', 'Util'];

		function RatingController($rootScope, $scope, $state, constants, Rating, $timeout, Shipping, Util) {
				activate();

				$scope.rateService = rateService;

				function rateService () {
						$scope.rating = 3;
						var shippingId = $scope.shipping.shipping_id,
								rating = $scope.rating;
						Logger.displayProgressBar();
						Rating.post(shippingId, rating).then(function (response) {
							Logger.hideProgressBar();
							Util.stateGoAndReload('app.main');
							Logger.toast("Se ha guardado su calificación correctamente.");
						}, function () {
								Logger.hideProgressBar();
						});
				}

				function loadHistory () {
						Logger.displayProgressBar();
						Shipping.history($rootScope.user.id).then(function (history) {
								var tempHistory = history.data.remitent.concat(history.data.receptor);
								tempHistory.forEach(function (item) {
										if (item.currier) {
												item.currier.fullName = item.currier.name + ' ' + item.currier.last;
										}
								});
								$scope.history = tempHistory;

								// Specific shipping
								$scope.shipping = $scope.history.filter(function (item) {
										return item.shipping_id == parseInt($state.params.shippingId);
								}).pop();
						}, function () {
								Logger.hideProgressBar();
						});
				}

				function activate () {
						$scope.ratingsObject = {
								iconOn : 'ion-ios-star',
								iconOff : 'ion-ios-star-outline',
								iconOnColor: 'rgb(200, 200, 100)',
								rating:  2,
								minRating:1
						};
						loadHistory();
				}
		}
})();
