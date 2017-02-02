(function() {
    angular.module('axpress')
        .factory('Facebook', Facebook);

    Facebook.$inject = ['$rootScope', '$q', 'Service', '$window', '$cordovaOauth', 'constants'];

    function Facebook($rootScope, $q, Service, $window, $cordovaOauth, constants) {
        var service = new Service();
        service.scope = ['email', 'public_profile'];

        //Public methods
        service.login = login;
        service.getUserInfo = getUserInfo;
        service.logout = logout;

        return service;

        /**
         * Starts the process of loggin in a user using Cordova oAuth
         */
        function login() {
            var deferred = $q.defer();
            document.addEventListener("deviceready", function() {
                if (localStorage.getItem('facebookAccessToken')) {
                    deferred.resolve(true);
                } else {
                    $cordovaOauth.facebook(constants.fbAppId, service.scope, { redirect_uri: "http://localhost/callback" }).then(function(response) {
                        localStorage.setItem('facebookAccessToken', response.access_token);
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
            }, false);
            return deferred.promise;
        }

        /**
         * Gets user information from Facebook API
         *
         * @return     {Promise}  The promise that will resolve the
         *                            user information
         */
        function getUserInfo() {
            var deferred = $q.defer();
            var access_token = localStorage.getItem('facebookAccessToken');
            if (!access_token) {
                deferred.reject();
            } else {
                service.get("https://graph.facebook.com/v2.8/me", {
                    params: {
                        access_token: access_token,
                        fields: "id,name,email, picture",
                        format: 'json'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        }

        /**
         * Removes the Facebook session data
         */
        function logout() {
            localStorage.removeItem('facebookAccessToken');
        }
    }
})();
