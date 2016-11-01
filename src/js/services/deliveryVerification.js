angular.module('axpress')
.factory('DeliveryVerification', DeliveryVerificationService);

DeliveryVerificationService.$inject = ['$rootScope', '$q', 'Service'];

function DeliveryVerificationService ($rootScope, $q, Service){
    var service = new Service('/deliveryverification');

    //Public Functions
    service.post = post;
    service.history = history;

    return service;

    /**
     * Registers a service rating
     *
     * @param      {Integer}   shippingId          The shipping identifier
     * @param      {String}    logisticresourceId  The messenger identifier
     * @param      {Integer}   status              The status
     * @param      {String}    description         The description
     * @return     {Promise}   A promise to resolve results
     */
    function post (shippingId, logisticresourceId, status, description) {
        var data = {
            shipping_id: shippingId,
            logisticresource_id: logisticresourceId,
            status: status,
            description: description
        };
        return service.apiPost('/post', data);
    }

    /**
     * Gets a messenger/courier message history
     *
     * @param      {String}  courierId  The courier identifier
     * @return     {Promise}  A promise to resolve results
     */
    function history (courierId) {
        var data = {
            courier_id: courierId
        };
        return service.apiPost('/history', data);
    }
}