angular.module('axpress')
.factory('Diligence', DiligenceService);

DiligenceService.$inject = ['$rootScope', '$q', 'Service'];

function DiligenceService ($rootScope, $q, Service){
    var service = new Service('/diligence');

    //Public Functions
    service.quotation = quotation;
    service.post = post;

    return service;

    /**
     * Gets the quotation for a diligence
     *
     * @param      {Integer}        typeServices  The service's type
     * @param      {Boolean}        samepoint     Samepoint (true if roundtrip)
     * @param      {Array[Double]}  diligences    The list of diligences
     * @param      {Double}         latitude      The latitude
     * @param      {Double}         longitude     The longitude
     * @return     {Promise}         A promise to resolve results
     */
    function quotation (typeServices, samepoint, diligences, latitude, longitude) {
        var data = {
            type_services: typeServices,
            samepoint: samepoint,
            diligences: diligences,
            latitude: latitude,
            longitude: longitude
        };
        return service.apiPost('/quotation', data);
    }

    /**
     * Register a service petition for a diligence
     *
     * @param      {String}         clientId         The client identifier
     * @param      {Array[Double]}  diligences       The diligences array
     * @param      {Integer}        typeServices     The service's type
     * @param      {Boolean}        samepoint        Samepoint (true if roundtrip)
     * @param      {String}         descriptionText  The description text
     * @param      {Double}         time             The shipping time
     * @param      {String}         distance         The distance
     * @param      {Integer}        pay              Pay
     * @param      {Double}         amount           The amount
     * @return     {Promise}        A promise to resolve results
     */
    function post (clientId, diligences, typeServices, samepoint, descriptionText, time, distance, pay, amount) {
        var data = {
            client_id: clientId,
            diligences: diligences,
            type_services: typeServices,
            samepoint: samepoint,
            description_text: descriptionText,
            time: time,
            distance: distance,
            pay: pay,
            amount: amount
        };
        return service.apiPost('/post', data);
    }
}