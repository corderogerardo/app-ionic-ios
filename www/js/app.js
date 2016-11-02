// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('axpress', [
    'ionic',
    'ngMap',
    'ionic.cloud',
    'ngResource',
    'ngCordova',
    'ngCordovaOauth',
    'LocalStorageModule'
])

.run(['$ionicPlatform', '$rootScope', '$state', function($ionicPlatform, $rootScope, $state) {
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

    if (localStorage.getItem('axpress.user') && localStorage.getItem('axpress.menu')) {
        $rootScope.user = JSON.parse(localStorage.getItem('axpress.user'));
        $rootScope.menu = JSON.parse(localStorage.getItem('axpress.menu'));
        $state.go('menu');
    }
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicCloudProvider', function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            templateUrl: 'templates/welcome/welcome.html',
            controller: 'AuthController'
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
                doc: {},
                extraData: {
                    flow: 'document',
                    originNext: 'document.destiny',
                    destinyNext: 'document.features',
                    featuresNext: 'document.receiver',
                    receiverNext: 'document.photo',
                    photoNext: 'document.resume',
                }
            },
            params: {
                serviceType: null
            }
        })
        .state('document.origin', {
            url: '/origin',
            templateUrl: 'templates/documents/origin.html',
            controller: 'DocumentOriginController'
        })
        .state('document.destiny', {
            url: '/destiny',
            templateUrl: 'templates/documents/destiny.html',
            controller: 'DocumentDestinyController'
        })
        .state('document.features', {
            url: '/features',
            templateUrl: 'templates/documents/features.html',
            controller: 'FeaturesController'
        })
        .state('document.receiver', {
            url: '/receiver',
            templateUrl: 'templates/documents/receiver.html',
            controller:'ReceiverController'
        })
        .state('document.photo', {
            url: '/photo',
            templateUrl: 'templates/documents/photo.html',
            controller:'PhotoController'
        })
        .state('document.resume', {
            url: '/resume',
            templateUrl: 'templates/documents/resume.html',
            controller:'ResumeController'
        })
        .state('document.paymentmethods', {
            url: '/paymentmethods',
            templateUrl: 'templates/documents/paymentMethods.html',
            controller:'PaymentMethodsController'
        })
        .state('shipmenttracking', {
            url: '/shipmenttracking',
            templateUrl: 'templates/shipmenttracking/shipmenttracking.html',
            controller:'ShipmentTrackingController'
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
            templateUrl: 'templates/account/account.html',
            controller: 'AccountController',
        })
        .state('caracteristicspackages', {
            url: '/caracteristicspackages',
            templateUrl: 'templates/caracteristics/packages/caracteristicspackages.html',
            controller:'CaracteristicsPackagesController'
        })
        .state('caracteristicserrands', {
            url: '/caracteristicserrands',
            templateUrl: 'templates/caracteristics/errands/caracteristicserrands.html',
            controller:'CaracteristicsErrandsController'
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
