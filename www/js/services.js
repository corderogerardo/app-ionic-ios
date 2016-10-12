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
}]);;

angular.module('axpress')
.constant('constants', {
    //API base Url
    apiBaseUrl: 'http://52.43.247.174/api_devel',

    //App specific client token/key
    key: '21569d3e6977ae51178544f5dcdd508652799af3.IVadPml3rlEXhUT13N1QhlJ5mvM=',

    //String to identify the App on the Admin Console
    platform: 'iOS Hybrid',
    
    //Facebook App ID
    fbAppId: '320049998373400'
});;

angular.module('axpress')
.factory('Service', ['$http', 'constants', '$q', function($http, constants, $q){

    /**
     * Class to be instantiated as a base service with common configurations
     *
     * @class      Service (name)
     * @param      {String}  urlSufix  The url sufix of the service
     */
    var Service = function (urlSufix) {
        this.url = constants.apiBaseUrl;
        this.urlSufix = urlSufix || '';
        this.key = constants.key;
        this.platform = constants.platform;

        /**
         * Returns full base path url, useful when using services with common api path
         * Just needs to add remaining part of api path for specific service query
         *
         * @return     {String}  Full base path to service
         */
        this.urlBase = function () {
            return this.url + this.urlSufix;
        };

        /**
         * Reusable function to make queries and consume service from the server
         *
         * @param      {String}  path     The path specific to the service
         * @param      {Object}  data     The data to be sent using the service
         * @param      {Object}  options  The $http options for the service (Optional)
         * @return     {Promise}  Returns the $http promise to be resolved on success or error
         */
        this.post = function (path, data, options) {
            data = data || {};
            data.key = this.key;
            data.platform = this.platform;

            var deferred = $q.defer();
            $http.post(this.urlBase() + path, data, options || {})
            .then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    };
    return Service;
}]);