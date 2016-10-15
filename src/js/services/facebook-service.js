angular.module('axpress')
.factory('Facebook', ['$rootScope', '$q', 'Service', '$window', '$cordovaOauth', 'constants',
function($rootScope, $q, Service, $window, $cordovaOauth, constants){
    var service = new Service();
    service.scope = ['email','public_profile'];

    //Public methods
    service.login = login;

    return service;

    /**
     * Starts the process of loggin in a user using Cordova oAuth
     */
    function login () {
        var deferred = $q.defer();
        document.addEventListener("deviceready", function () {
            $cordovaOauth.facebook(constants.fbAppId, service.scope).then(function (response) {
                if (response.authResponse) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response);
                }
            }, function (error) {
                deferred.reject(error);
            });
        }, false);
        return deferred.promise;
    }

    /**
     * Gets user information from Facebook profile using Js SDK
     *
     * @param      {String}  fields  The fields we want to fetch
     *                               from user profile
     * @return     {Promise}  The promise that will resolve the
     *                            user information
     */
    function getUserInfo (fields) {
        var deferred = $q.defer();
        FB.api('/me', {fields: fields}, function (response) {
            if (!response || response.error) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }

    /**
     * Removes the facebook session using Js SDK
     */
    function logout () {
        var deferred = $q.defer();
        FB.logout(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }
}]);