'use strict';

/**
 * Copyright 2000-2014 NeuStar, Inc. All rights reserved.
 * NeuStar, the Neustar logo and related names and logos are registered
 * trademarks, service marks or tradenames of NeuStar, Inc. All other
 * product names, company names, marks, logos and symbols may be trademarks
 * of their respective owners.
 */

function StatusCtrl($scope, $http, $parse, $resource) {
    function prepareStatusResource() {
        return $scope.prepareResource('/status');
    }

    $scope.getStatus = function() {
        $scope.getRequest(prepareStatusResource());
    }
}
