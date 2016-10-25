/**
 * Created by Gerardo Cordero on 20/10/2016.
 */
angular.module('axpress')
    .controller('CaracteristicsController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup) {
        console.log("Caracteristics Controller");
       /* $scope.mapsTitle = $rootScope.mapsTitle.toString();*/
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
                $state.go("documentsimagephoto");
            }else{
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

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('ErrandsResumeController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope,$scope,$cordovaDialogs, $state){

        $scope.titleMenu = $rootScope.mapsTitle;
        $scope.originAddress = $rootScope.originAddress;
        $scope.destinyAddress = $rootScope.originDestinyAddress;

        $scope.destinataryResume = $rootScope.destinatary;
        $scope.caracteristicsResume = $rootScope.caracteristics;

        $scope.confirmResume = function(){
            $state.go("paymentmethods")
        }
    }]);
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
.controller('ImagePhotoController',['$rootScope','$scope', '$cordovaDialogs','$cordovaCamera', '$state', function($rootScope,$scope,$cordovaDialogs,$cordovaCamera, $state){
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
        $state.go("sentresumedocument");
    }
}]);
;

angular.module('axpress')
.controller('LoginController', ['$scope', '$rootScope', 'Client', '$ionicPopup',
function($scope, $rootScope, Client, $ionicPopup){

    $scope.login = function () {
        //use $scope.user
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
            $ionicPopup.alert({title: 'goodResponse', template:JSON.stringify(data)});
        }, function (error) {
            $ionicPopup.alert({title: 'badResponse', template:JSON.stringify(error)});
        });
    };

    function processFacebookLogin (details) {
        //TODO: Do something with user details
    }

    $scope.loginWithFacebook = function () {
        Client.loginWithFacebook().then(function (response) {
            Client.facebookGetUserInfo().then(function (response) {
                processFacebookLogin(response);
            }, function (error) {
                // If there's an error fetching user details, access token it's removed
                // and we have to login again
                Client.loginWithFacebook().then(function (response) {
                    Client.facebookGetUserInfo().then(function (response) {
                        processFacebookLogin(response);
                    });
                });
            });
        });
        
    };

    function processGoogleLogin (details) {
        //TODO: Do something with user details
        $ionicPopup.alert({title: 'gInfo', template:JSON.stringify(details)});
    }

    $scope.loginWithGoogle = function () {
        Client.loginWithGoogle().then(function (response) {
            Client.googleGetUserInfo().then(function (response) {
                processGoogleLogin(response);
            }, function (error) {
                // If there's an error fetching user details, credentials are removed
                // and we have to login again
                Client.loginWithGoogle().then(function (response) {
                    Client.googleGetUserInfo().then(function (response) {
                        processGoogleLogin(response);
                    });
                });
            });
        });
    };

    $scope.facebookAvailable = $rootScope.facebookLoaded;

    
}]);;

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
.controller('MapsOriginController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ,NgMap){

    /*$scope.mapsTitle = JSON.stringify($rootScope.mapsTitle);*/
    $scope.mapsTitle = $rootScope.mapsTitle.toString();
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
    $scope.confirmOrigin = function(){
        /*console.log(JSON.stringify($scope.place.geometry.location));
        console.log(JSON.stringify($scope.place.formatted_address));
        $ionicPopup.alert({title: 'option', template:"Data from address: "+JSON.stringify($scope.place.formatted_address)});*/
        $rootScope.originAddress = $scope.place.formatted_address;
        $rootScope.originLocation= $scope.place.geometry.location;
        $state.go("mapsdestiny");
       /* $cordovaDialogs.confirm('Estas seguro?',confirmClosed,"Confirmation",["Si", "No"]);*/
    };
    function confirmClosed(buttonIndex) {

        $cordovaDialogs.alert("Button selected: "+buttonIndex);

    };


}]);
;

angular.module('axpress')
.controller('MenuController', ['$rootScope','$scope','$state','$ionicPopup', function($rootScope,$scope,$state,$ionicPopup){
    console.log("Menu Controller");

    /**
     * Temporal Response JSON Data for a real approach data use with the app.
     */
    var tempResponse = {
        "return":true,
        "message":"Usuario logueado exitosamente",
        "max_insured_value":500000,
        "data":{
            "user":{
                "id":"355",
                "identify":"",
                "name":"Gerardo",
                "email":"gerardo@hotmail.com",
                "social_id":"1793",
                "phone":""
            },
            "menu":[
                {
                    "service_provider_id":42,
                    "type_service":1,
                    "value":0,
                    "max_turns":0,
                    "title":"Documentos",
                    "text_description":"unitario, masivo, judicial",
                    "bag_services":[
                        {
                            "shipping_bag_id":19,
                            "title":"ENVIO YA ",
                            "subtitle":"MENOR A 8 HORAS",
                            "value":5000,
                            "additional_nightly_rate":3000
                        }
                    ],
                    "ranges":[
                        {
                            "range_id":1,
                            "init_range":1,
                            "end_range":999,
                            "description":"0 a 1 Kg"
                        },
                        {
                            "range_id":2,
                            "init_range":1000,
                            "end_range":2000,
                            "description":"1 a 2Kg"
                        },
                        {
                            "range_id":3,
                            "init_range":2001,
                            "end_range":5000,
                            "description":"2 a 5kg"
                        }
                    ]
                },
                {
                    "service_provider_id":41,
                    "type_service":2,
                    "value":0,
                    "max_turns":0,
                    "title":"Paquetes",
                    "text_description":"mercancias, carga, sólidos",
                    "bag_services":[
                        {
                            "shipping_bag_id":20,
                            "title":"ENVIO YA ",
                            "subtitle":"MENOR A 8 HORAS",
                            "value":5000,
                            "additional_nightly_rate":3000
                        }
                    ],
                    "ranges":[
                        {
                            "range_id":1,
                            "init_range":1,
                            "end_range":999,
                            "description":"0 a 1 Kg"
                        },
                        {
                            "range_id":2,
                            "init_range":1000,
                            "end_range":2000,
                            "description":"1 a 2Kg"
                        },
                        {
                            "range_id":3,
                            "init_range":2001,
                            "end_range":5000,
                            "description":"2 a 5kg"
                        }
                    ]
                },
                {
                    "service_provider_id":40,
                    "type_service":3,
                    "value":2000,
                    "max_turns":10,
                    "title":"Diligencias",
                    "text_description":"por actividades. tiempos o complejidades",
                    "bag_services":[
                        {
                            "shipping_bag_id":21,
                            "title":"PRIORIDAD YA",
                            "subtitle":"MENOR A 8 HORAS",
                            "value":5000,
                            "additional_nightly_rate":3000
                        }
                    ],
                    "ranges":[
                        {
                            "range_id":4,
                            "init_range":1,
                            "end_range":999,
                            "description":"0 a 1 kg"
                        },
                        {
                            "range_id":5,
                            "init_range":1000,
                            "end_range":2000,
                            "description":"0 a 2 Kg"
                        },
                        {
                            "range_id":6,
                            "init_range":2001,
                            "end_range":5000,
                            "description":"0 a 2 Kg"
                        }
                    ]
                }
            ]
        },
        "status":200
    };
    /*User data is a JSON*/
    $rootScope.user = tempResponse.data.user;
    /*Menu is an array*/
    $rootScope.menuoptions = tempResponse.data.menu;
    /*We are going to fill the bag_services data in MenuController following the option selected*/

    $scope.menuoptions = $rootScope.menuoptions;

    $scope.moveTo = function(option){
        $rootScope.mapsTitle = option;
        if($scope.mapsTitle === "Documentos"){
            $state.go('mapsorigin');
        }
        if($scope.mapsTitle === "Paquetes"){
            $state.go('mapsorigin');
        }
        if($scope.mapsTitle === "Diligencias"){
            $state.go('caracteristicserrands');
        }
        /*$ionicPopup.alert({title: 'option', template:$rootScope.mapsTitle});*/

    }


}]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('PaymentMethodsController', ['$rootScope','$scope', '$cordovaDialogs', '$state', function($rootScope, $scope, $cordovaDialogs, $state){



    $scope.confirmPaymentMethod = function(){
        $state.go("shipmenttracking");
    };

}]);
;

/**
 * @class RegisterController

 * @constructor register

 * @function doRegister
 *
 */
angular.module('axpress')
.controller('RegisterController', ['$scope', 'Client', function($scope, Client) {
    $scope.users = {
        name: "test",
        pass: "12345",
        email: "youremail@gmail.com",
        phone: "56-555-5555",
    };
    $scope.doRegister = function(registerForm) {
        if (registerForm.$valid) {
            alert("Thanks user " + JSON.stringify($scope.users));
            Client.register($scope.users.email, $scope.users.pass, $scope.users.name)
                .then(function(data) {
                    console.log(data);
                }, function(error) {
                    console.war("error...");
                    console.log(error);
                });
        }
    };
}]);
;

/**
 * Created by gerardo on 24/10/16.
 */
angular.module('axpress')
    .controller('SentTypeController', ['$rootScope','$scope', '$cordovaDialogs', '$state','$ionicPopup', 'NgMap', function($rootScope,$scope,$cordovaDialogs, $state, $ionicPopup ) {


        $scope.confirmSentType = function(){
            $state.go("caracteristicsdocuments");
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
