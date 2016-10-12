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