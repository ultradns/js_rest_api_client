'use strict';
function RRSetCtrl($scope, $http, $parse, $resource) {
    /** RRSet Functions - should ideally go into a separate JS file**/
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
    /** End RRSet Functions **/
}