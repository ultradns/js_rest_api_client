'use strict';
function StatusCtrl($scope, $http, $parse, $resource) {
    function prepareStatusResource() {
        return $scope.prepareResource('/status');
    }

    $scope.getStatus = function() {
        $scope.getRequest(prepareStatusResource());
    }
}