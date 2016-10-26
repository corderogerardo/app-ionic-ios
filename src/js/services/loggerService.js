angular.module('axpress')
.service('Logger', ['$ionicPopup', function($ionicPopup){
    return {
        alert: alert,
        error: error
    };

    /**
     * $ionicPopup alert wrapper
     *
     * @param      {String}  title   The title
     * @param      {String}  body    The body (can be html tags)
     */
    function alert (title, body) {
        $ionicPopup.alert({title: title, template: body});
    }

    /**
     * $ionicPopup alert wrapper with fixed title to send error messages
     *
     * @param      {String}  body    The body (can be html tags)
     */
    function error (body) {
        $ionicPopup.alert({title: 'Ha ocurrido un error', template: body});
    }
}]);