angular.module('axpress')
.factory('Google', ['$rootScope', '$window', '$cordovaOauth', '$q', 'Service', 'constants', 
function($rootScope, $window, $cordovaOauth, $q, Service, constants){
    var service = new Service();
    service.scope = ['profile', 'email'];

    service.login = login;

    return service;

    function loadGoogleSDK (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id; js.async = true; js.defer = true;
            js.src = "//apis.google.com/js/platform.js?onload=onLoadGoogle";
            fjs.parentNode.insertBefore(js, fjs);
    }

    function login () {
        var deferred = $q.defer();
        document.addEventListener("deviceready", function () {
            $cordovaOauth.google(constants.googleOAuthClientID, service.scope).then(function (user) {
                deferred.resolve(user);
            }, function (error) {
                deferred.reject(error);
            });
        }, false);
        
        return deferred.promise;
    }


}]);