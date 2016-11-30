/**
 * @desc helps select an address by using Google Maps to display markers
 * @example <address-selection center="centerObject" markers="arrayOfMarkers"></address-selection>
 */
(function() {
    angular.module('axpress')
    .directive('addressSelection', addressSelection);

    function addressSelection() {
        return {
            restrict: 'E',
            scope: {
                center: "=",
                markers: "=",
                callbacks: "="
            },
            templateUrl: 'templates/directives/addressSelection.html',
            controller: function ($scope) {
                activate();

                function activate () {
                    $scope.fallbackCenter = "[40.74, -74.18]";
                }
            }
        };
    }
})()
;

// Drag up for the menu
(function(){
    angular.module('axpress')
    .directive('dragUp', dragUp);

    function dragUp ($ionicGesture) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                $ionicGesture.on('touch', function(e) {
                    e.gesture.stopDetect();
                    e.gesture.preventDefault();
                    $element.parent().toggleClass('slide-in-up');
                }, $element);
            }
        };
    }
})()
;

/**
 * @desc helps select an address by using Google Maps autocomplete functionality
 * @example <address-selection center="centerObject" markers="arrayOfMarkers"></address-selection>
 */
(function() {
    angular.module('axpress')
        .directive('mapAutocompleteAddress', mapAutocompleteAddress);


    function mapAutocompleteAddress() {
        return {
            restrict: 'EA',
            scope: {
                onPlaceChanged: "=",
                address: "="
            },
            templateUrl: 'templates/directives/mapAutocompleteAddress.html',
            controller: function($scope) {
                activate();

                function activate() {
                    $scope.restrictions = { country: 'col' };
                    $scope.types = "['address']";
                }

                /**
                 * Disables the tap allowing the use on mobile devices.
                 *
                 * @param      {Object}  event   The event
                 */
                $scope.disableTap = function(event) {
                    var input = event.target;
                    // Get the predictions element
                    var container = document.getElementsByClassName('pac-container');
                    container = angular.element(container);

                    // Apply css to ensure the container overlays the other elements, and
                    // events occur on the element not behind it
                    container.css('z-index', '10000');
                    container.css('pointer-events', 'auto');

                    // Disable ionic data tap
                    container.attr('data-tap-disabled', 'true');

                    // Leave the input field if a prediction is chosen
                    container.on('click', function() {
                        $scope.focused = true;
                        input.blur();
                    });
                };
            }
        };
    }
})()
;

/**
 * @desc helps select an image from the gallery using cordova libraries
 * @example <select-photo onPhotoSelected="function" onError="function"></select-photo>
 */
(function () {
    angular.module('axpress')
    .directive('selectPhoto', selectPhoto);

    function selectPhoto () {
        return {
            restric: 'E',
            scope: {
                options: '@',
                successCallback: '=onPhotoSelected',
                errorCallback: '=onError'
            },
            controller: selectPhotoController,
            templateUrl: 'templates/directives/selectPhoto.html'
        };
    }

    selectPhotoController.$inject = ['$scope', '$cordovaImagePicker'];

    function selectPhotoController ($scope, $cordovaImagePicker) {
        activate();

        function activate () {
            $scope.options = {};
            document.addEventListener("deviceready", function () {
                var tempOptions = {
                    maximumImagesCount: 1,   // Max number of selected images
                    width:              800,
                    height:             800,
                    quality:            100  // Higher is better
                };
                //Sets custom options over the default ones
                $scope.options = Object.assign(tempOptions, $scope.options);
            }, false);
        }

        $scope.selectPhoto = function () {
            $cordovaImagePicker.getPictures($scope.options)
                .then(function (results) {
                    $scope.successCallback(results);
                }, function (err) {
                    $scope.errorCallback(err);
                });
        };
    }

})()
;

(function () {
    angular.module('axpress')
        .directive('sidebarMenu', sidebarMenu);

    function sidebarMenu () {
        return {
            restric: 'E',
            scope: {},
            templateUrl: 'templates/directives/sidebarMenu.html',
            controller: sidebarMenuController
        };
    }

    sidebarMenuController.$inject = ['$rootScope', '$scope', 'Client', '$ionicSideMenuDelegate'];

    function sidebarMenuController($rootScope, $scope, Client, $ionicSideMenuDelegate) {
        $scope.logout = logout;
        $scope.isHome = isHome;
        $scope.cancelService = cancelService;
        $scope.isServiceActive = isServiceActive;

        function logout() {
            Client.logout();
            $rootScope.$state.go('root');
        }

        function isHome() {
            return $rootScope.$state.current.name == "app.main";
        }

        function cancelService() {
            $rootScope.$state.get('app.document').data.data = {};
            $rootScope.$state.get('app.package').data.data = {};
            $rootScope.$state.get('app.diligence').data.data = {};
            if ($rootScope.$state.current.name != "app.main") {
                $rootScope.$state.go('app.main');
                $ionicSideMenuDelegate.toggleLeft();
            }
        }

        function isServiceActive() {
            return !isEmpty($rootScope.$state.get('app.document').data.data) ||
                !isEmpty($rootScope.$state.get('app.package').data.data) ||
                !isEmpty($rootScope.$state.get('app.diligence').data.data);
        }

        function isEmpty(obj) {
            for (var i in obj)
                if (obj.hasOwnProperty(i)) return false;
            return true;
        }
    }
})();
;

/**
 * @desc helps take a photo using cordova libraries
 * @example <select-photo onPhotoSelected="function" onError="function"></select-photo>
 */
(function () {
    angular.module('axpress')
    .directive('takePhoto', takePhoto);

    function takePhoto () {
        return {
            restric: 'E',
            scope: {
                options: '@',
                successCallback: '=onPhotoTaken',
                errorCallback: '=onError'
            },
            controller: takePhotoController,
            templateUrl: 'templates/directives/takePhoto.html'
        };
    }

    takePhotoController.$inject = ['$scope', '$cordovaCamera'];

    function takePhotoController ($scope, $cordovaCamera) {
        activate();

        function activate () {
            document.addEventListener("deviceready", function () {
                var tempOptions = {
                    quality:            100,
                    destinationType:    Camera.DestinationType.DATA_URL,
                    sourceType:         Camera.PictureSourceType.CAMERA,
                    allowEdit:          true,
                    encodingType:       Camera.EncodingType.JPEG,
                    targetWidth:        800,
                    targetHeight:       800,
                    popoverOptions:     CameraPopoverOptions,
                    saveToPhotoAlbum:   false,
                    correctOrientation: true
                };

                //Sets custom options over the default ones
                $scope.options = Object.assign(tempOptions, $scope.options);
            }, false);
        }
        $scope.takePhoto = function () {
            $cordovaCamera.getPicture($scope.options)
                .then(function(imageData){
                    $scope.imageSrc = "data:image/jpeg;base64, " + imageData;
                    $scope.successCallback(imageData);
                }, function (err) {
                    $scope.errorCallback(err);
                });
        };
    }
})()
