angular.module('axpress')
.factory('Client', ['$rootScope', '$q', '$http', '$timeout', 'Service', 'Facebook', 'Google', '$filter',
function($rootScope, $q, $http, $timeout, Service, Facebook, Google, $filter){

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

    service.edit = function (clientId, email, name, password, movilPhone, localPhone, identify) {
        var data = {
            client_id: clientId,
            email: email,
            name: name,
            pass: password,
            movil_phone: movilPhone,
            local_phone: localPhone,
            identify: identify
        };
        return service.apiPost('/edit', data);
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
                $rootScope.user = service.user = response;
            }, 0);
            deferred.resolve(response);
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

    service.socialPassword = function (socialId) {
        return $filter('MD5')( //MD5 Hashed
                btoa(socialId) //Base64 Encoded
                .split('').reverse().join('') //Reversed
        );
    };

    service.googleRegister = function (name, pass, email, googleId) {
        var data = { 
            email: email,
            pass: pass,
            name: name,
            google_id: googleId
        };
        return service.apiPost('/register', data);
    };

    service.googleLogin = function (email, pass, googleId) {
        var data = {
            email: email,
            pass: pass,
            google_id: googleId
        };
        return service.apiPost('/login', data);
    };

    service.facebookRegister = function (name, pass, email, facebookId) {
        var data = { 
            email: email,
            pass: pass,
            name: name,
            facebook_id: facebookId
        };
        return service.apiPost('/register', data);
    };

    service.facebookLogin = function (email, pass, facebookId) {
        var data = {
            email: email,
            pass: pass,
            facebook_id: facebookId
        };
        return service.apiPost('/login', data);
    };

    return service;
}]);
