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
}]);;

angular.module('axpress')
.constant('constants', {
    apiBaseUrl: 'http://52.43.247.174/api_devel',
    key: '21569d3e6977ae51178544f5dcdd508652799af3.IVadPml3rlEXhUT13N1QhlJ5mvM=',
    platform: 'iOS Hybrid'
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