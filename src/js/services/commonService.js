(function() {
		angular.module('axpress')
				.factory('CommonService', CommonService);

		CommonService.$inject = ['$rootScope'];

		function CommonService($rootScope) {
				var service = {
						encodeImageUri: encodeImageUri
				};

				return service;

				/**
				 * Gets a base64 encoded image from a image uri,
				 * using a canvas node
				 *
				 * @param      {String}  imageUri  The image uri
				 * @return     {String}  Base64 encoded image
				 */
				function encodeImageUri(imageUri) {
						var c = document.createElement('canvas');
						var ctx = c.getContext("2d");
						var img = new Image();
						img.onload = function() {
								c.width = this.width;
								c.height = this.height;
								ctx.drawImage(img, 0, 0);
						};
						img.src = imageUri;
						var dataURL = c.toDataURL("image/jpeg");
						return dataURL;
				}
		}
})();
