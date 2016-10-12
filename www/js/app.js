// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('axpress', ['ionic'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})
.controller('ShipementTracking', function($scope) {})

// Drag up for the menu
.directive('dragUp', function($ionicGesture) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {
			$ionicGesture.on('touch', function(e) {
				e.gesture.stopDetect();
				e.gesture.preventDefault();
				$element.parent().toggleClass('slide-in-up');
			}, $element);
		}
	}
})
.config(function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('app',{
		url:'/',
		views: {
			'mainContent': {
				templateUrl: 'templates/welcome/welcome.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
		/*controller:'WelcomeController'*/
	})
	.state('login',{
		url:'/login',
		views: {
			'mainContent': {
				templateUrl: 'templates/login/login.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('register',{
		url:'/register',
		views: {
			'mainContent': {
				templateUrl: 'templates/register/register.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('menu',{
		url:'/menu',
		views: {
			'mainContent': {
				templateUrl: 'templates/menu/menu.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('documentsorigin',{
		url:'/documentsorigin',
		views: {
			'mainContent': {
				templateUrl: 'templates/maps/documents/documentOrigin.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('documentsdetailorigin',{
		url:'/documentsdetailorigin',
		views: {
			'mainContent': {
				templateUrl: 'templates/maps/documents/documentDetailOrigin.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('documentsdestiny',{
		url:'/documentsdestiny',
		views: {
			'mainContent': {
				templateUrl: 'templates/maps/documents/documentDestiny.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('documentsdetaildestiny',{
		url:'/documentsdetaildestiny',
		views: {
			'mainContent': {
				templateUrl: 'templates/maps/documents/documentDetailDestiny.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('sendtypedocuments',{
		url:'/sendtypedocuments',
		views: {
			'mainContent': {
				templateUrl: 'templates/sendtype/documents/sendtype.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('caracteristicsdocuments',{
		url:'/caracteristicsdocuments',
		views: {
			'mainContent': {
				templateUrl: 'templates/caracteristics/documents/caracteristics.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('documentsimagephoto',{
		url:'/documentsimagephoto',
		views: {
			'mainContent': {
				templateUrl: 'templates/imagephoto/documents/imagephoto.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('sentresumedocument',{
		url:'/sentresumedocument',
		views: {
			'mainContent': {
				templateUrl: 'templates/sentresume/sentresume.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('paymentmethods',{
		url:'/paymentmethods',
		views: {
			'mainContent': {
				templateUrl: 'templates/paymentmethods/paymentmethods.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('shipmenttracking',{
		url:'/shipmenttracking',
		views: {
			'mainContent': {
				templateUrl: 'templates/shipmenttracking/shipmenttracking.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('chat',{
		url:'/chat',
		views: {
			'mainContent': {
				templateUrl: 'templates/chat/chat.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('shipmentverification',{
		url:'/shipmentverification',
		views: {
			'mainContent': {
				templateUrl: 'templates/shipmentverification/shipmentverification.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('account',{
		url:'/account',
		views: {
			'mainContent': {
				templateUrl: 'templates/account/account.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	.state('caracteristicspackages',{
		url:'/caracteristicspackages',
		views: {
			'mainContent': {
				templateUrl: 'templates/caracteristics/packages/caracteristicspackages.html',
				/*controller:'',
				resolve:{
				}/*end resolve*/
			}
		}
	})
	;
	$urlRouterProvider.otherwise('/');
});
