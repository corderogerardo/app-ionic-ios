/**
 * Created by gerardo on 19/10/16.
 */
angular.module('axpress')
.controller("AccountController",['$scope','$rootScope','$ionicPopup', 'Client', function($scope,$rootScope,$ionicPopup, Client){
    $rootScope.user={
        name: "Developer",
        pass: "123456",
        email: "developer@gmail.com",
        phone: "55-555-5555",
    };
    $scope.user = $rootScope.user;

    $scope.doAccountUpdate = function(accountForm){
        if(accountForm.$valid){
            Client.edit($scope.user)
                .then(function(data){
                    console.log(data);
                    $ionicPopup.alert({title:'goodResponse',template:JSON.stringify(data)});
                },function(error){
                    $ionicPopup.alert({title:'badResponse',template:JSON.stringify(error)});
                });

        }
    };

}]);
;

angular.module('axpress')
.controller('AuthController', ['$scope', '$rootScope', 'Client', 'Logger', '$state',
function($scope, $rootScope, Client, Logger, $state){


    activate();

    function activate () {
        processFacebookLogin({"id":"118882175249424","name":"Prueba Axpress","email":"axpressprueba1@gmail.com"});
        if (localStorage.getItem('axpress.user') && localStorage.getItem('axpress.menu')) {
            $rootScope.user = JSON.parse(localStorage.getItem('axpress.user'));
            $rootScope.menu = JSON.parse(localStorage.getItem('axpress.menu'));
            $state.go('menu');
        }
    }


    /**
     * Logins a user in the system using the nomal user/password method
     */
    $scope.login = function () {
        Client.login($scope.user.email,$scope.user.password)
        .then(function (response) {
            //User/Pass do not match
            if (response.status == 409) {
                Logger.alert('Usuario o Contraseña no coinciden', response.message);
            }
            //Login successfull
            if (response.return && response.status == 200) {
                loginSuccessfull(response.data.user, response.data.menu);
            }
        }, function (error) {
            Logger.alert('badResponse', JSON.stringify(error));
        });
    };

    /**
     * Handles the logic of oAuth prompt, getting user info and retrying if failure
     *
     * @param      {Function}  successCallback  The callback to use on success
     */
    function googleGetUserInfo (successCallback) {
        Client.loginWithGoogle().then(function (response) {
            Client.googleGetUserInfo().then(function (response) {
                successCallback(response);
            }, function (error) {
                // If there's an error fetching user details, credentials are removed
                // and we have to login again
                Client.loginWithGoogle().then(function (response) {
                    Client.googleGetUserInfo().then(function (response) {
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
    function facebookGetUserInfo (successCallback) {
        Client.loginWithFacebook().then(function () {
            Client.facebookGetUserInfo().then(function (response) {
                successCallback(response);
            }, function (error) {
                // If there's an error fetching user details, access token it's removed
                // and we have to login again
                Client.loginWithFacebook().then(function (response) {
                    Client.facebookGetUserInfo().then(function (response) {
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
    function processFacebookLogin (details) {
        Client.facebookLogin(details.email, Client.socialPassword(details.id), details.id)
            .then(function (response) {
                //User/Pass do not match
                if (response.status == 409) {
                    Logger.alert('Usuario o Contraseña no coinciden', response.message);
                }
                //Login successfull
                if (response.return && response.status == 200) {
                    loginSuccessfull(response.data.user, response.data.menu);
                }
            }, function (error) {
                if (error.message)
                    Logger.error(error.message);
                else
                    Logger.error('');
            });
    }

    /**
     * Logins the user in the system using Facebook Login
     */
    $scope.loginWithFacebook = function () {
        facebookGetUserInfo(processFacebookLogin);
    };

    /**
     * Callback that processes the successfull response from Google API
     * to login the user in the system
     *
     * @param      {Object}  details  The details given by Google
     */
    function processGoogleLogin (details) {
        Client.googleLogin(details.email, Client.socialPassword(details.id), details.id)
            .then(function (response) {
                //User/Pass do not match
                if (response.status == 409) {
                    Logger.alert('Usuario o Contraseña no coinciden', response.message);
                }
                //Login successfull
                if (response.return && response.status == 200) {
                    loginSuccessfull(response.data.user, response.data.menu);
                }
            }, function (error) {
                if (error.message)
                    Logger.error(error.message);
                else
                    Logger.error('');
            });
    }

    /**
     * Logins the user in the system using Google Plus
     */
    $scope.loginWithGoogle = function () {
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
    $scope.recoverPassword = function () {
        Client.forgotPassword($scope.user.email)
            .then(function (response) {
                Logger.alert('Recuperación de Contraseña', response.message);
            }, function (error) {
                Logger.error('Ha ocurrido un error, por favor intente luego.');
            });
    };

    /**
     * Callback that receives the data fetched from Google to register a user
     *
     * @param      {Object}  userInfo  The user information
     */
    function processFacebookRegister (userInfo) {
        Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
            .then(function (response) {
                if (response.return && response.status == 200) {
                    loginSuccessfull(response.data.user, response.data.menu);
                } else if (response.status == 409 && response.message!= '') {
                    Logger.error(response.message);
                }
            }, function (error) {
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
    $scope.registerWithFacebook = function () {
        facebookGetUserInfo(processFacebookRegister);
    };

    /**
     * Callback that receives the data fetched from Google to register a user
     *
     * @param      {Object}  userInfo  The user information
     */
    function processGoogleRegister (userInfo) {
        Client.register(userInfo.name, Client.socialPassword(userInfo.id), userInfo.email, userInfo.id)
            .then(function (response) {
                if (response.return && response.status == 200) {
                    loginSuccessfull(response.data.user, response.data.menu);
                } else if (response.status == 409 && response.message!= '') {
                    Logger.error(response.message);
                }
            }, function (error) {
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
    $scope.registerWithGoogle = function () {
        googleGetUserInfo(processGoogleRegister);
    };

    /**
     * Saves the data on $rootScope to use in the app
     *
     * @param      {<type>}  user    The user
     * @param      {<type>}  menu    The menu
     */
    function loginSuccessfull (user, menu) {
        $rootScope.user = user;
        $rootScope.menu = menu;
        localStorage.setItem('axpress.user', JSON.stringify(user));
        localStorage.setItem('axpress.menu', JSON.stringify(menu));
        $state.go('menu');
    }

}]);
;

/**
 * Created by Gerardo Cordero on 20/10/2016.
 */
angular.module('axpress')
    .controller('CaracteristicsController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup) {
        console.log("Caracteristics Controller");
        $scope.mapsTitle = $rootScope.mapsTitle.toString();
        $scope.destinatary ={
            email: "youremail@gmail.com",
            username: "test",
            phone: "56-555-5555",
            cinit: "12345",
        }
        $scope.caracteristics = {
            declaredvalue: "30000",
            shortdescription: "Pequeña descripcion",
        }
        $scope.data ={};
        $scope.data.destinatary =  $scope.destinatary;
        $scope.data.caracteristics =  $scope.caracteristics;


        $scope.saveCaracteristics = function () {
           /* $ionicPopup.alert({title: 'Destinatary', template: JSON.stringify( $scope.data)});*/
           $rootScope.destinatary = $scope.destinatary;
           $rootScope.caracteristics = $scope.caracteristics;
            if($scope.mapsTitle === "Documentos"){
                console.log(" "+$scope.mapsTitle);
                $state.go("document.imagephoto");
            }
            if($scope.mapsTitle === "Paquetes"){
                console.log(" "+$scope.mapsTitle);
                $state.go("caracteristicspackages");
            }
            /*Caracteristics Service*/

           /* Caracteristics.save($scope.data.destinatary,$scope.data.caracteristics)
                .then(function(data){
                    console.log(data);
                },function(error){
                    console.log(error);
                })*/

        }

}]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('CaracteristicsErrandsController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup) {

    }]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('CaracteristicsPackagesController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup) {

}]);
;

(function () {
    angular.module('axpress')
    .controller('DocumentOriginController', DocumentOriginController);

    DocumentOriginController.$inject = ['$rootScope', '$scope', '$cordovaDialogs', '$state', '$ionicPopup'];

    function DocumentOriginController ($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup){

        initialize();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            $scope.markers[0].position = $scope.place.geometry.location;
        };

        $scope.confirmOrigin = function(){
            $state.current.data.doc.originAddress = $scope.place.formatted_address;
            $state.current.data.doc.originLatitude = $scope.place.geometry.location.lat();
            $state.current.data.doc.originLongitude = $scope.place.geometry.location.lng();
            $state.go("mapsdestiny");
        };

        function initialize () {
            console.log($state.current);
            $scope.markers = [{
                title: 'Origen'
            }];
        }
    }

})();
;

/**
 * @summary HistoryController
 *
 */
angular.module('axpress')
.controller('HistoryController', ['$scope', function($scope) {

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
    
}]);
;

/**
 * Created by gerardo on 21/10/16.
 */
angular.module('axpress')
.controller('ImagePhotoController',['$rootScope','$scope', '$cordovaDialogs','$cordovaCamera', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs,$cordovaCamera, $state,$ionicPopup){
    $scope.takePicture = function(){
        $ionicPopup.alert({title: 'Clicked on take a picture', template:"Taking a picture"});

        var options = {
            quality:75,
            destinationType:Camera.DestinationType.DATA_URL,
            sourceType:Camera.PictureSourceType.CAMERA,
            allowEdit:true,
            encodingType:Camera.EncodingType.JPEG,
            targetWidth:300,
            targetHeight:300,
            popoverOptions:CameraPopoverOptions,
            saveToPhotoAlbum:false
        };
        $cordovaCamera.getPicture(options).then(function(imageData){
            //Success! Image data is here
            $scope.imgSrc = "data:image/jpeg;base64, "+imageData;
        },function (err) {
            $ionicPopup.alert({title: 'An error happen when taking the picture.', template:err});
        });
    };
    $scope.selectPicture = function () {
        $ionicPopup.alert({title: 'Clicked on select a picture', template:"Selecting a picture"});

        var options = {
            destinationType:Camera.DestinationType.FILE_URI,
            sourceType:Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options).then(function (imgUri) {
            $scope.imgSrc = imgUri;
        },function (err) {
            $ionicPopup.alert({title: 'An error happen when selecting the picture.', template:err});
        })
    };
    $scope.confirmImagePhoto = function(){
        $state.go("document.sentresume");
    }
}]);
;

angular.module('axpress')
    .controller('MapsDestinyController', ['$rootScope','$scope', '$cordovaDialogs', '$state', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state ,NgMap){

        $scope.mapsTitle = $rootScope.mapsTitle.toString();
        $scope.originAdd =  $rootScope.originLocation.toString().replace("(","").replace(")","");
      /*  console.log("rootScope origin address: "+$rootScope.originAddress.toString());
        console.log("scope "+$scope.originAdd.toString().replace("(","").replace(")",""));*/

        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });
        //Inherited data from parent, can be shared between children injecting $state
        /* var documento = $state.current.data.documento;*/

        $scope.address = "";
        $scope.place="";
        $scope.types="['address']";
        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            console.log('location', $scope.place.geometry.location);
            $scope.map.setCenter($scope.place.geometry.location);

        };
        $scope.confirmDestiny = function(){
            $rootScope.originDestinyAddress = $scope.place.formatted_address;
            $rootScope.originDestinyLocation = $scope.place.geometry.location;
            $state.go("sendtypedocuments");
            /* $cordovaDialogs.confirm('Estas seguro?',confirmClosed,"Confirmation",["Si", "No"]);*/
        };
        /*function confirmClosed(buttonIndex) {

            $cordovaDialogs.alert("Button selected: "+buttonIndex);

        }*/


    }]);
;

angular.module('axpress')
.controller('MenuController', ['$rootScope','$scope','$state','$ionicPopup', function($rootScope,$scope,$state,$ionicPopup){
    /*We are going to fill the bag_services data in MenuController following the option selected*/

    $scope.menuoptions = $rootScope.menu;

    var urlsPerServiceType = {1: 'document.origin', 2: 'package.origin'};

    $scope.moveTo = function(option){
        $state.go(urlsPerServiceType[option]);
    };

}]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('PaymentMethodsController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope, $scope, $cordovaDialogs, $state){
        $scope.choice = {name:''};


    $scope.confirmPaymentMethod = function(){
        console.log($scope.choice.name);
        $state.go("menu");
    };

}]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('ResumeController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope,$scope,$cordovaDialogs, $state){

        $scope.titleMenu = $rootScope.mapsTitle;
        $scope.originAddress = $rootScope.originAddress;
        $scope.destinyAddress = $rootScope.originDestinyAddress;

        $scope.destinataryResume = $rootScope.destinatary;
        $scope.caracteristicsResume = $rootScope.caracteristics;

        $scope.confirmResume = function(){
            $state.go("document.paymentmethods")
        }
    }]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('SentTypeController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ) {

        $scope.menu = $rootScope.menu;
        $scope.bagservice = "";
        $scope.bagservicedata ="";
        $scope.choice = {name:''};

        $scope.menu.forEach(function(option){
           if(option.title === $rootScope.mapsTitle.toString()){
               $scope.bagservice = option.bag_services;
               $scope.bagservicedata = option.bag_services["0"];
           }
        });

        console.log($scope.menu);
        console.log($scope.bagservice+" "+$scope.bagservice.length);

        $scope.confirmSentType = function(){
            console.log($scope.choice.name);
            console.log($scope.bagservicedata);
            $rootScope.bagserviceselected = $scope.choice.name;
            $rootScope.bagservicedata = $scope.bagservicedata;
            $state.go("document.caracteristics");
        }

 }]);
;

angular.module('axpress')
    .controller('ShipmentTrackingController',  ['$rootScope','$scope', '$cordovaDialogs', '$state', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state ,NgMap){
        $scope.originAdd =  $rootScope.originLocation.toString().replace("(","").replace(")","");
        $scope.destinyAdd =  $rootScope.originDestinyLocation.toString().replace("(","").replace(")","");

        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });

        $scope.goToChat = function(){
            $state.go("chat");
        }
        $scope.goToCall = function(){
            console.log("Call phone number...");
        }
    }]);
