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

.run(['$ionicPlatform', '$rootScope', '$state', '$stateParams', 'Push', function($ionicPlatform, $rootScope, $state, $stateParams, Push) {
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
        $state.go('app.main');
    }

    //Configure moment
    moment.locale('es');

    //State vars
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //Initialize Push Service
    Push.initialize();
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicCloudProvider', function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {
    $stateProvider
        .state('root', {
            url: '/',
            templateUrl: 'templates/welcome/welcome.html',
            controller: 'AuthController'
        })
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu/menu.html'
        })
        .state('app.main', {
            url: '/main',
            views: {
                'mainContent': {
                    templateUrl: 'templates/main.html',
                    controller: 'MenuController'
                }
            }
        })
        .state('app.account', {
            url: '/account',
            views: {
                'mainContent': {
                    templateUrl: 'templates/account/account.html',
                    controller: 'AccountController'
                }
            }
        })
        .state('app.history', {
            url: '/history',
            views: {
                'mainContent': {
                    templateUrl: 'templates/history/history.html',
                    controller: 'HistoryController'
                }
            },
            resolve: {
                history: function (Shipping, $rootScope) {
                    return Shipping.history($rootScope.user.id);
                }
            }
        })
        .state('app.chat', {
            url: '/chat/:shippingId',
            resolve: {
                history: function (Chat, $stateParams) {
                    return Chat.history($stateParams.shippingId);
                }
            },
            views: {
                'mainContent': {
                    templateUrl: 'templates/chat/chat.html',
                    controller: 'ChatController'
                }
            }
        })
        /**
         * Authentication Routes
         */
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
        /**
         * Document States
         */
        .state('app.document', {
            url: '/document',
            views: {
                'mainContent': {
                    template: '<ion-nav-view name="documentContent"></ion-nav-view>'
                }
            },
            data: {
                data: {},
                extraData: {
                    flow: 'app.document',
                    originNext: 'app.document.destiny',
                    destinyNext: 'app.document.features',
                    featuresNext: 'app.document.receiver',
                    receiverNext: 'app.document.photo',
                    photoNext: 'app.document.resume',
                    resumeNext: 'app.document.paymentmethods',
                }
            },
            params: {
                serviceType: null
            }
        })
        .state('app.document.origin', {
            url: '/origin',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/origin.html',
                    controller: 'OriginController',
                }
            }
        })
        .state('app.document.destiny', {
            url: '/destiny',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/destiny.html',
                    controller: 'DestinyController'
                }
            }
        })
        .state('app.document.features', {
            url: '/features',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/features.html',
                    controller: 'FeaturesController'
                }
            }
        })
        .state('app.document.receiver', {
            url: '/receiver',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/receiver.html',
                    controller:'ReceiverController'
                }
            }
        })
        .state('app.document.photo', {
            url: '/photo',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/photo.html',
                    controller:'PhotoController'
                }
            }
        })
        .state('app.document.resume', {
            url: '/resume',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/resume.html',
                    controller:'ResumeController'
                }
            }
        })
        .state('app.document.paymentmethods', {
            url: '/paymentmethods',
            views: {
                'documentContent': {
                    templateUrl: 'templates/documents/paymentMethods.html',
                    controller:'PaymentMethodsController'
                }
            }
        })
        /**
         * Packages Routes
         */
        .state('app.package', {
            url: '/package',
            views: {
                'mainContent': {
                    template: '<ion-nav-view name="packageContent"></ion-nav-view>',
                }
            },
            data: {
                data: {},
                extraData: {
                    flow: 'package',
                    originNext: 'app.package.destiny',
                    destinyNext: 'app.package.features',
                    featuresNext: 'app.package.receiver',
                    receiverNext: 'app.package.photo',
                    photoNext: 'app.package.package',
                    packageNext: 'app.package.resume',
                    resumeNext: 'app.package.paymentmethods',
                }
            },
            params: {
                serviceType: null
            }
        })
        .state('app.package.origin', {
            url: '/origin',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/origin.html',
                    controller: 'OriginController'
                }
            }
        })
        .state('app.package.destiny', {
            url: '/destiny',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/destiny.html',
                    controller: 'DestinyController'
                }
            }
        })
        .state('app.package.features', {
            url: '/features',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/features.html',
                    controller: 'FeaturesController'
                }
            }
        })
        .state('app.package.receiver', {
            url: '/receiver',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/receiver.html',
                    controller:'ReceiverController'
                }
            }
        })
        .state('app.package.package', {
            url: '/package',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/package.html',
                    controller:'FeaturesController'
                }
            }
        })
        .state('app.package.photo', {
            url: '/photo',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/photo.html',
                    controller:'PhotoController'
                }
            }
        })
        .state('app.package.resume', {
            url: '/resume',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/resume.html',
                    controller:'ResumeController'
                }
            }
        })
        .state('app.package.paymentmethods', {
            url: '/paymentmethods',
            views: {
                'packageContent': {
                    templateUrl: 'templates/packages/paymentMethods.html',
                    controller:'PaymentMethodsController'
                }
            }
        })
        /**
         * Diligences Routes
         */
        .state('app.diligence', {
            url: '/diligence',
            views: {
                'mainContent': {
                    template: '<ion-nav-view name="diligenceContent"></ion-nav-view>',
                }
            },
            data: {
                data: {},
                extraData: {
                    flow: 'app.diligence',
                    clientNext: 'app.diligence.origin',
                    originNext: 'app.diligence.destiny',
                    destinyNext: 'app.diligence.resume',
                    resumeNext:'app.diligence.paymentmethods'
                }
            },
            params: {
                serviceType: null
            }
        })
        .state('app.diligence.clientfeatures', {
            url: '/clientfeatures',
            views: {
                'diligenceContent': {
                    templateUrl: 'templates/diligences/clientfeature.html',
                    controller: 'FeaturesController'
                }
            }
        })
        .state('app.diligence.origin', {
            url: '/origin',
            views: {
                'diligenceContent': {
                    templateUrl: 'templates/diligences/origin.html',
                    controller: 'OriginController'
                }
            }
        })
        .state('app.diligence.destiny', {
            url: '/destiny',
            views: {
                'diligenceContent': {
                    templateUrl: 'templates/diligences/destiny.html',
                    controller: 'DestinyController'
                }
            }
        })
        .state('app.diligence.stops', {
            url: '/stops',
            views: {
                'diligenceContent': {
                    templateUrl: 'templates/diligences/stops.html',
                    controller: 'StopsController'
                }
            }
        })
        .state('app.diligence.resume', {
            url: '/resume',
            views: {
                'diligenceContent': {
                    templateUrl: 'templates/diligences/resume.html',
                    controller:'ResumeController'
                }
            }
        })
        .state('app.diligence.paymentmethods', {
            url: '/paymentmethods',
            views: {
                'diligenceContent': {
                    templateUrl: 'templates/diligences/paymentMethods.html',
                    controller:'PaymentMethodsController'
                }
            }
        })
        /**
         * Shipment States
         */
        .state('tracking', {
            url: '/tracking/:shippingId',
            views: {
                'mainContent': {
                    templateUrl: 'templates/tracking/tracking.html',
                    controller:'TrackingController'
                }
            },
            resolve: {
                history: function (Shipping, $rootScope) {
                    return Shipping.history($rootScope.user.id);
                }
            }
        })
        .state('shipmentverification', {
            url: '/shipmentverification',
            templateUrl: 'templates/shipmentverification/shipmentverification.html'
        });

    $urlRouterProvider.otherwise('/');

    //Ionic Cloud Configurations
    $ionicCloudProvider.init({
        "core": {
            "app_id": "d44d2f7c"
        }
    });
}]);
