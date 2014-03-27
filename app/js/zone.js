'use strict';
function ZoneCtrl($scope, $http, $parse, $resource) {
    function prepareZoneResource() {
        return $scope.prepareResource('/zones/:zoneName');
    }

    function prepareZonesOfAccountResource() {
            return $scope.prepareResource('/accounts/:accountName/zones');
        }

    $scope.createZone = function(doNotReattempt) {
        $scope.zoneJson = angular.toJson($scope.zone);
        $scope.saveRequest(prepareZoneResource(),null, $scope.zoneJson);
    }

    $scope.getZoneMetaData = function(doNotReattempt) {
        $scope.getRequest(prepareZoneResource(),{'zoneName':$scope.zone.properties.name});
    }

    $scope.getZonesOfAccount = function(doNotReattempt) {
        $scope.getRequest(prepareZonesOfAccountResource(),{'accountName':$scope.zone.properties.accountName});
    }

    $scope.deleteZone = function(doNotReattempt) {
        $scope.deleteRequest(prepareZoneResource(),{'zoneName':$scope.zone.properties.name});
    }
}
