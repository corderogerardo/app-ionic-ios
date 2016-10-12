angular.module('axpress')
.factory('Client', ['constants', '$q', '$http', 'Service', function(constants, $q, $http, Service){
    var service = new Service('/client');

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

    return service;
}]);