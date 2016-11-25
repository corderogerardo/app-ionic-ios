(function() {
    angular.module('axpress')
        .constant('constants', {
            //API base Url
            apiBaseUrl: 'http://52.43.247.174/api_devel',

            //App specific client token/key
            key: '21569d3e6977ae51178544f5dcdd508652799af3.IVadPml3rlEXhUT13N1QhlJ5mvM=',

            //String to identify the App on the Admin Console
            platform: 'iOS',

            //Facebook App ID
            fbAppId: '320049998373400',

            //Google App ID
            googleOAuthClientID: '96059222512-4vm97bgjdolu5i0fe0sg8tl35e85gjdm.apps.googleusercontent.com',

            //Payment Methods
            paymentMethods: [
                { name: 'Tarjeta de Crédito', value: 1 },
                { name: 'Contra-Recogida (Efectivo)', value: 2 },
                { name: 'Contra-Entrega (Efectivo)', value: 3 },
            ],

            //Shipment Statuses
            shipmentStatuses: [
                { name: 'No Asignado', value: 10 },
                { name: 'Asignado', value: 1 },
                //Pending to be confirmed
                { name: 'Recogido', value: 2 },
                { name: 'Entregado', value: 3 },
                { name: 'Cancelado', value: 4 }
            ],
            //Deligences destinies' address maximum
            diligencesMaxDestinies: 5
        });
})();
