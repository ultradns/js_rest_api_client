'use strict';
function RRSetCtrl($scope, $http, $parse, $resource) {
    $scope.assign('rrset.ttl', '300');
    $scope.assign('rrset.rdata', ['1.2.3.4']);

     // default rr set creation values
    $scope.assign('rdpool.profile.context', 'http:\/\/schemas.ultradns.com\/RDPool.jsonschema');
    $scope.assign('rdpool.profile.order', 'RANDOM');
    $scope.assign('rdpool.profile.description', 'This is a great RD Pool');
    $scope.assign('rdpool.ttl', '300');
    $scope.assign('rdpool.rdata', ['1.2.3.4', '2.4.6.8', '3.5.7.8']);

    function prepareRRSetResource() {
        return $scope.prepareResource('/zones/:zoneName/rrsets/:recordType/:owner');
    }

    $scope.getRRSetOfZone = function(doNotReattempt) {
        $scope.getRequest(prepareRRSetResource(),
            {'zoneName':$scope.rrsetPathParam.zone});
    }

    $scope.getRRSetOfZoneAndType = function(doNotReattempt) {
        $scope.getRequest(prepareRRSetResource(),
            {'zoneName':$scope.rrsetPathParam.zone, 'recordType':$scope.rrsetPathParam.recordType});
    }

    $scope.deleteRRSet = function(doNotReattempt) {
        $scope.deleteRequest(prepareRRSetResource(),
            {'zoneName':$scope.rrsetPathParam.zone, 'recordType':$scope.rrsetPathParam.recordType, 'owner':$scope.rrsetPathParam.owner});
    }

    $scope.createRRSet = function(doNotReattempt) {
        $scope.rrsetJson = angular.toJson($scope.rrset);
        $scope.saveRequest(prepareRRSetResource(),
            {'zoneName':$scope.rrsetPathParam.zone, 'recordType':$scope.rrsetPathParam.recordType, 'owner':$scope.rrsetPathParam.owner},
            $scope.rrsetJson);
    }

    $scope.updateRRSet = function(doNotReattempt) {
        $scope.rrsetJson = angular.toJson($scope.rrset);
        $scope.updateRequest(prepareRRSetResource(),
                    {'zoneName':$scope.rrsetPathParam.zone, 'recordType':$scope.rrsetPathParam.recordType, 'owner':$scope.rrsetPathParam.owner},
                    $scope.rrsetJson);
    }

    function massageRDPoolJson() {
        var origJson = angular.toJson($scope.rdpool);
        var replacedJson = origJson.replace("context", "@context");
        $scope.rdpoolJson = replacedJson;
    }

    $scope.createRDPool = function() {
        massageRDPoolJson();
        $scope.saveRequest(prepareRRSetResource(),
            {'zoneName':$scope.rdpoolPathParam.zone, 'recordType':$scope.rdpoolPathParam.recordType, 'owner':$scope.rdpoolPathParam.owner},
            $scope.rdpoolJson);
    }

    $scope.getRDPoolOfZone = function() {
        $scope.getRequest(prepareRRSetResource(), {'zoneName':$scope.rdpoolPathParam.zone});
    }

    $scope.getRDPoolOfZoneAndType = function() {
        $scope.getRequest(prepareRRSetResource(),
            {'zoneName':$scope.rdpoolPathParam.zone, 'recordType':$scope.rdpoolPathParam.recordType});
    }

    $scope.updateRDPool = function() {
        massageRDPoolJson();
        $scope.updateRequest(prepareRRSetResource(),
            {'zoneName':$scope.rdpoolPathParam.zone, 'recordType':$scope.rdpoolPathParam.recordType, 'owner':$scope.rdpoolPathParam.owner},
            $scope.rdpoolJson);
    }

    $scope.deleteRDPool = function(doNotReattempt) {
        $scope.deleteRequest(prepareRRSetResource(),
            {'zoneName':$scope.rdpoolPathParam.zone, 'recordType':$scope.rdpoolPathParam.recordType, 'owner':$scope.rdpoolPathParam.owner});
    }
}