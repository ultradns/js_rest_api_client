'use strict';

function Ctrl($scope, $http, $parse) {
  // default values
  $scope.apiurl = 'http://localhost:8080/v1';
  $scope.username = 'teamrest';
  $scope.password = 'Teamrest1';

  // Helper function to assign default initial values
  $scope.assign = function(variable, value) {
    var getter = $parse(variable);
    var setter = getter.assign;
    setter($scope, value);
  }

  // default zone creation values
  $scope.assign('zone.properties.type', 'PRIMARY');
  $scope.assign('zone.primaryCreateInfo.createType', 'NEW');
  $scope.assign('zone.primaryCreateInfo.forceImport', 'true');

  // default rr set creation values

  $scope.assign('rrset.profile.context', 'http:\/\/schemas.ultradns.com\/RDPool.jsonschema');
  $scope.assign('rrset.profile.order', 'RANDOM');
  $scope.assign('rrset.profile.description', 'This is a great RD Pool');
  $scope.assign('rrset.ttl', '300');

  $scope.assign('rrset.rdata', ['1.2.3.4', '2.4.6.8', '3.5.7.8']);
  // $scope.rdata = ['1.2.3.4', '2.4.6.8', '3.5.7.8'];

  $scope.authorize = function() {
    $http({method:'POST',
        url:$scope.apiurl + '/authorization/token',
        data:"grant_type=password&username=" + $scope.username + "&password=" + $scope.password,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .success(function (data, status, headers, config) {
            $scope.generalResponse = data;
            $scope.authResponse = data;
        })
        .error(function (data, status, headers, config) {
            $scope.authResponse = '';
            $scope.generalResponse = data;
        });
  };

  $scope.authorizeWithRefreshToken = function(callback) {
      $http({method:'POST',
          url:$scope.apiurl + '/authorization/token',
          data:"grant_type=refresh_token&refresh_token=" + $scope.authResponse.refreshToken,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
          .success(function (data, status, headers, config) {
            $scope.authResponse = data;
            $scope.generalResponse = data;
            if(callback != null) {
                callback();
            }
          })
          .error(function (data, status, headers, config) {
              $scope.authResponse = '';
              $scope.generalResponse = data;
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
              $scope.generalResponse = data;
          });
    };


    $scope.makeAuthorizedRequest = function(requestUrl, method, inputLoad, doNotReattempt) {
        $http({method: method,
            url:$scope.apiurl + requestUrl,
            data: inputLoad,
            withCredentials: true,
            headers: {'Authorization': 'Bearer ' + $scope.authResponse.accessToken}})
            .success(function (data, status, headers, config) {
                $scope.generalResponse = data;
            })
            .error(function (data, status, headers, config) {
                $scope.generalResponse = data;
                var errorCode = $scope.generalResponse.errorCode;

                // reattempt after refreshing token. Only do so once to make sure that we do not keep retrying
                // also attempt only if it is an auth error and not anything else.
                if(errorCode == '60001' && doNotReattempt != 'true') {
                    // specifying callback to be called on success of refresh token retrieval
                    // the callback will attempt to make another request with new token values
                    $scope.authorizeWithRefreshToken(function() {
                        $scope.makeAuthorizedRequest(requestUrl, method, inputLoad, 'true');
                    });
                }
            });
      };

    $scope.createZone = function() {
        $scope.zoneJson = angular.toJson($scope.zone);
        $scope.makeAuthorizedRequest('/zones', 'POST', $scope.zoneJson);

    }

    $scope.massageRRSetJson = function() {
        var origJson = angular.toJson($scope.rrset);
        var replacedJson = origJson.replace("context", "@context");
        $scope.rrsetJson = replacedJson;
    }

    $scope.createRRSet = function() {
        $scope.massageRRSetJson();
        $scope.makeAuthorizedRequest('/zones/' + $scope.rrsetPathParam.zone + '/rrsets/' + $scope.rrsetPathParam.recordType + "/" + $scope.rrsetPathParam.owner,
            'POST', $scope.rrsetJson);
    }

    $scope.updateRRSet = function() {
        $scope.massageRRSetJson();
        $scope.makeAuthorizedRequest('/zones/' + $scope.rrsetPathParam.zone + '/rrsets/' + $scope.rrsetPathParam.recordType + "/" + $scope.rrsetPathParam.owner,
            'PUT', $scope.rrsetJson);
        }
}
