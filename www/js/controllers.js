/**
 * Created by Gerardo Cordero on 20/10/2016.
 */
angular.module('axpress')
    .controller('CaracteristicsController', ['$scope','$rootScope','$ionicPopup', function($scope,$rootScope,$ionicPopup){
        console.log("Caracteristics Controller");

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
            $ionicPopup.alert({title: 'Destinatary', template: JSON.stringify( $scope.data)});
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

angular.module('axpress')
.controller('DocumentOriginController', ['$scope', '$state','uiGmapGoogleMapApiProvider', function($scope, $state,uiGmapGoogleMapApiProvider){

    //Inherited data from parent, can be shared between children inyecting $state
    var documento = $state.current.data.documento;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
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
.controller('ImagePhotoController',['$cordovaCamera','$scope','$ionicPopup',function($cordovaCamera,$scope,$ionicPopup){
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
.controller('MenuController', ['$scope','$rootScope','$ionicPopup', function($scope,$rootScope,$ionicPopup){
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
        $ionicPopup.alert({title: 'option', template:option});
    }


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

angular.module('axpress')
    .controller('ShipmentTrackingController', ['$scope', function($scope) {
        $scope.shipment = {

        };

    }]);
