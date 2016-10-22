angular.module('axpress')
.factory('Client', ['$rootScope', 'constants', '$q', '$http', '$timeout', 'Service', 'Facebook', 'Google', '$filter',
function($rootScope, constants, $q, $http, $timeout, Service, Facebook, Google, $filter){

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

    service.facebookRegister = function (name, pass, email, facebookId) {
        var data = { 
            email: email,
            pass: pass,
            name: name,
            facebook_id: facebookId
        };
        return service.apiPost('/register', data);
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
    platform: 'iOS',
    
    //Facebook App ID
    fbAppId: '320049998373400',

    //Google App ID
    googleOAuthClientID: '96059222512-4vm97bgjdolu5i0fe0sg8tl35e85gjdm.apps.googleusercontent.com'
});
;

angular.module('axpress')
.factory('Facebook', ['$rootScope', '$q', 'Service', '$window', '$cordovaOauth', 'constants',
function($rootScope, $q, Service, $window, $cordovaOauth, constants){
    var service = new Service();
    service.scope = ['email','public_profile'];

    //Public methods
    service.login = login;
    service.getUserInfo = getUserInfo;
    service.logout = logout;

    return service;

    /**
     * Starts the process of loggin in a user using Cordova oAuth
     */
    function login () {
        var deferred = $q.defer();
        document.addEventListener("deviceready", function () {
            if (service.access_token || JSON.parse(localStorage.getItem('facebookAccessToken'))) {
                deferred.resolve(true);
            } else {
                $cordovaOauth.facebook(constants.fbAppId, service.scope, {redirect_uri: "http://localhost/callback"}).then(function (response) {
                    service.access_token = response.access_token;
                    localStorage.setItem('facebookAccessToken', response.access_token);
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            }
        }, false);
        return deferred.promise;
    }

    /**
     * Gets user information from Facebook profile using Js SDK
     * 
     * @return     {Promise}  The promise that will resolve the
     *                            user information
     */
    function getUserInfo () {
        var deferred = $q.defer();
        var access_token = service.access_token || JSON.parse(localStorage.getItem('facebookAccessToken'));
        if (!access_token) {
            deferred.reject();
        } else {
            service.get("https://graph.facebook.com/v2.8/me",{params:{
                access_token: access_token,
                fields: "id,name,email",
                format: 'json'
            }}).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
        }
        
        return deferred.promise;
    }

    /**
     * Removes the facebook session using Js SDK
     */
    function logout () {
        delete service.access_token;
        localStorage.removeItem('facebookAccessToken');
    }
}]);;

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

}]);;

angular.module('axpress')
.service('Logger', ['$ionicPopup', function($ionicPopup){
    return {
        alert: alert,
        error: error
    };

    /**
     * $ionicPopup alert wrapper
     *
     * @param      {String}  title   The title
     * @param      {String}  body    The body (can be html tags)
     */
    function alert (title, body) {
        $ionicPopup.alert({title: title, template: body});
    }

    /**
     * $ionicPopup alert wrapper with fixed title to send error messages
     *
     * @param      {String}  body    The body (can be html tags)
     */
    function error (body) {
        $ionicPopup.alert({title: 'Ha ocurrido un error', template: body});
    }
}]);;

angular.module('axpress')
.factory('Service', ['$http', 'constants', '$q', '$httpParamSerializerJQLike',
function($http, constants, $q, $httpParamSerializerJQLike){

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
         * Reusable function to make queries and consume service from a service
         *
         * @param      {String}  path     The path specific to the service
         * @param      {Object}  data     The data to be sent using the service (Optional)
         * @param      {Object}  options  The $http options for the service (Optional)
         * @return     {Promise}  Returns the $http promise to be resolved on success or error
         */
        this.post = function (path, data, options) {
            data = data || {};
            options = options || {};
            var deferred = $q.defer();
            $http.post(path, data, options)
            .then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Function that wraps Service.post to consume the backend api
         *
         * @param      {String}  path     The path specific to the api service (/client/login)
         * @param      {Object}  data     The data to be sent using the service (Optional)
         * @param      {Object}  options  The $http options for the service (Optional)
         * @return     {Promise}  Returns the $http promise to be resolved on success or error
         */
        this.apiPost = function (path, data, options) {
            data = data || {};
            options = options || {};
            data.key = this.key;
            data.platform = this.platform;
            options.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            path = this.urlBase() + path;
            data = $httpParamSerializerJQLike(data);
            return this.post(path, data, options);
        };

        this.get = function (path, options) {
            var deferred = $q.defer();
            $http.get(path, options || {}).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    };
    return Service;
}]);