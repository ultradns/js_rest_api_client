'use strict';
function AccountCtrl($scope, $http, $parse, $resource) {
    function prepareAccountsResource() {
        return $scope.prepareResource('/accounts');
    }

    $scope.getAccountDetails = function() {
        $scope.getRequest(prepareAccountsResource());
    }
}