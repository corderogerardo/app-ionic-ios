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
.controller('MenuController', ['$scope','$rootScope','$ionicPopup', '$state', function($scope,$rootScope,$ionicPopup, $state){
    
    /*We are going to fill the bag_services data in MenuController following the option selected*/

    $scope.menuoptions = $rootScope.menuoptions;

    var urlsPerServiceType = {1: 'document.origin', 2: 'package.origin'};

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
        $state.go(urlsPerServiceType[option]);
    };


}]);
