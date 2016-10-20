angular.module('axpress')
.factory('Client', ['$rootScope', 'constants', '$q', '$http', '$timeout', 'Service', 'Facebook', 'Google',
function($rootScope, constants, $q, $http, $timeout, Service, Facebook, Google){

    var service = new Service('/client');
    service.user = {
        isLoged: false
    };

    service.login = function (username, password) {
        var data = {
            email: username,
            pass: password
        };
        return service.apiPost('/login', data);
    };

    service.register = function (name, pass, email) {
        var data = {
            email: email,
            pass: pass,
            name: name
        };
        return service.apiPost('/register', data);
    };

    service.forgotPassword = function (email) {
        var data = {
            email: email
        };
        return service.apiPost('/forgotpassword', data);
    };

    
    service.loginWithFacebook = function () {
        var deferred = $q.defer();
        Facebook.login().then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * Fetchs user basic info such as userFacebookID, email and name
     */
    service.facebookGetUserInfo = function () {
        var deferred = $q.defer();
        Facebook.getUserInfo().then(function (response) {
            $timeout(function(){
                $rootScope.user = service.user = response.data;
            }, 0);
            deferred.resolve(response.data);
        }, function (error) {
            //Clean user's facebook credentials
            Facebook.logout();
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * Logouts user from Facebook, cleaning session.
     */
    service.facebookLogout = function () {
        Facebook.logout();
        $rootScope.user = service.user = {};
    };

    service.loginWithGoogle = function () {
        var deferred = $q.defer();
        Google.login().then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    service.googleGetUserInfo = function () {
        var deferred = $q.defer();
        Google.getProfile().then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            //Clean user's facebook credentials
            Google.logout();
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return service;
}]);