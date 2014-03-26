'use strict';

function Ctrl($scope, $http, $parse, $resource) {
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

  $scope.assign('rdpool.profile.context', 'http:\/\/schemas.ultradns.com\/RDPool.jsonschema');
  $scope.assign('rdpool.profile.order', 'RANDOM');
  $scope.assign('rdpool.profile.description', 'This is a great RD Pool');
  $scope.assign('rdpool.ttl', '300');
  $scope.assign('rdpool.rdata', ['1.2.3.4', '2.4.6.8', '3.5.7.8']);
  // $scope.rdata = ['1.2.3.4', '2.4.6.8', '3.5.7.8'];

  $scope.assign('rrset.ttl', '300');
  $scope.assign('rrset.rdata', ['1.2.3.4']);

  $scope.prepareResource = function(endpoint) {
    var res = $resource($scope.apiurl + endpoint,null,
        {
          'update': { method:'PUT' }
        });
    $scope.setAuthHeader();
    return res;
  }

  // The need for this method is to account for any changes in the apiurl entered by the user
  $scope.prepareRRSetResource = function() {
    return $scope.prepareResource('/zones/:zoneName/rrsets/:recordType/:owner');
  }


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
        if($scope.authResponse == undefined) {
            $scope.generalResponse = 'Access Token is required to make request';
        } else {
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
            }
      };



    $scope.createZone = function() {
        $scope.zoneJson = angular.toJson($scope.zone);
        $scope.makeAuthorizedRequest('/zones', 'POST', $scope.zoneJson);

    }

    $scope.massageRDPoolJson = function() {
        var origJson = angular.toJson($scope.rdpool);
        var replacedJson = origJson.replace("context", "@context");
        $scope.rdpoolJson = replacedJson;
    }

    $scope.setAuthHeader = function() {
        $http.defaults.headers.common["Authorization"] = "Bearer " + $scope.authResponse.accessToken;
    }

    $scope.success = function(data, status, headers, config) {
        $scope.generalResponse = data;
    }

    $scope.handleError = function(error, doNotReattempt, callback)  {
        $scope.generalResponse = error.data;
        var errorCode = error.data.errorCode;
        if(errorCode == '60001' && doNotReattempt != 'true') {
            // specifying callback to be called on success of refresh token retrieval
            // the callback will attempt to make another request with new token values
            $scope.authorizeWithRefreshToken(callback);
        }
    }

    $scope.createRRSet = function(doNotReattempt) {
        $scope.rrsetJson = angular.toJson($scope.rrset);

        $scope.prepareRRSetResource().save({'zoneName':$scope.rrsetPathParam.zone, 'recordType':$scope.rrsetPathParam.recordType, 'owner':$scope.rrsetPathParam.owner},
            $scope.rrsetJson,
            $scope.success,
            function (error) {
                $scope.handleError(error, doNotReattempt, function() {
                    $scope.createRRSet('true');
                })
            }
        );
    }

    $scope.updateRRSet = function() {
        $scope.rrsetJson = angular.toJson($scope.rrset);
        $scope.prepareRRSetResource().update({'zoneName':$scope.rrsetPathParam.zone, 'recordType':$scope.rrsetPathParam.recordType, 'owner':$scope.rrsetPathParam.owner},
            $scope.rrsetJson,
            $scope.success,
            function (error) {
                $scope.handleError(error, doNotReattempt, function() {
                    $scope.updateRRSet('true');
                })
            }
        );

        // Alternate Solution to use HHTP
//        $scope.makeAuthorizedRequest('/zones/' + $scope.rrsetPathParam.zone + '/rrsets/' + $scope.rrsetPathParam.recordType + "/" + $scope.rrsetPathParam.owner,
//            'PUT', $scope.rrsetJson);
    }

    $scope.createRDPool = function() {
            $scope.massageRDPoolJson();
            $scope.makeAuthorizedRequest('/zones/' + $scope.rdpoolPathParam.zone + '/rrsets/' + $scope.rdpoolPathParam.recordType + "/" + $scope.rdpoolPathParam.owner,
                'POST', $scope.rdpoolJson);
    }

    $scope.updateRDPool = function() {
        $scope.massageRDPoolJson();
        $scope.makeAuthorizedRequest('/zones/' + $scope.rdpoolPathParam.zone + '/rrsets/' + $scope.rdpoolPathParam.recordType + "/" + $scope.rdpoolPathParam.owner,
            'PUT', $scope.rdpoolJson);
    }
}
