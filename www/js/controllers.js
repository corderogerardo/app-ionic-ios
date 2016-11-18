(function() {
    angular.module('axpress')
        .controller("AccountController", AccountController);

    AccountController.$inject = ['$scope', '$rootScope', 'Client'];

    function AccountController($scope, $rootScope, Client) {
        activate();

        function activate() {
            $scope.user = $rootScope.user;
        }

        $scope.doAccountUpdate = function(accountForm) {
            if (accountForm.$valid) {
                Client.edit($scope.user.id, $scope.user.email, $scope.user.name, $scope.user.pass, $scope.user.phone,
                        $scope.user.localPhone, $scope.user.identify)
                    .then(function(response) {
                        if (response.return && response.status == 200)
                            successfullyUpdatedAccount();
                    }, function(error) {
                        //Couldn update user data
                    });
            }
        };

        /**
         * Receives the user updated data from the server
         */
        function successfullyUpdatedAccount () {
            localStorage.setItem('axpress.user', JSON.stringify($scope.user));
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$rootScope', 'Client', 'Logger', '$state'];

    function AuthController($scope, $rootScope, Client, Logger, $state) {
        activate();

        function activate() {
            $scope.focusedLogin = false;
            $scope.focusedLoginPass = false;
            $scope.focusedForgot = false;
            $scope.focusedRegisterName = false;
            $scope.focusedRegisterPass = false;
            $scope.focusedRegisterEmail = false;

            $scope.user = {};
            if (localStorage.getItem('axpress.user') && localStorage.getItem('axpress.menu')) {
                $rootScope.user = JSON.parse(localStorage.getItem('axpress.user'));
                $rootScope.menu = JSON.parse(localStorage.getItem('axpress.menu'));
                $state.go('menu');
            }
        }

        /**
         * Logins a user in the system using the nomal user/password method
         */
        $scope.login = function() {
            Client.login($scope.user.email, $scope.user.password)
                .then(function(response) {
                    //User/Pass do not match
                    if (response.status == 409) {
                        Logger.alert('Usuario o Contraseña no coinciden', response.message);
                    }
                    //Login successfull
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    }
                }, function(error) {
                    Logger.alert('badResponse', JSON.stringify(error));
                });
        };

        /**
         * Handles the logic of oAuth prompt, getting user info and retrying if failure
         *
         * @param      {Function}  successCallback  The callback to use on success
         */
        function googleGetUserInfo(successCallback) {
            Client.loginWithGoogle().then(function(response) {
                Client.googleGetUserInfo().then(function(response) {
                    successCallback(response);
                }, function(error) {
                    // If there's an error fetching user details, credentials are removed
                    // and we have to login again
                    Client.loginWithGoogle().then(function(response) {
                        Client.googleGetUserInfo().then(function(response) {
                            successCallback(response);
                        });
                    });
                });
            });
        }

        /**
         * Handles the logic of oAuth prompt, getting user info and retrying if failure
         *
         * @param      {Function}  successCallback  The callback to use on success
         */
        function facebookGetUserInfo(successCallback) {
            Client.loginWithFacebook().then(function() {
                Client.facebookGetUserInfo().then(function(response) {
                    successCallback(response);
                }, function(error) {
                    // If there's an error fetching user details, access token it's removed
                    // and we have to login again
                    Client.loginWithFacebook().then(function(response) {
                        Client.facebookGetUserInfo().then(function(response) {
                            successCallback(response);
                        });
                    });
                });
            });
        }

        /**
         * Callback that processes the successfull response from Facebook API
         * to login the user in the system
         *
         * @param      {Object}  details  The details given by Faceboook
         */
        function processFacebookLogin(details) {
            Client.facebookLogin(details.email, Client.socialPassword(details.id), details.id)
                .then(function(response) {
                    //User/Pass do not match
                    if (response.status == 409) {
                        Logger.alert('Usuario o Contraseña no coinciden', response.message);
                    }
                    //Login successfull
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    }
                }, function(error) {
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        /**
         * Logins the user in the system using Facebook Login
         */
        $scope.loginWithFacebook = function() {
            facebookGetUserInfo(processFacebookLogin);
        };

        /**
         * Callback that processes the successfull response from Google API
         * to login the user in the system
         *
         * @param      {Object}  details  The details given by Google
         */
        function processGoogleLogin(details) {
            Client.googleLogin(details.email, Client.socialPassword(details.id), details.id)
                .then(function(response) {
                    //User/Pass do not match
                    if (response.status == 409) {
                        Logger.alert('Usuario o Contraseña no coinciden', response.message);
                    }
                    //Login successfull
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    }
                }, function(error) {
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        /**
         * Logins the user in the system using Google Plus
         */
        $scope.loginWithGoogle = function() {
            googleGetUserInfo(processGoogleLogin);
        };


        /**
         * Registers a user in the system
         *
         * @param      {Object}  registerForm  The user register form
         */
        $scope.doRegister = function(registerForm) {
            if (registerForm.$valid) {
                Client.register($scope.user.name, $scope.user.password, $scope.user.email)
                    .then(function(data) {
                        if (data.return && data.status == 200) {
                            loginSuccessfull(data.data.user, data.data.menu);
                        } else if (data.return && data.status == 409) {
                            Logger.alert('Usuario ya registrado', data.message);
                        }
                    }, function(error) {
                        Logger.error('Ha ocurrido un error inesperado, por favor verifique que la información ingresada es válida.');
                    });
            }
        };

        /**
         * Recovers a user password
         */
        $scope.recoverPassword = function() {
            Client.forgotPassword($scope.user.email)
                .then(function(response) {
                    Logger.alert('Recuperación de Contraseña', response.message);
                }, function(error) {
                    Logger.error('Ha ocurrido un error, por favor intente luego.');
                });
        };

        /**
         * Callback that receives the data fetched from Google to register a user
         *
         * @param      {Object}  userInfo  The user information
         */
        function processFacebookRegister(userInfo) {
            Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    } else if (response.status == 409 && response.message != '') {
                        Logger.error(response.message);
                    }
                }, function(error) {
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        /**
         * Function that handles the oAuth prompt and user data fetch
         * to pass this data to a callback to handle the proccess.
         */
        $scope.registerWithFacebook = function() {
            facebookGetUserInfo(processFacebookRegister);
        };

        /**
         * Callback that receives the data fetched from Google to register a user
         *
         * @param      {Object}  userInfo  The user information
         */
        function processGoogleRegister(userInfo) {
            Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
                .then(function(response) {
                    if (response.return && response.status == 200) {
                        loginSuccessfull(response.data.user, response.data.menu);
                    } else if (response.status == 409 && response.message != '') {
                        Logger.error(response.message);
                    }
                }, function(error) {
                    if (error.message)
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        /**
         * Function that handles the oAuth prompt and user data fetch
         * to pass this data to a callback to handle the proccess.
         */
        $scope.registerWithGoogle = function() {
            googleGetUserInfo(processGoogleRegister);
        };

        /**
         * Saves the data on $rootScope to use in the app
         *
         * @param      {Object}  user    The user
         * @param      {Object}  menu    The menu
         */
        function loginSuccessfull(user, menu) {
            $rootScope.user = user;
            $rootScope.menu = menu;
            localStorage.setItem('axpress.user', JSON.stringify(user));
            localStorage.setItem('axpress.menu', JSON.stringify(menu));
            $state.go('menu');
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller("ChatController", ChatController);

    ChatController.$inject = ['$scope', '$rootScope', 'Chat', 'history', '$stateParams'];

    function ChatController($scope, $rootScope, Chat, history, $stateParams) {
        activate();

        $scope.sendMessage = function () {
            Chat.post($stateParams.shippingId, $rootScope.user.id, 1, $scope.chat.message)
            .then(function (response) {
                if (response.status == 200 && response.message == "SUCCESS OPERATION") {
                    $scope.history.push({
                        conversacion: $scope.chat.message,
                        rol: 1,
                        fecha_registro: moment().format("HH:mm")
                    });
                    $scope.chat = {};
                }
            }, function (error) {
                console.error(error);
            });
        };

        function activate() {
            $scope.chat = {};
            if (history.return && history.status == 200) {
                history.data.forEach(function (message) {
                    message.fecha_registro = moment(message.fecha_registro).format("HH:mm");
                });
                $scope.history = history.data;
            }
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('DestinyController', DocumentDestinyController);

    DocumentDestinyController.$inject = ['$rootScope', '$scope', '$state', '$cordovaGeolocation'];

    function DocumentDestinyController($rootScope, $scope, $state, $cordovaGeolocation) {
        activate();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[$scope.markers.length-1].position = $scope.place.geometry.location;
            $scope.focused = true;
        };

        $scope.pickHere = function() {
            $scope.buttonState = true;
            $scope.markers[1].icon = "{url: 'img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
        };

        $scope.addNewDirection = function() {
            $scope.markers.push({
                title   : "Another destiny",
                position: [$scope.place.geometry.location.lat(), $scope.place.geometry.location.lng()],
                icon    : "{url: 'img/inputs/pin-mapa-check2.png', scaledSize: [48,48]}"
            });

            $scope.data.destiniesData.push(getStopElement($scope.tempData));
            resetTempData();
        };

        $scope.confirmDestiny = function() {
            if ( $state.params.serviceType == 45 ) {
                if ( $scope.data.editStopIndex >= 0 ) {
                    //Editing a previous added stop
                    var index = $scope.data.editStopIndex;
                    $scope.data.destiniesData[index] = getStopElement($scope.tempData);
                } else {
                    //Adding a new stop
                    $scope.data.destiniesData.push(getStopElement($scope.tempData));
                }
            } else {
                $scope.data.destinyAddress = $scope.place.formatted_address;
                $scope.data.destinyLatitude = $scope.place.geometry.location.lat();
                $scope.data.destinyLongitude = $scope.place.geometry.location.lng();
                $scope.data.destinyPlace = $scope.place;
            }
            resetTempData();
            $scope.buttonState = false;
            if ( $scope.extraData.navigateTo ) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.destinyNext);
            }
        };

        function setExistingAddress() {
            $scope.markers[1].position = "" + $scope.data.destinyLatitude + "," + $scope.data.destinyLongitude;
            $scope.tempData.address = $scope.data.destinyAddress;
            $scope.place = $state.current.data.data.destinyPlace;
        }

        function initialUIStates() {
            $scope.focused = false;
            $scope.focused2 = false;
            $scope.buttonState = false;
            $scope.focusedphonedestinatary = false;
            $scope.focusednamedestinatary = false;
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.markers = [{
                title   : 'Origen',
                icon    : "{url: 'img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}",
                position: [$scope.data.originLatitude, $scope.data.originLongitude]
            }];
            $scope.tempData = {};
            $scope.address = "";
            initialUIStates();
            if ( $scope.data.editStopIndex != undefined ) {
                var index = $scope.data.editStopIndex;
                $scope.tempData.phone = $scope.data.destiniesData[index].phone;
                $scope.tempData.address = $scope.data.destiniesData[index].address;
                $scope.tempData.name = $scope.data.destiniesData[index].name;

                $scope.data.destiniesData.forEach(function(destiny) {
                    $scope.markers.push({
                        title   : 'Destino',
                        icon    : "{url: 'img/inputs/pin-mapa2.png', scaledSize: [48,48]}",
                        position: [destiny.longitude, destiny.latitude]
                    })
                });
            } else {
                $scope.data.destiniesData = [];
                $scope.markers.push({
                    title: 'Destino',
                    icon : "{url: 'img/inputs/pin-mapa2.png', scaledSize: [48,48]}"
                });
            }
            if ($scope.data.destinyLatitude && $scope.data.destinyLongitude)
                setExistingAddress();
        }

        /**
         * For GPS Geolocation ngcordova geolocation
         */
        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        $scope.gpsHere = function() {
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $scope.gps.lat = position.coords.latitude;
                    $scope.gps.lng = position.coords.longitude;
                }, function(err) {
                    // error
                });
        };

        function getStopElement(data) {
            return {
                phone    : data.phone,
                longitude: $scope.place.geometry.location.lng(),
                latitude : $scope.place.geometry.location.lat(),
                address  : $scope.place.formatted_address,
                name     : data.name
            }
        }

        function resetTempData() {
            $scope.tempData = {
                address: '',
                phone: '',
                name: ''
            };
        }
    }

})();
;

(function() {
    angular.module('axpress')
        .controller('FeaturesController', FeaturesController);

    FeaturesController.$inject = ['$rootScope', '$scope', '$state'];

    function FeaturesController($rootScope, $scope, $state) {
        activate();

        $scope.confirmServiceType = function() {
            $scope.data.typeServices = $state.params.serviceType;
            $scope.data.bagId = $scope.choice.bag;
            $scope.data.bagId = $scope.choice.bag;
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.featuresNext);
            }
        };

        $scope.confirmPackage = function() {

            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.packageNext);
            }
        };

        $scope.confirmClientFeatures = function() {
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.clientNext);
            }
        };

        function setExistingChoice() {
            $scope.choice = {
                bag: $scope.data.bagId
            };
        }

        function activate() {
            $scope.choice = {};
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            $scope.menu.forEach(function(option) {
                if (option.service_provider_id == $state.params.serviceType) {
                    $scope.bagservice = option.bag_services;
                    return;
                }
            });
            if ($scope.data.bagId) {
                setExistingChoice();
            }
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['$scope'];

    function HistoryController($scope) {

        $scope.groups = [{
            "id": 1,
            "name": "DOCUMENTOS",
            "fecha": "30 - 09 - 2016",
            "iconURL": "http://ionicframework.com/img/docs/venkman.jpg"
        }, {
            "id": 2,
            "name": "PAQUETES",
            "fecha": "30 - 09 - 2016",
            "iconURL": "http://ionicframework.com/img/docs/barrett.jpg"
        }];

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
            // $ionicScrollDelegate.resize();
        };

        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };

    }
})();
;

(function() {
    angular.module('axpress')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$rootScope', '$scope', '$state'];

    function MenuController($rootScope, $scope, $state) {
        $scope.menuoptions = $rootScope.menu;

        var urlsPerServiceType = {
            43: 'document.origin',
            44: 'package.origin',
            45: 'diligence.clientfeatures'
        };

        $scope.moveTo = function(option) {
            $state.go(urlsPerServiceType[option.service_provider_id], { serviceType: option.service_provider_id });
        };
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('OriginController', DocumentOriginController);

    DocumentOriginController.$inject = ['$rootScope', '$scope', '$state', '$cordovaGeolocation'];

    function DocumentOriginController($rootScope, $scope, $state, $cordovaGeolocation) {
        activate();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.pickHere = function() {
            $scope.buttonState = true;
            $scope.markers[0].icon = "{url: 'img/inputs/pin-mapa-check1.png', scaledSize: [48,48]}";
        };

        $scope.confirmOrigin = function() {
            $scope.data.originAddress = $scope.place.formatted_address;
            $scope.data.originLatitude = $scope.place.geometry.location.lat();
            $scope.data.originLongitude = $scope.place.geometry.location.lng();
            $scope.data.originPlace = $scope.place;
            if ( $scope.extraData.navigateTo ) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.originNext);
            }
        };

        function setExistingAddress() {
            $scope.markers[0].position = "" + $scope.data.originLatitude + "," + $scope.data.originLongitude;
            $scope.address = $scope.data.originAddress;
            $scope.place = $scope.data.originPlace;
        }

        function initialUIStates() {
            $scope.focused = false;
            $scope.focused2 = false;
            $scope.buttonState = false;
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            initialUIStates();
            $scope.markers = [{
                title: 'Origen',
                icon : "{url: 'img/inputs/pin-mapa1.png', scaledSize: [48,48]}"
            }];
            if ( $scope.data.originPlace )
                setExistingAddress();
        }

        /**
         * For GPS Geolocation ngcordova geolocation
         */
        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        $scope.gpsHere = function() {
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $scope.gps.lat = position.coords.latitude;
                    $scope.gps.lng = position.coords.longitude;
                }, function(err) {
                    // error
                });
        };
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('PaymentMethodsController', PaymentMethodsController);

    PaymentMethodsController.$inject = ['$rootScope', '$scope', '$state', 'constants', 'Logger', 'Shipping', 'Diligence'];

    function PaymentMethodsController($rootScope, $scope, $state, constants, Logger, Shipping, Diligence) {
        activate();

        $scope.confirmPaymentMethod = function() {
            switch ($state.params.serviceType) {
                case 43: //Documents
                    Shipping.registerDocument($scope.data, $rootScope.user)
                        .then(function(response) {
                            if (response.return && response.status == 200) {
                                successfullyRegisteredRequest();
                            }
                        }, function(error) {
                            console.error(error);
                        });
                    break;
                case 44: //Packages
                    Shipping.registerPackage($scope.data, $rootScope.user)
                        .then(function(response) {
                            if (response.return && response.status == 200) {
                                successfullyRegisteredRequest();
                            }
                        }, function(error) {
                            console.error(error);
                        });
                    break;
                case 45: //Diligence
                    Diligence.post($scope.user.id, $scope.data.destiniesData, $state.params.serviceType, $scope.data.samepoint, $scope.data.descriptionText, $scope.data.distance, $scope.data.pay, $scope.data.amount).then(function(response) {
                        if (response.return && response.status == 200) {
                            successfullyRegisteredRequest();
                        }
                    }, function(error) {
                        if (error.message)
                            Logger.error(error.message);
                        else
                            Logger.error('');
                    });
            }
        };

        function successfullyRegisteredRequest() {
            $state.go("menu");
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.user = $rootScope.user;
            $scope.extraData = $state.current.data.extraData;
            $scope.paymentMethods = constants.paymentMethods;
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['$rootScope', '$scope', '$state'];

    function PhotoController($rootScope, $scope, $state) {
        activate();

        $scope.photoTaken = function(imageData) {
            $scope.imageData = "data:image/jpeg;base64," + imageData;
        };

        $scope.photoSelected = function(results) {
            window.plugins.Base64.encodeFile(results[0], function(base64){
                $scope.imageData = base64;
            });
        };

        $scope.confirmImagePhoto = function() {
            //We replace the meta data used to display the image
            $scope.data.picture = $scope.imageData
                .replace("data:image/jpeg;base64,", "")
                .replace("data:image/*;charset=utf-8;base64,","");
            $state.go($scope.extraData.photoNext);
        };

        function activate() {
            $scope.imageData = "";
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('ReceiverController', ReceiverController);

    ReceiverController.$inject = ['$rootScope', '$scope', '$state'];

    function ReceiverController($rootScope, $scope, $state) {
        activate();

        $scope.saveCaracteristics = function() {
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.receiverNext);
            }
        };

        function activate() {
            $scope.focusedReceiverEmail = false;
            $scope.focusedReceiverName = false;
            $scope.focusedReceiverPhone = false;
            $scope.focusedReceiverCI = false;
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;

        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('ResumeController', ResumeController);

    ResumeController.$inject = ['$rootScope', '$scope', '$state', 'Logger', 'Shipping', 'Diligence'];

    function ResumeController($rootScope, $scope, $state, Logger, Shipping, Diligence) {

        activate();

        $scope.editOrigin = function() {
            $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
            $state.go($scope.extraData.flow + '.origin');
        };

        $scope.editDestiny = function() {
            if ( $state.params.serviceType == 45 ) {
                //Its a diligence
                $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
                $state.go($scope.extraData.flow + '.stops');
            } else {
                $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
                $state.go($scope.extraData.flow + '.destiny');
            }
        };

        $scope.editFeatures = function() {
            if ( $state.params.serviceType == 45 ) {
                //Its a diligence
                $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
                $state.go($scope.extraData.flow + '.clientfeatures');
            } else {
                $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
                $state.go($scope.extraData.flow + '.features');
            }
        };

        $scope.editDestinatary = function() {
            if ( $state.params.serviceType == 45 ) {
                //Its a diligence
                $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
                $state.go($scope.extraData.flow + '.stops');
            } else {
                $scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
                $state.go($scope.extraData.flow + '.receiver');
            }
        };

        $scope.confirmResume = function() {
            $state.go($scope.extraData.resumeNext);
        };

        function requestQuotation() {
            Shipping.quotation($scope.data.originLatitude, $scope.data.originLongitude,
                $scope.data.destinyLatitude, $scope.data.destinyLongitude, $state.params.serviceType, $scope.data.bagId)
                .then(function(response) {
                    if ( response.return && response.status == 200 ) {
                        quotationSuccessful(response.data);
                    }
                }, function(error) {
                    if ( error.message )
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        function quotationSuccessful(response) {
            $scope.data.quotation = response;
            $scope.data.amount = response.price;
            $scope.data.distance = ($state.params.serviceType == 45 ? Number(response.km) * 1000 : response.kilometers_text);
        }

        function requestQuotationDiligence() {
            Diligence.quotation($state.params.serviceType, $scope.data.samepoint, $scope.data.destiniesData, $scope.data.originLatitude, $scope.data.originLongitude)
                .then(function(response) {
                    if ( response.return && response.status == 200 ) {
                        quotationSuccessful(response.data);
                    }
                }, function(error) {
                    if ( error.message )
                        Logger.error(error.message);
                    else
                        Logger.error('');
                });
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            if ( $state.params.serviceType == 45 ) {
                //Its a diligence
                requestQuotationDiligence();
            } else {
                requestQuotation();
            }
        }
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('ShipmentTrackingController', ShipmentTrackingController);

    ShipmentTrackingController.$inject = ['$rootScope', '$scope', '$state', 'NgMap'];

    function ShipmentTrackingController($rootScope, $scope, $state, NgMap) {

        $scope.originAdd = $rootScope.originLocation.toString().replace("(", "").replace(")", "");
        $scope.destinyAdd = $rootScope.originDestinyLocation.toString().replace("(", "").replace(")", "");

        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });

        $scope.goToChat = function() {
            $state.go("chat");
        };

        $scope.goToCall = function() {
            console.log("Call phone number...");
        };
    }
})();
;

(function() {
    angular.module('axpress')
        .controller('StopsController', StopsController);
    StopsController.$inject = ['$rootScope', '$scope', '$state', 'Logger'];

    function StopsController($rootScope, $scope, $state) {
        activate();

        $scope.editDestiny = function(valux) {
            $scope.data.editStopIndex = valux;
            $scope.data.editing = true;
            $scope.extraData.navigateTo = $scope.extraData.flow + '.stops';
            $state.go($scope.extraData.flow + '.destiny');
        };

        $scope.goBack = function() {
            $state.go($scope.extraData.flow + '.resume');
        };

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
        }
    }
})();
