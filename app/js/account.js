'use strict';

/**
 * Copyright 2000-2014 NeuStar, Inc. All rights reserved.
 * NeuStar, the Neustar logo and related names and logos are registered
 * trademarks, service marks or tradenames of NeuStar, Inc. All other
 * product names, company names, marks, logos and symbols may be trademarks
 * of their respective owners.
 */

function AccountCtrl($scope, $http, $parse, $resource) {
    function prepareAccountsResource() {
        return $scope.prepareResource('/accounts');
    }

    $scope.getAccountDetails = function() {
        $scope.getRequest(prepareAccountsResource());
    }
}
