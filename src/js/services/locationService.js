(function() {
    angular.module('axpress')
        .factory('Location', Location);

    Location.$inject = ['$q', '$cordovaGeolocation'];

    function Location($q, $cordovaGeolocation) {
        var service = {};

        service.options = { timeout: 10000, maximumAge: (5 * 60 * 1000), enableHighAccuracy: false };

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
