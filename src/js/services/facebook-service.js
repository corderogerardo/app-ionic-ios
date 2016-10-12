angular.module('axpress')
.factory('Facebook', ['$rootScope', '$q', 'Service', function($rootScope, $q, Service){
    var service = new Service();
    service.scope = 'email,public_profile';

    /**
     * Starts the process of loggin in a user using
     * the Facebook SDK
     */
    service.login = function () {
        if (typeof FB != 'undefined') {
            var deferred = $q.defer();
            FB.login(function (response) {
                if (response.authResponse) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response);
                }
            }, {scope: service.scope});
            return deferred.promise;
        }
    };

    /**
     * Gets user information from Facebook profile
     *
     * @param      {String}  fields  The fields we want to fetch
     *                               from user profile
     * @return     {Promise}  The promise that will resolve the
     *                            user information
     */
    service.getUserInfo = function (fields) {
        var deferred = $q.defer();
        FB.api('/me', {fields: fields}, function (response) {
            if (!response || response.error) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    /**
     * Removes the facebook session
     */
    service.logout = function () {
        var deferred = $q.defer();
        FB.logout(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    };

    return service;
}]);