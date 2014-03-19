'use strict';

function Ctrl($scope, $http) {
  // default values
  $scope.apiurl = 'http://localhost:8080/v1';
  $scope.username = 'teamrest';
  $scope.password = 'Teamrest1';

  $scope.authorize = function() {
    $http({method:'POST',
        url:$scope.apiurl + '/authorization/token',
        data:"grant_type=password&username=" + $scope.username + "&password=" + $scope.password,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .success(function (data, status, headers, config) {
            $scope.authResponse = data;

           // For reference... delete later
           // $scope.authjson = angular.toJson($scope.authResponse);
        })
        .error(function (data, status, headers, config) {
            $scope.status = status;
        });
  };

  $scope.makeRequest = function(requestUrl, method) {
      $http({method: method,
          url:$scope.apiurl + requestUrl,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
          .success(function (data, status, headers, config) {
              $scope.generalResponse = data;
          })
          .error(function (data, status, headers, config) {
              $scope.status = status;
          });
    };


    $scope.makeAuthorizedRequest = function(requestUrl, method, inputLoad) {
        $http({method: method,
            url:$scope.apiurl + requestUrl,
            data: inputLoad,
            withCredentials: true,
            headers: {'Authorization': 'Bearer ' + $scope.authResponse.accessToken}})
            .success(function (data, status, headers, config) {
                $scope.generalResponse = data;
            })
            .error(function (data, status, headers, config) {
                $scope.status = status;
            });
      };

    $scope.createZone = function() {
        $scope.zone.properties.type = 'PRIMARY';
        //$scope.zone.primaryCreateInfo.createType = 'NEW';
        //$scope.zone.primaryCreateInfo.forceImport = 'true';
        $scope.zoneJson = angular.toJson($scope.zone);
        $scope.makeAuthorizedRequest('/zones', 'POST', $scope.zoneJson)

    }
}
