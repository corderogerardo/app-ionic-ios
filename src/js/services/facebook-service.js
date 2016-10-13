angular.module('axpress')
.factory('Facebook', ['$rootScope', '$q', 'Service', '$window', 'constants', function($rootScope, $q, Service, $window, constants){
    var service = new Service();
    service.scope = 'email,public_profile';

    //Public methods
    service.loadFacebookSDK = loadFacebookSDK;
    service.login = login;
    service.getUserInfo = getUserInfo;
    service.logout = logout;
    service.registerFacebookAsyncInit = registerFacebookAsyncInit;

    return service;

    function registerFacebookAsyncInit () {
        /**
         * This method gets called when Facebook SDK loads
         */
        $window.fbAsyncInit = function () {
            FB.init({
                appId      : constants.fbAppId,
                cookie     : true,  // enable cookies to allow the server to access the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.6',

            });
            $rootScope.facebookLoaded = true;
        };
    }

    /**
     * Loads facebook sdk.
     *
     * @param      {Object}  d       Windows.Document object
     */
    function loadFacebookSDK (d, s, id) {
        registerFacebookAsyncInit();
        var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
    }

    /**
     * Starts the process of loggin in a user using
     * the Facebook SDK
     */
    function login () {
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
    }

    /**
     * Gets user information from Facebook profile
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
     * Removes the facebook session
     */
    function logout () {
        var deferred = $q.defer();
        FB.logout(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }
}]);