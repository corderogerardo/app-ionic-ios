(function() {
    angular.module('axpress')
        .factory('Client', Client);

    Client.$inject = ['$rootScope', '$q', '$timeout', 'Service', 'Facebook', 'Google', '$filter'];

    function Client($rootScope, $q, $timeout, Service, Facebook, Google, $filter) {
        var service = new Service('/client');
        service.user = {
            isLoged: false
        };

        /**
         * Logins a user in the system using email and password
         *
         * @param      {String}  email  The user email
         * @param      {String}  password  The user password
         * @return     {Promise}  A promise to resolve server response
         */
        service.login = function(email, password) {
            var data = {
                email: email,
                pass: password,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/login', data);
        };

        /**
         * Logs out the user from the system
         */
        service.logout = function () {
            localStorage.removeItem('axpress.user');
            localStorage.removeItem('axpress.menu');
            localStorage.removeItem('facebookAccessToken');
            localStorage.removeItem('googleCredentials');
        };

        /**
         * Registers a user account in the system
         *
         * @param      {String}  name    The user name
         * @param      {String}  pass    The user password
         * @param      {String}  email   The user email
         * @return     {Promise}  A promise to resolve server response
         */
        service.register = function(name, pass, email) {
            var data = {
                email: email,
                pass: pass,
                name: name,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/register', data);
        };

        /**
         * Resets a user password
         *
         * @param      {String}  email   The user email
         * @return     {Promise}  A promise to resolve server response
         */
        service.forgotPassword = function(email) {
            var data = {
                email: email
            };
            return service.apiPost('/forgotpassword', data);
        };

        /**
         * Updates user data in the system
         *
         * @param      {String}  clientId    The user identifier
         * @param      {String}  email       The user email
         * @param      {String}  name        The user name
         * @param      {String}  password    The user password
         * @param      {String}  movilPhone  The user movil phone
         * @param      {String}  localPhone  The user local phone
         * @param      {String}  identify    The user national ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.edit = function(clientId, email, name, password, movilPhone, localPhone, identify) {
            var data = {
                client_id: clientId,
                email: email,
                name: name,
                pass: password,
                movil_phone: movilPhone,
                local_phone: localPhone,
                identify: identify
            };
            return service.apiPost('/edit', data);
        };

        /**
         * Starts the login process with Facebook to obtain an Access Token
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.loginWithFacebook = function() {
            var deferred = $q.defer();
            Facebook.login().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Fetchs user basic info such as userFacebookID, email and name
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.facebookGetUserInfo = function() {
            var deferred = $q.defer();
            Facebook.getUserInfo().then(function(response) {
                $timeout(function() {
                    $rootScope.user = service.user = response;
                }, 0);
                deferred.resolve(response);
            }, function(error) {
                //Clean user's facebook credentials
                Facebook.logout();
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Logouts user from Facebook, cleaning session.
         */
        service.facebookLogout = function() {
            Facebook.logout();
            $rootScope.user = service.user = {};
        };

        /**
         * Starts the login process with Google to obtain an Access Token
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.loginWithGoogle = function() {
            var deferred = $q.defer();
            Google.login().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Fetchs user basic info such as user ID, email and name
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.googleGetUserInfo = function() {
            var deferred = $q.defer();
            Google.getProfile().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                //Clean user's facebook credentials
                Google.logout();
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Creates a hash used to login user when using a social login
         *
         * @param      {String}  socialId  The user social ID (Google ID, Facebook ID, ...)
         * @return     {String}  The hashed password that will be used to login
         */
        service.socialPassword = function(socialId) {
            return $filter('MD5')( //MD5 Hashed
                btoa(socialId) //Base64 Encoded
                .split('').reverse().join('') //Reversed
            );
        };

        /**
         * Registers a user in the system using Google Login
         *
         * @param      {String}  name      The user name
         * @param      {String}  pass      The user password
         * @param      {String}  email     The user email
         * @param      {String}  googleId  The user Google ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.googleRegister = function(name, pass, email, googleId) {
            var data = {
                email: email,
                pass: pass,
                name: name,
                google_id: googleId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/register', data);
        };

        /**
         * Logins a user in the system using Google Login
         *
         * @param      {String}  email     The user email
         * @param      {String}  pass      The user password
         * @param      {String}  googleId  The user Google ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.googleLogin = function(email, pass, googleId) {
            var data = {
                email: email,
                pass: pass,
                google_id: googleId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/login', data);
        };

        /**
         * Registers a user in the system using Facebook Login
         *
         * @param      {String}  name        The user name
         * @param      {String}  pass        The user password
         * @param      {String}  email       The user email
         * @param      {String}  facebookId  The user Facebook ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.facebookRegister = function(name, pass, email, facebookId) {
            var data = {
                email: email,
                pass: pass,
                name: name,
                facebook_id: facebookId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/register', data);
        };

        /**
         * Logins a user in the system using Facebook Login
         *
         * @param      {String}  email       The user email
         * @param      {String}  pass        The user password
         * @param      {String}  facebookId  The user Facebook ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.facebookLogin = function(email, pass, facebookId) {
            var data = {
                email: email,
                pass: pass,
                facebook_id: facebookId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/login', data);
        };

        return service;
    }
})();
