(function() {
    angular.module('axpress')
        .factory('Push', PushService);

    PushService.$inject = ['$rootScope', '$q', 'constants'];

    function PushService($rootScope, $q, constants) {
        var service = {
            initialize: initialize,
            clearAllNotifications: clearAllNotifications,
            unsubscribe: unsubscribe
        };

        var push;

        return service;

        function notificationReceived (data) {
            //The app started by clicking the notification
            if (data.additionalData.coldstart) {
                console.log("APP STARTED!");
                console.log(JSON.stringify(data.additionalData));
                switch(data.additionalData.type) {
                    //Courier assigned
                    case 1:
                        onCourierAssigned(data.additionalData.data.shipping_id);
                        break;
                    //Package Picked
                    case 2:
                        onPackagePicked(data.additionalData.data.shipping_id);
                        break;
                    //
                    case 3:
                        onPackageDelivered(data.additionalData.data.shipping_id);
                        break;
                    //
                    case 5:
                        onChatMessageReceived(data.additionalData.data.shipping_id);
                        break;
                    //Default case
                    default:
                        console.log("sandbox push");
                        //onCourierAssigned(1289);
                        break;
                    
                }
            }

            //The app was already running when the notification was received
            if (data.additionalData.foreground) {
                console.log("APP ALREADY RUNNING!");
                console.log(JSON.stringify(data.additionalData));
            }
        }

        function onCourierAssigned (shippingId) {
            $rootScope.$state.go('app.tracking', {shippingId: shippingId});
        }

        function onPackagePicked (shippingId) {
            $rootScope.$state.go('app.tracking', {shippingId: shippingId});
        }

        function onPackageDelivered (shippingId) {
            $rootScope.$state.go('app.rating', {shippingId: shippingId});
        }

        function onChatMessageReceived (shippingId) {
            $rootScope.$state.go('app.chat', {shippingId: shippingId});
        }

        function clearAllNotifications () {
            push.clearAllNotifications(function() {}, function() {});
        }

        function onInit(data) {
            localStorage.setItem('axpress.push.registrationID', data.registrationId);
            push.on('notification', notificationReceived);
        }

        function initialize () {
            //Configure Push Notifications
            var pushOptions = {
                android: {
                    senderID: constants.pushSenderID
                },
                ios: {
                    alert: true,
                    badge: true,
                    sound: true,
                    senderID: constants.pushSenderID,
                }
            };

            document.addEventListener("deviceready", function() {
                push = PushNotification.init(pushOptions);
                push.on('registration', onInit);
            }, false);
        }

        function unsubscribe () {
            push.unsubscribe(function () {}, function () {});
        }
    }
})();
