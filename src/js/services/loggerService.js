(function() {
    angular.module('axpress')
        .service('Logger', Logger);

    Logger.$inject = ['$ionicPopup', '$cordovaToast', '$cordovaProgress', '$cordovaDialogs'];

    function Logger($ionicPopup, $cordovaToast, $cordovaProgress, $cordovaDialogs) {
        return {
            alert: alert,
            error: error,
            toast: toast,
            confirm: confirm,

            displayProgressBar: displayProgressBar,
            hideProgressBar: hideProgressBar
        };

        /**
         * $ionicPopup alert wrapper
         *
         * @param      {String}  title   The title
         * @param      {String}  body    The body (can be html tags)
         */
        function alert(title, body) {
            $ionicPopup.alert({ title: title, template: body });
        }

        /**
         * $ionicPopup alert wrapper with fixed title to send error messages
         *
         * @param      {String}  body    The body (can be html tags)
         */
        function error(body) {
            $ionicPopup.alert({ title: 'Ha ocurrido un error', template: body });
        }

        function toast (message, duration, position) {
            $cordovaToast.show(message, duration || 'short', position || 'bottom');
        }

        function displayProgressBar () {
            $cordovaProgress.showSimple(true);
        }

        function hideProgressBar () {
            $cordovaProgress.hide();
        }

        function confirm (title, message, buttons, confirmCallback) {
            navigator.notification.confirm(message, confirmCallback, title, buttons || ['Ok', 'Cancelar']);
        }
    }
})();
