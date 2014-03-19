'use strict';

function AuthCtrl($scope, $http) {
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
        })
        .error(function (data, status, headers, config) {
            $scope.status = status;
        });
  };
}
