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

		function selectPhotoController ($scope) {
				activate();
				var camera;

				function activate () {
						$scope.options = {};
						document.addEventListener("deviceready", function () {
								camera = navigator.camera;
								var tempOptions = {
										destinationType:    camera.DestinationType.DATA_URL,
										sourceType:         camera.PictureSourceType.PHOTOLIBRARY,
										encodingType:       camera.EncodingType.JPEG,
										mediaType:          camera.MediaType.PICTURE,
										quality:            90,
										allowEdit:          false,
										targetWidth:        800,
										targetHeight:       800,
										saveToPhotoAlbum:   false,
										correctOrientation: true
								};
								//Sets custom options over the default ones
								$scope.options = Object.assign(tempOptions, $scope.options);
						}, false);
				}


				$scope.selectPhoto = function () {
						document.addEventListener("deviceready", function () {
								camera.cleanup();
								camera.getPicture(function(imageData){
										$scope.successCallback(imageData);
								}, function (err) {
										if (typeof $scope.errorCallback != "undefined")
												$scope.errorCallback(err);
								}, $scope.options);
						}, false);
				};
		}

})();
