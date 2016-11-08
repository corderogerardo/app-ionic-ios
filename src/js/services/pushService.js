(function() {
    angular.module('axpress')
        .factory('Push', PushService);

    PushService.$inject = ['$rootScope', '$q', 'constants', '$cordovaPushV5'];

    function PushService($rootScope, $q, constants, $cordovaPushV5) {
        var service = {
            initialize: initialize
        };

        return service;

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

            console.log(localStorage.getItem('axpress.push.registrationID'));

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
        }
    }
})();
