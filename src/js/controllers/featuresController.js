(function() {
    angular.module('axpress')
        .controller('FeaturesController', FeaturesController);

    FeaturesController.$inject = ['$rootScope', '$scope', '$state','Location','NgMap','$timeout','GoogleMapGeocoder', 'Logger'];

    function FeaturesController($rootScope, $scope, $state,Location, NgMap,$timeout,GoogleMapGeocoder, Logger) {
        activate();

        $scope.confirmServiceType = function() {
            if (!hasSelectedTypeService()) return;

            $scope.data.typeServices = $state.params.serviceType;
            $scope.data.bagId = $scope.choice.bag.shipping_bag_id;
            $scope.data.bagTitle = $scope.choice.bag.title;
            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.featuresNext);
            }
        };

        $scope.placeChanged = function(place) {
            $scope.place = (typeof place == "object" ? place : this.getPlace());
            $timeout(function() {
                // If editing a previously added stop, edit that index plus one (because of the origin),
                // If adding a destiny/stop, edit last
                var index = ($scope.data.editStopIndex >= 0 ? ($scope.data.editStopIndex + 1) : ($scope.markers.length - 1));
                $scope.markers[index].position = $scope.place.geometry.location;
            }, 0);
            if ( typeof place == "object" )
                $scope.tempData.address = $scope.place.formatted_address;
            $scope.focused = true;
        };

        $scope.confirmPackage = function() {
            if (!hasFilledPackage()) return;

            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.packageNext);
            }
        };

        $scope.confirmClientFeatures = function() {
            if (!hasFilledDescription()) return;

            if ($scope.extraData.navigateTo) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.clientNext);
            }
        };

        function hasSelectedTypeService () {
            if (!$scope.choice.bag) {
                Logger.toast("Debe seleccionar un tipo de envío");
                return false;
            }
            return true;
        }

        function hasFilledDescription () {
            if (!$scope.data.descriptionText) {
                Logger.toast("Debe añadir una breve descripción de la diligencia");
                return false;
            }
            return true;
        }

        function hasFilledPackage () {
            if (!$scope.data.height || !$scope.data.width || !$scope.data.longitude) {
                Logger.toast("Debe indicar todas las medidas del paquete");
                return false;
            }
            if (!$scope.data.weight || !$scope.data.cuantity) {
                Logger.toast("Debe indicar peso y número de paquetes");
                return false;
            }
            return true;
        }

        function setMapCenter(position) {
            $scope.map.setCenter(position);
        }

        function setExistingChoice() {
            var bag = $scope.bagservice.filter(function (item) {
                return item.shipping_bag_id == $scope.data.bagId;
            }).pop();
            $scope.choice = {
                bag: bag
            };
        }

        function geocoderCallback(results) {
            $scope.placeChanged(results[0]);
            setMapCenter(results[0].geometry.location);
        }

        function setExistingAddress() {
            var latlng = { lat: $scope.data.destinyLatitude, lng: $scope.data.destinyLongitude };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
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
            $scope.markers = [{
                icon    : "{url: 'img/PinOrigen/Origen3x.png.png', scaledSize: [28,38]}",
                position: [$scope.data.originLatitude, $scope.data.originLongitude]
            }];
            $scope.tempData = {};
            $scope.address = "";
            NgMap.getMap().then(function(map) {
                $scope.map = map;
            });
            if ( Array.isArray($scope.data.destiniesData) && $scope.data.destiniesData.length > 0 ) {
                var index = $scope.data.editStopIndex;
                $scope.data.destiniesData.forEach(function(destiny, destIndex) {
                    $scope.markers.push({
                        icon     : (destIndex == index ? "{url: 'img/Pindestino/Pindetsino3x.png.png', scaledSize: [28,38]}" : "{url: 'img/Pindestino/Pindetsino3x.png.png', scaledSize: [28,38]}"),
                        position : [destiny.latitude, destiny.longitude],
                    });
                });
                if ( typeof index != "undefined" ) {
                    var destiny = $scope.data.destiniesData[index];
                    $scope.tempData.phone = destiny.phone;
                    $scope.tempData.address = destiny.address;
                    $scope.tempData.name = destiny.name;
                    GoogleMapGeocoder.reverseGeocode({ lat: destiny.latitude, lng: destiny.longitude })
                        .then(geocoderCallback);
                }
            } else {
                $scope.data.destiniesData = [];
                $scope.markers.push({
                    icon     : "{url: 'img/Pindestino/Pindetsino3x.png.png', scaledSize: [28,38]}",
                });
            }

            if ( $scope.data.destinyLatitude && $scope.data.destinyLongitude )
                setExistingAddress();
        }
    }
})();
