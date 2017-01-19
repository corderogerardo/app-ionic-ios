(function() {
    angular.module('axpress')
        .factory('Shipping', Shipping);

    Shipping.$inject = ['$rootScope', '$q', 'Service'];

    function Shipping($rootScope, $q, Service) {
        var service = new Service('/shipping');

        //Public functions
        service.history = history;
        service.register = register;
        service.quotation = quotation;
        service.registerDocument = registerDocument;
        service.registerPackage = registerPackage;

        return service;

        /**
         * Gets the client's history
         *
         * @param      {String}  clientId  The client identifier
         * @return     {Promise}  promise A promise that will resolve the petition
         */
        function history(clientId) {
            return service.apiPost('/history', { client_id: clientId });
        }

        /**
         * Registers a service petition
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
         * @param      {Integer}  bagId                   The bag identifier
         * @param      {Integer}  destinyClient           The destiny client
         * @param      {String}   destinyName             The destiny name
         * @param      {String}   cellphoneDestinyClient  The destiny client cellphone
         * @param      {String}   emailDestinyClient      The destiny client email
         * @param      {Double}   width                   The width
         * @param      {Double}   height                  The height
         * @param      {Double}   long               The long
         * @param      {String}   picture                 The picture
         * @param      {String}   contentPack             The content pack
         * @param      {String}   originDetail            The origin detail
         * @param      {String}   destinyDetail           The destiny detail
         * @param      {String}   tip                     The tip
         * @return     {Promise}  A promise object that will resolve the petition
         */
        function register(descriptionText, numberPieces, distance, originClient, originAddress,
            originLatitude, originLongitude, destinyAddress, destinyLatitude, destinyLongitude,
            amount, amountDeclared, typeServices, pay, time, bagId, destinyClient, destinyName,
            cellphoneDestinyClient, emailDestinyClient,
            //Optional Parameters
            width, height, long, picture, contentPack, originDetail, destinyDetail, tip) {

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
                //amount_declared: amountDeclared,
                type_service: typeServices,
                pay: pay,
                time: time,
                bag_id: bagId,
                //destiny_client: destinyClient,
                destiny_name: destinyName,
                cellphone_destiny_client: cellphoneDestinyClient,
                email_destiny_client: emailDestinyClient,
                //Optional Params
                width: width,
                height: height,
                long: long,
                picture: picture,
                content_pack: contentPack,
                origin_detail: originDetail,
                destiny_detail: destinyDetail,
                tip: tip
            };

            return service.apiPost('/post', data);
        }

        /**
         * Request a quoatation given some coordinates and a type of service and the bag id
         *
         * @param      {Double}  originLatitude    The origin latitude
         * @param      {Double}  originLongitude   The origin longitude
         * @param      {Double}  destinyLatitude   The destiny latitude
         * @param      {Double}  destinyLongitude  The destiny longitude
         * @param      {Integer}  typeService     The service's process(Documentos,Paquetes,Diligencias)
         * @param      {Integer}  bagId     The service's type
         * @return     {Promise}  A promise object that will resolve the petition
         */
        function quotation(originLatitude, originLongitude, destinyLatitude, destinyLongitude, typeService, bagId) {
            var data = {
                origin_latitude: originLatitude,
                origin_longitude: originLongitude,
                destiny_latitude: destinyLatitude,
                destiny_longitude: destinyLongitude,
                type_service: typeService,
                bag_id: bagId
            };
            return service.apiPost('/quotation', data);
        }

        /**
         * Wrapper of register function to simplify the register a document service request
         *
         * @param      {Object}   doc     The document
         * @param      {Object}   user    The user
         * @return     {Promise}  A promise object that will resolve the petition
         */
        function registerDocument(doc, user) {
            return register(doc.descriptionText, 1, doc.distance, user.id, doc.originAddress, doc.originLatitude,
                doc.originLongitude, doc.destinyAddress, doc.destinyLatitude, doc.destinyLongitude, doc.amount,
                doc.amountDeclared, doc.typeServices, doc.pay, new Date().valueOf(), doc.bagId, doc.destinyClient,
                doc.destinyName, doc.cellphoneDestinyClient, doc.emailDestinyClient,
                undefined, undefined, undefined, doc.picture, undefined,
                doc.originDetail, doc.destinyDetail);
        }

        function registerPackage(pack, user) {
            return register(pack.descriptionText, 1, pack.distance, user.id, pack.originAddress, pack.originLatitude,
                pack.originLongitude, pack.destinyAddress, pack.destinyLatitude, pack.destinyLongitude, pack.amount,
                pack.amountDeclared, pack.typeServices, pack.pay, new Date().valueOf(), pack.bagId, pack.destinyClient,
                pack.destinyName, pack.cellphoneDestinyClient, pack.emailDestinyClient,
                pack.width, pack.height, pack.longitude, pack.picture, undefined,
                pack.originDetail, pack.destinyDetail);
        }
    }
})();
