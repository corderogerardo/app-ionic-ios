// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('axpress', [
    'ionic',
    'ionic.cloud',
    'ngResource',
    'ngCordova',
    'ngCordovaOauth',
    'LocalStorageModule'
])

.run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        //Force Portrait mode
        screen.lockOrientation('portrait');
    });
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicCloudProvider', function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            templateUrl: 'templates/welcome/welcome.html'
        })
        .state('auth', {
            url: '/auth',
            abstract: true,
            template: '<ui-view/>',
            controller:'AuthController'
        })
        .state('auth.login', {
            url: '/login',
            templateUrl: 'templates/auth/login.html'
        })
        .state('auth.register', {
            url: '/register',
            templateUrl: 'templates/auth/register.html'
        })
        .state('auth.forgotpassword', {
            url: '/forgotpassword',
            templateUrl: 'templates/auth/forgotpassword.html'
        })
        .state('menu', {
            url: '/menu',
            templateUrl: 'templates/menu/menu.html',
            controller: 'MenuController'
        })
        .state('document', {
            url: '/document',
            abstract: true,
            template: '<ui-view/>',
            data: {
                documento: {}
            }
        })
        .state('document.origin', {
            url: '/origin',
            templateUrl: 'templates/maps/documents/documentOrigin.html',
            controller: 'DocumentOrigin'
        })
        .state('documentsdetailorigin', {
            url: '/documentsdetailorigin',
            templateUrl: 'templates/maps/documents/documentDetailOrigin.html'
        })
        .state('documentsdestiny', {
            url: '/documentsdestiny',
            templateUrl: 'templates/maps/documents/documentDestiny.html'
        })
        .state('documentsdetaildestiny', {
            url: '/documentsdetaildestiny',
            templateUrl: 'templates/maps/documents/documentDetailDestiny.html'
        })
        .state('sendtypedocuments', {
            url: '/sendtypedocuments',
            templateUrl: 'templates/sendtype/documents/sendtype.html'
        })
        .state('caracteristicsdocuments', {
            url: '/caracteristicsdocuments',
            templateUrl: 'templates/caracteristics/documents/caracteristics.html'
        })
        .state('documentsimagephoto', {
            url: '/documentsimagephoto',
            templateUrl: 'templates/imagephoto/documents/imagephoto.html'
        })
        .state('sentresumedocument', {
            url: '/sentresumedocument',
            templateUrl: 'templates/sentresume/sentresume.html'
        })
        .state('paymentmethods', {
            url: '/paymentmethods',
            templateUrl: 'templates/paymentmethods/paymentmethods.html'
        })
        .state('shipmenttracking', {
            url: '/shipmenttracking',
            templateUrl: 'templates/shipmenttracking/shipmenttracking.html'
        })
        .state('chat', {
            url: '/chat',
            templateUrl: 'templates/chat/chat.html'
        })
        .state('shipmentverification', {
            url: '/shipmentverification',
            templateUrl: 'templates/shipmentverification/shipmentverification.html'
        })
        .state('account', {
            url: '/account',
            templateUrl: 'templates/account/account.html'
        })
        .state('caracteristicspackages', {
            url: '/caracteristicspackages',
            templateUrl: 'templates/caracteristics/packages/caracteristicspackages.html'
        })
        .state('caracteristicserrands', {
            url: '/caracteristicserrands',
            templateUrl: 'templates/caracteristics/errands/caracteristicserrands.html'
        })
        .state('errandsdestiny', {
            url: '/errandsdestiny',
            templateUrl: 'templates/maps/errands/errandsDestiny.html'
        })
        .state('errandsresume', {
            url: '/errandsresume',
            templateUrl: 'templates/sentresume/errandsresume.html'
        })
        .state('history', {
            url: '/history',
            templateUrl: 'templates/history/history.html',
            controller: 'HistoryController'
        })
        .state('errandsstops', {
            url: '/errandsstops',
            templateUrl: 'templates/sentresume/errandsstops.html'
        });
    $urlRouterProvider.otherwise('/');

    //Ionic Cloud Configurations
    $ionicCloudProvider.init({
        "core": {
            "app_id": "d44d2f7c"
        }
    });
}]);
