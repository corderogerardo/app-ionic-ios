(function() {
		angular.module('axpress')
				.factory('Chat', ChatService);

		ChatService.$inject = ['$rootScope', '$q', 'Service'];

		function ChatService($rootScope, $q, Service) {
				var service = new Service('/chat');

				//Public Functions
				service.post = post;
				service.history = history;

				return service;

				/**
				 * { function_description }
				 *
				 * @param      {Integer}  shippingId  The shipping identifier
				 * @param      {Integer}  sentById    The ID of who's sending the message
				 * @param      {Integer}  sentByType  Type of who is sending the message (0 - Client, 1 - Courier)
				 * @param      {String}   message     The message
				 * @return     {Promise}  A promise to resolve results
				 */
				function post(shippingId, sentById, sentByType, message) {
						var data = {
								shipping_id: shippingId,
								sentby_id: sentById,
								sentby_type: sentByType,
								message: message
						};

						return service.apiPost('/post', data);
				}

				/**
				 * Gets the message history for a shipping
				 *
				 * @param      {String}   shippingId  The shipping identifier
				 * @return     {Promise}  A promise to resolve results
				 */
				function history(shippingId) {
						var data = {
								shipping_id: shippingId
						};
						return service.apiPost('/history', data);
				}
		}
})();
