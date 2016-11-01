(function() {
    angular.module('axpress')
        .factory('logisticResource', logisticResourceService);

    logisticResourceService.$inject = ['$rootScope', '$q', 'Service'];

    function logisticResourceService($rootScope, $q, Service) {
        var service = new Service('/logisticresource');

        //Public Functions
        service.session = session;
        service.updateLocation = updateLocation;
        service.cancelService = cancelService;

        return service;

        /**
         * Validates login
         *
         * @param      {String}   user      The user
         * @param      {String}   password  The password
         * @param      {String}   uuid      The uuid
         * @return     {Promise}  A promise to resolve results
         */
        function session(user, password, uuid) {
            var data = {
                usr: user,
                pass: password,
                uuid: uuid
            };
            return service.apiPost('/session', data);
        }

        /**
         * Updates courier/messenger location
         *
         * @param      {String}  logisticresourceId  The logisticresource identifier
         * @param      {Double}  latitude            The latitude
         * @param      {Double}  longitude           The longitude
         * @return     {Promise}  A promise to resolve results
         */
        function updateLocation(logisticresourceId, latitude, longitude) {
            var data = {
                logisticresource_id: logisticresourceId,
                latitude: latitude,
                longitude: longitude
            };
            return service.apiPost('/updateLocation', data);
        }

        /**
         * Cancels a service request
         *
         * @param      {String}  shippingId  The shipping identifier
         * @return     {Promise}  A promise to resolve results
         */
        function cancelService(shippingId) {
            var data = {
                shipping_id: shippingId
            };
            return service.apiPost('/cancelService', data);
        }
    }
})();
