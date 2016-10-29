angular.module('axpress')
.factory('Shipping', ['$rootScope', '$q', 'Service',
function($rootScope, $q, Service){
    var service = new Service('/shipping');

    //Public functions
    service.history = history;
    service.register = register;
    service.quotation = quotation;

    return service;

    /**
     * Gets the client's history
     *
     * @param      {String}  clientId  The client identifier
     * @return     {Promise}  promise A promise that will resolve the petition
     */
    function history (clientId) {
        return service.apiPost('/history', {client_id: clientId});
    }

    /**
     * { function_description }
     *
     * @param      {String}   descriptionText         The description text
     * @param      {Integer}  numberPieces            The number pieces
     * @param      {String}   distance                The distance
     * @param      {String}   originClient            The origin client
     * @param      {String}   originAddress           The origin address
     * @param      {Double}   originLatitude          The origin latitude
     * @param      {Double}   originLongitude         The origin longitude
     * @param      {String}   destinyAddress          The destiny address
     * @param      {Double}   destinyLatitude         The destiny latitude
     * @param      {Double}   destinyLongitude        The destiny longitude
     * @param      {Double}   amount                  The amount
     * @param      {Double}   amountDeclared          The amount declared
     * @param      {Integer}  typeServices            The service's type
     * @param      {Integer}  pay                     The pay
     * @param      {Double}   time                    The time
     * @param      {Double}   width                   The width
     * @param      {Double}   height                  The height
     * @param      {Double}   longitude               The longitude
     * @param      {Integer}  destinyClient           The destiny client
     * @param      {String}   destinyName             The destiny name
     * @param      {String}   picture                 The picture
     * @param      {String}   contentPack             The content pack
     * @param      {String}   cellphoneDestinyClient  The destiny client cellphone
     * @param      {String}   emailDestinyClient      The destiny client email
     * @param      {Integer}  bagId                   The bag identifier
     * @param      {String}   originDetail            The origin detail
     * @param      {String}   destinyDetail           The destiny detail
     * @param      {String}   tip                     The tip
     * @return     {Promise}  A promise object that will resolve the petition
     */
    function register (descriptionText, numberPieces, distance, originClient, originAddress,
        originLatitude, originLongitude, destinyAddress, destinyLatitude, destinyLongitude,
        amount, amountDeclared, typeServices, pay, time,
        //Optional Parameters
        width, height, longitude, destinyClient, destinyName, picture, contentPack,
        cellphoneDestinyClient, emailDestinyClient, bagId, originDetail, destinyDetail, tip) {

        //We pack params in an object
        var data = {
            description_text: descriptionText,
            number_pieces: numberPieces,
            distance: distance,
            origin_client: originClient,
            origin_address: originAddress,
            origin_latitude: originLatitude,
            origin_longitude: originLongitude,
            destiny_address: destinyAddress,
            destiny_latitude: destinyLatitude,
            destiny_longitude: destinyLongitude,
            amount: amount,
            amountDeclared: amountDeclared,
            type_service: typeServices,
            pay: pay,
            time: time,
            //Optional Params
            width: width,
            height: height,
            longitude: longitude,
            destiny_client: destinyClient,
            destiny_name: destinyName,
            picture: picture,
            content_pack: contentPack,
            cellphone_destiny_client: cellphoneDestinyClient,
            email_destiny_client: emailDestinyClient,
            bag_id: bagId,
            origin_detail: originDetail,
            destiny_detail: destinyDetail,
            tip: tip
        };

        return service.apiPost('/post', data);
    }

    /**
     * { function_description }
     *
     * @param      {Double}  originLatitude    The origin latitude
     * @param      {Double}  originLongitude   The origin longitude
     * @param      {Double}  destinyLatitude   The destiny latitude
     * @param      {Double}  destinyLongitude  The destiny longitude
     * @param      {Integer}  typeService     The service's process(Documentos,Paquetes,Diligencias)
     * @param      {Integer}  bagId     The service's type
     * @return     {Promise}  A promise object that will resolve the petition
     */
    function quotation (originLatitude, originLongitude, destinyLatitude, destinyLongitude, typeService, bagId) {
        var data = {
            origin_latitude: originLatitude,
            origin_longitude: originLongitude,
            destiny_latitude: destinyLatitude,
            destiny_longitude: destinyLongitude,
            type_service: typeService,
            bag_id:bagId
        };
        return service.apiPost('/quotation', data);
    }

}]);
