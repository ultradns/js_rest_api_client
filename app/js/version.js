'use strict';

/**
 * Copyright 2000-2014 NeuStar, Inc. All rights reserved.
 * NeuStar, the Neustar logo and related names and logos are registered
 * trademarks, service marks or tradenames of NeuStar, Inc. All other
 * product names, company names, marks, logos and symbols may be trademarks
 * of their respective owners.
 */

function VersionCtrl($scope, $http, $parse, $resource) {
    function prepareVersionResource() {
        return $scope.prepareResource('/version');
    }

    $scope.getVersion = function() {
        prepareVersionResource().get(null, null, $scope.onSuccess, function(error) {$scope.generalResponse = error.data;});
    }
}
