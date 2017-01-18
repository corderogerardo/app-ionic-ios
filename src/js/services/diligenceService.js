(function() {
    angular.module('axpress')
        .factory('Diligence', DiligenceService);

    DiligenceService.$inject = ['$rootScope', '$q', 'Service'];

    function DiligenceService($rootScope, $q, Service) {
        var service = new Service('/diligence');

        //Public Functions
        service.quotation = quotation;
        service.post = post;

        return service;

        /**
         * Gets the quotation for a diligence
         *
         * @param      {Integer}        typeService  The service's type
         * @param      {Boolean}        samepoint     Samepoint (true if roundtrip)
         * @param      {Array[Object]}  diligences    The list of diligences
         * @param      {Double}         latitude      The latitude
         * @param      {Double}         longitude     The longitude
         * @return     {Promise}         A promise to resolve results
         */
        function quotation(typeService, samepoint, diligences, latitude, longitude) {
            var data = {
                type_service: typeService,
                samepoint: (samepoint ? true : false),
                diligences: diligences,
                latitude: latitude,
                longitude: longitude
            };
            data.key = service.key;
            data.platform = service.platform;
            return service.httpPost(service.urlBase() + '/quotation', data);
        }

        /**
         * Register a service petition for a diligence
         *
         * @param      {String}         clientId         The client identifier
         * @param      {Array[Double]}  diligences       The diligences array
         * @param      {Integer}        typeService     The service's type
         * @param      {Boolean}        samepoint        Samepoint (true if roundtrip)
         * @param      {String}         descriptionText  The description text
         * @param      {String}         distance         The distance
         * @param      {Integer}        pay              Pay
         * @param      {Double}         amount           The amount
         * @return     {Promise}        A promise to resolve results
         */
        function post(clientId, diligences, typeService, samepoint, descriptionText, distance, pay, amount) {
            var data = {
                client_id: clientId,
                diligences: diligences,
                type_service: typeService,
                samepoint: samepoint,
                description_text: descriptionText,
                time: new Date().valueOf(),
                distance: distance,
                pay: pay,
                amount: amount
            };
            data.key = service.key;
            data.platform = service.platform;
            return service.httpPost(service.urlBase() + '/post', data);
        }
    }
})();
