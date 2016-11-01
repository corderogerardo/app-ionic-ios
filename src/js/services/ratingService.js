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
