(function() {
    angular.module('axpress')
        .factory('GoogleMapGeocoder', GoogleMapGeocoder);

    GoogleMapGeocoder.$inject = ['$rootScope', '$q'];

    function GoogleMapGeocoder($rootScope, $q) {
        var service = {};
        service.geocoder = new google.maps.Geocoder;

        service.reverseGeocode = reverseGeocode;

        return service;

        /**
         * Executes the reverse geocoding proccess using Google Maps Geocoder
         * @param latlng {Object] an object containing lat and lng values to proccess
         * @return {Promise} a promise that will resolve the results given by geocoder.
         */
        function reverseGeocode(latlng) {
            var deferred = $q.defer();

            service.geocoder.geocode({location:latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    deferred.resolve(results);
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }
    }
})();
