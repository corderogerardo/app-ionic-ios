(function() {
    angular.module('axpress')
        .factory('Push', PushService);

    PushService.$inject = ['$rootScope', '$q', 'constants', '$cordovaPushV5'];

    function PushService($rootScope, $q, constants, $cordovaPushV5) {
        var service = {
            initialize: initialize
        };

        return service;

        function pushReceived (event, notification) {
            console.log("-----------PUSH----------------");
            console.log(JSON.stringify(event));
            console.log(JSON.stringify(notification));
        }

        function listenForEvent () {
            $rootScope.$on('$cordovaPushV5:notificationReceived', pushReceived);
            $rootScope.$on('$cordovaPush:notificationReceived', pushReceived);
            $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
                console.log("PUSH error");
            });

            $rootScope.$on('pushNotificationReceived', function (event, notification) {
                console.log("pushNotificationReceived");
            });
        }

        function initialize () {
            //Configure Push Notifications
            var pushOptions = {
                android: {
                    senderID: constants.pushSenderID
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                }
            };

            if (!localStorage.getItem('axpress.push.registrationID')) {
                document.addEventListener("deviceready", function() {
                    $cordovaPushV5.initialize(pushOptions)
                        .then(function () {
                            // start listening for new notifications
                            $cordovaPushV5.onNotification();
                            // start listening for errors
                            $cordovaPushV5.onError();

                            $cordovaPushV5.register().then(function(registrationId) {
                                localStorage.setItem('axpress.push.registrationID', registrationId);
                            });
                        });
                }, false);
            }
            listenForEvent();
        }
    }
})();
