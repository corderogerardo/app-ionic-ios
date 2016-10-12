angular.module('axpress')
.factory('Client', ['$rootScope', 'constants', '$q', '$http', 'Service', function($rootScope, constants, $q, $http, Service){
    var service = new Service('/client');
    service.user = {
        isLoged: false
    };

    service.login = function (username, password) {
        var data = {
            email: username,
            pass: password
        };
        return service.post('/login', data);
    };

    service.register = function (name, pass, email) {
        var data = {
            email: email,
            pass: pass,
            name: name
        };
        return service.post('/register', data);
    };

    /**
     * Starts the process of loggin in a user using
     * the Facebook SDK
     */
    service.loginWithFacebook = function () {
        if (typeof FB != 'undefined') {
            FB.login(function (response) {
                if (response.authResponse) {
                    console.log(response);
                    service.facebookGetUserInfo();
                } else {
                    console.log("User cancelled login or did not authorize.");
                }
            }, {scope: 'email,public_profile'});
        }
    };

    /**
     * --NOT IN USE--
     * Subscribes to the 'authResponseChange' event of Facebook API
     * and performs actions based on if the user has correctly logged in
     */
    service.watchAuthenticationStatusChange = function () {

        FB.Event.subscribe('auth.authResponseChange', function (res) {
            if (res.status === 'connected') {
                /*
                    The user is logged in,
                    we can retrieve personal info
                */
                service.facebookGetUserInfo();

                //should use res.authResponse
                console.log(res.authResponse);
            } else if (response.status === 'not_authorized') {
                //User has not given access to data
            } else {
                //User is not logged in to the app
            }
        });
    };

    /**
     * We test the API access to fetch user basic info
     * such as userFacebookID, email and name
     */
    service.facebookGetUserInfo = function () {
        FB.api('/me', {fields: 'email,name'}, function (res) {
            $rootScope.$apply(function () {
                $rootScope.user = service.user = res;
                console.log($rootScope.user);
            });
        });
    };

    /**
     * Logouts the user from facebook
     */
    service.facebookLogout = function () {
        FB.logout(function (response) {
            $rootScope.$apply(function () {
                $rootScope.user = service.user = {};
            });
        });
    };

    return service;
}]);