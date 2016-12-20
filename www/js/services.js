(function() {
    angular.module('axpress')
        .factory('Chat', ChatService);

    ChatService.$inject = ['$rootScope', '$q', 'Service'];

    function ChatService($rootScope, $q, Service) {
        var service = new Service('/chat');

        //Public Functions
        service.post = post;
        service.history = history;

        return service;

        /**
         * { function_description }
         *
         * @param      {Integer}  shippingId  The shipping identifier
         * @param      {Integer}  sentById    The ID of who's sending the message
         * @param      {Integer}  sentByType  Type of who is sending the message (0 - Client, 1 - Courier)
         * @param      {String}   message     The message
         * @return     {Promise}  A promise to resolve results
         */
        function post(shippingId, sentById, sentByType, message) {
            var data = {
                shipping_id: shippingId,
                sentby_id: sentById,
                sentby_type: sentByType,
                message: message
            };

            return service.apiPost('/post', data);
        }

        /**
         * Gets the message history for a shipping
         *
         * @param      {String}   shippingId  The shipping identifier
         * @return     {Promise}  A promise to resolve results
         */
        function history(shippingId) {
            var data = {
                shipping_id: shippingId
            };
            return service.apiPost('/history', data);
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .factory('Client', Client);

    Client.$inject = ['$rootScope', '$q', '$timeout', 'Service', 'Facebook', 'Google', '$filter'];

    function Client($rootScope, $q, $timeout, Service, Facebook, Google, $filter) {
        var service = new Service('/client');
        service.user = {
            isLoged: false
        };

        /**
         * Logins a user in the system using email and password
         *
         * @param      {String}  email  The user email
         * @param      {String}  password  The user password
         * @return     {Promise}  A promise to resolve server response
         */
        service.login = function(email, password) {
            var data = {
                email: email,
                pass: password,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/login', data);
        };

        /**
         * Logs out the user from the system
         */
        service.logout = function () {
            localStorage.removeItem('axpress.user');
            localStorage.removeItem('axpress.menu');
            localStorage.removeItem('facebookAccessToken');
            localStorage.removeItem('googleCredentials');
            $rootScope.user = {};
            $rootScope.menu = {};
        };

        /**
         * Registers a user account in the system
         *
         * @param      {String}  name    The user name
         * @param      {String}  pass    The user password
         * @param      {String}  email   The user email
         * @return     {Promise}  A promise to resolve server response
         */
        service.register = function(name, pass, email) {
            var data = {
                email: email,
                pass: pass,
                name: name,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/register', data);
        };

        /**
         * Resets a user password
         *
         * @param      {String}  email   The user email
         * @return     {Promise}  A promise to resolve server response
         */
        service.forgotPassword = function(email) {
            var data = {
                email: email
            };
            return service.apiPost('/forgotpassword', data);
        };

        /**
         * Updates user data in the system
         *
         * @param      {String}   client  The user object
         * @return     {Promise}  A promise to resolve server response
         */
        service.edit = function(client) {

            var data = {
                client_id: client.id,
                email: client.email,
                name: client.name,
                pass: service.socialPassword(client.pass),
                new_pass: service.socialPassword(client.newPass),
                movil_phone: client.phone,
                local_phone: client.localPhone,
                identify: client.identify,
            };
            if (client.isSocialAccount) {
                delete data.pass;
                delete data.new_pass;
                data.access_token = client.access_token
            };
            console.log(JSON.stringify(data));
            return service.apiPost('/edit', data);
        };

        /**
         * Starts the login process with Facebook to obtain an Access Token
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.loginWithFacebook = function() {
            var deferred = $q.defer();
            Facebook.login().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Fetchs user basic info such as userFacebookID, email and name
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.facebookGetUserInfo = function() {
            var deferred = $q.defer();
            Facebook.getUserInfo().then(function(response) {
                $timeout(function() {
                    $rootScope.user = service.user = response;
                }, 0);
                deferred.resolve(response);
            }, function(error) {
                //Clean user's facebook credentials
                Facebook.logout();
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Logouts user from Facebook, cleaning session.
         */
        service.facebookLogout = function() {
            Facebook.logout();
            $rootScope.user = service.user = {};
        };

        /**
         * Starts the login process with Google to obtain an Access Token
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.loginWithGoogle = function() {
            var deferred = $q.defer();
            Google.login().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Fetchs user basic info such as user ID, email and name
         *
         * @return     {Promise}  A promise to resolve server response
         */
        service.googleGetUserInfo = function() {
            var deferred = $q.defer();
            Google.getProfile().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                //Clean user's facebook credentials
                Google.logout();
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * Creates a hash used to login user when using a social login
         *
         * @param      {String}  socialId  The user social ID (Google ID, Facebook ID, ...)
         * @return     {String}  The hashed password that will be used to login
         */
        service.socialPassword = function(socialId) {
            return $filter('MD5')( //MD5 Hashed
                btoa(socialId) //Base64 Encoded
                .split('').reverse().join('') //Reversed
            );
        };

        /**
         * Registers a user in the system using Google Login
         *
         * @param      {String}  name      The user name
         * @param      {String}  pass      The user password
         * @param      {String}  email     The user email
         * @param      {String}  googleId  The user Google ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.googleRegister = function(name, pass, email, googleId) {
            var data = {
                email: email,
                pass: pass,
                name: name,
                google_id: googleId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/register', data);
        };

        /**
         * Logins a user in the system using Google Login
         *
         * @param      {String}  email     The user email
         * @param      {String}  pass      The user password
         * @param      {String}  googleId  The user Google ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.googleLogin = function(email, pass, googleId) {
            var data = {
                email: email,
                pass: pass,
                google_id: googleId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/login', data);
        };

        /**
         * Registers a user in the system using Facebook Login
         *
         * @param      {String}  name        The user name
         * @param      {String}  pass        The user password
         * @param      {String}  email       The user email
         * @param      {String}  facebookId  The user Facebook ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.facebookRegister = function(name, pass, email, facebookId) {
            var data = {
                email: email,
                pass: pass,
                name: name,
                facebook_id: facebookId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/register', data);
        };

        /**
         * Logins a user in the system using Facebook Login
         *
         * @param      {String}  email       The user email
         * @param      {String}  pass        The user password
         * @param      {String}  facebookId  The user Facebook ID
         * @return     {Promise}  A promise to resolve server response
         */
        service.facebookLogin = function(email, pass, facebookId) {
            var data = {
                email: email,
                pass: pass,
                facebook_id: facebookId,
                uuid: localStorage.getItem('axpress.push.registrationID')
            };
            return service.apiPost('/login', data);
        };

        return service;
    }
})();
;

(function() {
    angular.module('axpress')
        .factory('CommonService', CommonService);

    CommonService.$inject = ['$rootScope'];

    function CommonService($rootScope) {
        var service = {
            encodeImageUri: encodeImageUri
        };

        return service;

        /**
         * Gets a base64 encoded image from a image uri,
         * using a canvas node
         *
         * @param      {String}  imageUri  The image uri
         * @return     {String}  Base64 encoded image
         */
        function encodeImageUri(imageUri) {
            var c = document.createElement('canvas');
            var ctx = c.getContext("2d");
            var img = new Image();
            img.onload = function() {
                c.width = this.width;
                c.height = this.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = imageUri;
            var dataURL = c.toDataURL("image/jpeg");
            return dataURL;
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .constant('constants', {
            //API base Url
            apiBaseUrl: 'http://52.43.247.174/api_devel',

            //App specific client token/key
            key: '21569d3e6977ae51178544f5dcdd508652799af3.IVadPml3rlEXhUT13N1QhlJ5mvM=',

            //String to identify the App on the Admin Console
            platform: 'android',

            //Facebook App ID
            fbAppId: '320049998373400',

            //Google App ID
            googleOAuthClientID: '96059222512-4vm97bgjdolu5i0fe0sg8tl35e85gjdm.apps.googleusercontent.com',

            //Push Sender ID
            pushSenderID: '1068552996185',

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
                { name: 'Recogido', value: 2 },
                { name: 'Entregado', value: 3 },
                { name: 'Cancelado', value: 4 }
            ],
            //Deligences destinies' address maximum
            diligencesMaxDestinies: 5
        });
})();
;

(function() {
    angular.module('axpress')
        .factory('DeliveryVerification', DeliveryVerificationService);

    DeliveryVerificationService.$inject = ['$rootScope', '$q', 'Service'];

    function DeliveryVerificationService($rootScope, $q, Service) {
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
        function post(shippingId, logisticresourceId, status, description) {
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
        function history(courierId) {
            var data = {
                courier_id: courierId
            };
            return service.apiPost('/history', data);
        }
    }
})();
;

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
;

(function() {
    angular.module('axpress')
        .factory('Facebook', Facebook);

    Facebook.$inject = ['$rootScope', '$q', 'Service', '$window', '$cordovaOauth', 'constants'];

    function Facebook($rootScope, $q, Service, $window, $cordovaOauth, constants) {
        var service = new Service();
        service.scope = ['email', 'public_profile'];

        //Public methods
        service.login = login;
        service.getUserInfo = getUserInfo;
        service.logout = logout;

        return service;

        /**
         * Starts the process of loggin in a user using Cordova oAuth
         */
        function login() {
            var deferred = $q.defer();
            document.addEventListener("deviceready", function() {
                if (service.access_token || localStorage.getItem('facebookAccessToken')) {
                    deferred.resolve(true);
                } else {
                    $cordovaOauth.facebook(constants.fbAppId, service.scope, { redirect_uri: "http://localhost/callback" }).then(function(response) {
                        service.access_token = response.access_token;
                        localStorage.setItem('facebookAccessToken', response.access_token);
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
            }, false);
            return deferred.promise;
        }

        /**
         * Gets user information from Facebook API
         * 
         * @return     {Promise}  The promise that will resolve the
         *                            user information
         */
        function getUserInfo() {
            var deferred = $q.defer();
            var access_token = service.access_token || localStorage.getItem('facebookAccessToken');
            if (!access_token) {
                deferred.reject();
            } else {
                service.get("https://graph.facebook.com/v2.8/me", {
                    params: {
                        access_token: access_token,
                        fields: "id,name,email, picture",
                        format: 'json'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        }

        /**
         * Removes the Facebook session data
         */
        function logout() {
            delete service.access_token;
            localStorage.removeItem('facebookAccessToken');
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .factory('GoogleMapGeocoder', GoogleMapGeocoder);

    GoogleMapGeocoder.$inject = ['$rootScope', '$q'];

    function GoogleMapGeocoder($rootScope, $q) {
        var service = {};
        service.geocoder = new google.maps.Geocoder;

        service.reverseGeocode = reverseGeocode;
        service.removeStateAndCountry = removeStateAndCountry;

        return service;

        /**
         * Executes the reverse geocoding proccess using Google Maps Geocoder
         * @param latlng {Object] an object containing lat and lng values to proccess
         * @return {Promise} a promise that will resolve the results given by geocoder.
         */
        function reverseGeocode(latlng) {
            var deferred = $q.defer();

            service.geocoder.geocode({location:latlng, region: 'co'}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    deferred.resolve(results);
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }

        function removeStateAndCountry (formattedAddress) {
            return formattedAddress.replace(/, [A-zÀ-ÿ]+, [Cc]olombia$/, "");
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .factory('Google', Google);

    Google.$inject = ['$rootScope', '$window', '$cordovaOauth', '$q', 'Service', 'constants'];

    function Google($rootScope, $window, $cordovaOauth, $q, Service, constants) {
        var service = new Service();
        service.scope = ['profile', 'email'];

        service.login = login;
        service.getProfile = getProfile;
        service.logout = logout;

        return service;

        /**
         * Starts the process of loggin in a user using Cordova oAuth
         */
        function login() {
            var deferred = $q.defer();
            document.addEventListener("deviceready", function() {
                if (service.credentials || localStorage.getItem('googleCredentials')) {
                    deferred.resolve(true);
                } else {
                    $cordovaOauth.google(constants.googleOAuthClientID, service.scope).then(function(response) {
                        service.credentials = response;
                        localStorage.setItem('googleCredentials', JSON.stringify(response));
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
            }, false);
            return deferred.promise;
        }

        /**
         * Gets user information from Google API
         * 
         * @return     {Promise}  The promise that will resolve the
         *                            user information
         */
        function getProfile() {
            var deferred = $q.defer();
            var credentials = service.credentials || JSON.parse(localStorage.getItem('googleCredentials'));
            if (!credentials) {
                deferred.reject();
            } else {
                service.get("https://www.googleapis.com/userinfo/v2/me", { params: { access_token: credentials.access_token } }).then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        }

        /**
         * Removes the Google session data
         */
        function logout() {
            delete service.credentials;
            localStorage.removeItem('googleCredentials');
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .factory('Location', Location);

    Location.$inject = ['$q', '$cordovaGeolocation'];

    function Location($q, $cordovaGeolocation) {
        var service = {};

        service.options = { timeout: 10000, maximumAge: (5*60*1000), enableHighAccuracy: false };

        service.getCurrentPosition = getCurrentPosition;
        return service;

        /**
         * Gets the current user location using device sensors
         *
         * @param options {Object} Optional set of options to use when fetching location
         */
        function getCurrentPosition(options) {
            var deferred = $q.defer();
            var locOptions = options || service.options;
            document.addEventListener("deviceready", function() {
                $cordovaGeolocation
                    .getCurrentPosition(locOptions)
                    .then(function(position) {
                        var loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                        deferred.resolve(loc);
                    }, function(err) {
                        deferred.reject(err);
                    });
            }, false);
            return deferred.promise;
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .service('Logger', Logger);

    Logger.$inject = ['$ionicPopup', '$cordovaToast', '$cordovaProgress'];

    function Logger($ionicPopup, $cordovaToast, $cordovaProgress) {
        return {
            alert: alert,
            error: error,
            toast: toast,

            displayProgressBar: displayProgressBar,
            hideProgressBar: hideProgressBar
        };

        /**
         * $ionicPopup alert wrapper
         *
         * @param      {String}  title   The title
         * @param      {String}  body    The body (can be html tags)
         */
        function alert(title, body) {
            $ionicPopup.alert({ title: title, template: body });
        }

        /**
         * $ionicPopup alert wrapper with fixed title to send error messages
         *
         * @param      {String}  body    The body (can be html tags)
         */
        function error(body) {
            $ionicPopup.alert({ title: 'Ha ocurrido un error', template: body });
        }

        function toast (message, duration, position) {
            $cordovaToast.show(message, duration || 'short', position || 'bottom');
        }

        function displayProgressBar () {
            $cordovaProgress.showSimple(true);
        }

        function hideProgressBar () {
            $cordovaProgress.hide();
        }
    }
})();
;

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
        service.getLocation = getLocation;

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
         * Gets the logistic resource location.
         *
         * @param      {Integer}  logisticresourceId  The logisticresource identifier
         * @return     {Promise}  A promise to resolve results
         */
        function getLocation(logisticresourceId) {
            var data = {
                logisticresource_id: logisticresourceId
            };
            return service.apiPost('/getLocation', data);
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
;

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
;

(function() {
    angular.module('axpress')
        .factory('Rating', RatingService);

    RatingService.$inject = ['$rootScope', '$q', 'Service'];

    function RatingService($rootScope, $q, Service) {
        var service = new Service('/rating');

        //Public Functions
        service.post = post;

        return service;

        /**
         * Registers a service rating
         *
         * @param      {Integer}   shippingId   The shipping identifier
         * @param      {Integer}   rating       The rating
         * @param      {String}    description  The description
         * 
         * @return     {Promise}  A promise to resolve results
         */
        function post(shippingId, rating, description) {
            var data = {
                shipping_id: shippingId,
                rating: rating,
                description: description
            };

            return service.apiPost('/post', data);
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .factory('Service', Service);

    Service.$inject = ['$http', 'constants', '$q', '$httpParamSerializerJQLike'];

    function Service($http, constants, $q, $httpParamSerializerJQLike) {

        /**
         * Class to be instantiated as a base service with common configurations
         *
         * @class      Service (name)
         * @param      {String}  urlSufix  The url sufix of the service
         */
        var Service = function(urlSufix) {
            this.url = constants.apiBaseUrl;
            this.urlSufix = urlSufix || '';
            this.key = constants.key;
            this.platform = constants.platform;

            /**
             * Returns full base path url, useful when using services with common api path
             * Just needs to add remaining part of api path for specific service query
             *
             * @return     {String}  Full base path to service
             */
            this.urlBase = function() {
                return this.url + this.urlSufix;
            };

            /**
             * Reusable function to make POST queries and consume POST services
             *
             * @param      {String}  path     The path specific to the service
             * @param      {Object}  data     The data to be sent using the service (Optional)
             * @param      {Object}  options  The $http options for the service (Optional)
             * @return     {Promise}  Returns the $http promise to be resolved on success or error
             */
            this.httpPost = function(path, data, options) {
                data = data || {};
                options = options || {};
                var deferred = $q.defer();
                $http.post(path, data, options)
                    .then(function(response) {
                        deferred.resolve(response.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            /**
             * Function that wraps Service.httpPost to consume the backend api
             *
             * @param      {String}  path     The path specific to the api service (/client/login)
             * @param      {Object}  data     The data to be sent using the service (Optional)
             * @param      {Object}  options  The $http options for the service (Optional)
             * @return     {Promise}  Returns the $http promise to be resolved on success or error
             */
            this.apiPost = function(path, data, options) {
                data = data || {};
                options = options || {};
                data.key = this.key;
                data.platform = this.platform;
                options.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
                path = this.urlBase() + path;
                data = this.formEncodeParams(data);
                return this.httpPost(path, data, options);
            };

            /**
             * Reusable function to make GET queries and consume GET services
             *
             * @param      {String}   path     The path specific to the service
             * @param      {Object}   options  The $http options for the service
             *                                 (Optional)
             * @return     {Promise}  Returns the $http promise to be resolved on
             *                        success or error
             */
            this.get = function(path, options) {
                var deferred = $q.defer();
                $http.get(path, options || {}).then(function(response) {
                    deferred.resolve(response.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            this.formEncodeParams = function (params) {
                return $httpParamSerializerJQLike(params);
            };
        };
        return Service;
    }
})();
;

(function () {
    angular.module('axpress')
    .factory('Shipping', Shipping);

    Shipping.$inject = ['$rootScope', '$q', 'Service'];

    function Shipping ($rootScope, $q, Service) {
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
        function history (clientId) {
            return service.apiPost('/history', {client_id: clientId});
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
         * @param      {Double}   longitude               The longitude
         * @param      {String}   picture                 The picture
         * @param      {String}   contentPack             The content pack
         * @param      {String}   originDetail            The origin detail
         * @param      {String}   destinyDetail           The destiny detail
         * @param      {String}   tip                     The tip
         * @return     {Promise}  A promise object that will resolve the petition
         */
        function register (descriptionText, numberPieces, distance, originClient, originAddress,
            originLatitude, originLongitude, destinyAddress, destinyLatitude, destinyLongitude,
            amount, amountDeclared, typeServices, pay, time, bagId, destinyClient, destinyName,
            cellphoneDestinyClient, emailDestinyClient,
            //Optional Parameters
            width, height, longitude, picture, contentPack, originDetail, destinyDetail, tip) {

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
                longitude: longitude,
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

        /**
         * Wrapper of register function to simplify the register a document service request
         *
         * @param      {Object}   doc     The document
         * @param      {Object}   user    The user
         * @return     {Promise}  A promise object that will resolve the petition
         */
        function registerDocument (doc, user) {
            return register (doc.descriptionText, 1, doc.distance, user.id, doc.originAddress, doc.originLatitude,
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

