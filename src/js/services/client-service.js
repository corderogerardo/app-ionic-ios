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

    
    service.loginWithFacebook = function () {
        Facebook.login().then(function () {
            service.facebookGetUserInfo('email,name');
        });
    };

    /**
     * We test the API access to fetch user basic info
     * such as userFacebookID, email and name
     */
    service.facebookGetUserInfo = function (fields) {
        Facebook.getUserInfo(fields).then(function (response) {
            $timeout(function(){
                $rootScope.user = service.user = response;
                console.log($rootScope.user);
            }, 0);
        });
    };

    /**
     * Logouts user from Facebook, cleaning session.
     */
    service.facebookLogout = function () {
        Facebook.logout().then(function () {
            $timeout(function() {
                $rootScope.user = service.user = {};
            }, 0);
        });
    };

    service.loginWithGoogle = function () {
        Google.login();
    };

    return service;
}]);