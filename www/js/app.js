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
	;
	$urlRouterProvider.otherwise('/');
});
