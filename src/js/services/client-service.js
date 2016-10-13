angular.module('axpress')
.factory('Client', ['constants', '$q', '$http', function(constants, $q, $http){
    var api = constants.apiBaseUrl + '/client';
    var service = {};

    service.login = function (username, password) {
        var deferred = $q.defer();
        var data = {
            email: username,
            pass: password,
            key: constants.key,
            platform: constants.platform
        };
        $http.post(api + '/login', data, {})
        .then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        });
    };

    return service;
}]);