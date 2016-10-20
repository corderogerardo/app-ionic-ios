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