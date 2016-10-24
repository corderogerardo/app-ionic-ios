angular.module('axpress')
.factory('Google', ['$rootScope', '$window', '$cordovaOauth', '$q', 'Service', 'constants', 
function($rootScope, $window, $cordovaOauth, $q, Service, constants){
    var service = new Service();
    service.scope = ['profile', 'email'];

    service.login = login;
    service.getProfile = getProfile;
    service.logout = logout;

    return service;

    function login () {
        var deferred = $q.defer();
        document.addEventListener("deviceready", function () {
            if (service.credentials || localStorage.getItem('googleCredentials')) {
                deferred.resolve(true);
            } else {
                $cordovaOauth.google(constants.googleOAuthClientID, service.scope).then(function (response) {
                    service.credentials = response;
                    localStorage.setItem('googleCredentials', JSON.stringify(response));
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            }
        }, false);
        return deferred.promise;
    }

    function getProfile () {
        var deferred = $q.defer();
        var credentials = service.credentials || JSON.parse(localStorage.getItem('googleCredentials'));
        if (!credentials) {
            deferred.reject();
        } else {
            service.get("https://www.googleapis.com/userinfo/v2/me", {params: {access_token: credentials.access_token}}).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    function logout () {
        delete service.credentials;
        localStorage.removeItem('googleCredentials');
    }

}]);