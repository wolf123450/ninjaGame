var routerApp = angular.module('routerApp', ['ui.router']);
routerApp.factory('user', ['$http', function($http) {

    var u = {
        user: {created: true}
    };

    u.create = function(cb)  {
        return $http.post('/createAccount', u.user).success(function(data) {
            console.log(data);
	    if(data.ok) {
	      window.location.href = '/profile.html';
	      cb(true);
	    }
	    else {
	//	alert("User already exists.  Be more original");
	      this.created = true;
	      cb(false);
	   }
        });
    };

    u.login = function(cb) {
        return $http.post('/login', u.user).success(function(data) {
              console.log(data);
              if (data.ok == true){
                window.location.href = "/profile.html";
		cb(true);
              } 
	      else {
 		cb(false);
	      }
        });
    };

    u.upmatch = function(user) {
        return $http.put('/users/' + user._id + '/upmatch')
            .success(function(data) {
                user.matches += 1;
            });
    };

    u.upwins = function(user) {
        return $http.put('/users/' + user._id + '/upwins')
            .success(function(data) {
                user.wins += 1;
            });
    };

    u.uplosses = function(user) {
        return $http.put('/users/' + user._id + '/uplosses')
            .success(function(data) {
                user.losses += 1;
            });
    };

    u.moneymanip = function(amount, user) {
        return $http.put('/users/' + user._id + '/upmatch' + amount)
            .success(function(data) {
                user.matches += amount;
            });
    };

    u.getUser = function(id) {
        return $http.get('/users/' + id).success(function(data) {
            angular.copy(data, u.user);
        });
    };

    return u;
}])

routerApp.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider.state('login', {
                url: '/login',
                templateUrl: '/login.html'
            }).state('securityQ', {
                url: '/securityQ',
                templateUrl: '/securityQ.html',
                controller: 'SecureCtrl'
            });
        }
    ])
    .controller('SecureCtrl', [
        '$scope',
        '$stateParams',
        function($scope, $stateParams) {
            console.log("SecureFunction");
        }

    ])
    .controller('LoginCtrl', [
        '$scope',
        '$stateParams',
        '$state',
        'user',
        function($scope, $stateParams, $state, user) {
            $scope.user = user;
	    $scope.successfullCreate = true;
	    $scope.successfullLogin = true;
            $scope.changeState = function(url) {
                console.log("Changing state");
                $state.go(url);
            }
            $scope.addUser = function() {
                console.log("Create a user");
                console.log($scope.newname + " " + $scope.newpass);
                if (!$scope.newname || !$scope.newpass ||
                    $scope.newname == '' || $scope.newpass == '') {
                    console.log("No input content");
                    return;
                }
                if ($scope.newpass !== $scope.reenter) {
                    console.log("Password doesnt match");
                    return;
                }
                $scope.user.user = ({
                    username: $scope.newname,
                    password: $scope.newpass,
                });
                console.log("Added a user: " + $scope.newname);
                console.log($scope.user);
                $scope.user.create(function(data) {
		  $scope.successfullCreate = data;
	          console.log($scope.successfullCreate);
		});
                $scope.newname = '';
                $scope.newpass = '';
                $scope.reenter = '';

                //      $state.go('securityQ');
            };

            $scope.login = function() {
                console.log("Logging in");
                if (!$scope.username || !$scope.password ||
                    $scope.username == '' || $scope.password == '') {
                    console.log("No input content");
                    return;
                }

                $scope.user.user = ({
                    username: $scope.username,
                    password: $scope.password,
                });
                $scope.user.login(function(data) { 
		  $scope.successfullLogin = data;
		});
                $scope.username = '';
                $scope.password = '';
            };
        }
    ]);
