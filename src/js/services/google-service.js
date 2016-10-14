angular.module('axpress')
.factory('Google', ['$rootScope', '$window', 'Service', 'constants', function($rootScope, $window, Service, constants){
    var service = new Service();
    var GoogleAuth = undefined;

    service.loadGoogleSDK = loadGoogleSDK;
    service.login = login;

    $window.onLoadGoogle = function () {
        gapi.load('auth2', function () {
            GoogleAuth = gapi.auth2.init({
                client_id:constants.googleOAuthClientID,
                scope: 'profile email'
            });
        });
    };

    return service;

    function loadGoogleSDK (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id; js.async = true; js.defer = true;
            js.src = "//apis.google.com/js/platform.js?onload=onLoadGoogle";
            fjs.parentNode.insertBefore(js, fjs);
    }

    function login (options) {
        options = options || {
            scope: 'profile email'
        };
        GoogleAuth.signIn(options).then(function (user) {
            console.log("sign in resolved...");
            console.log(user);
        }, function (error) {
            console.log("signIn error...");
            console.log(error);
        });
    }


}]);