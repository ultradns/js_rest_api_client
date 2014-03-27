'use strict';
function VersionCtrl($scope, $http, $parse, $resource) {
    function prepareVersionResource() {
        return $scope.prepareResource('/version');
    }

    $scope.getVersion = function() {
        prepareVersionResource().get(null, null, $scope.onSuccess, function(error) {$scope.generalResponse = error.data;});
    }
}