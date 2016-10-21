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
}]);