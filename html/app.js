var routerApp = angular.module('routerApp', ['ui.router']);
routerApp.factory('userFactory', ['$http', function($http) {

  var u = {
    users: [],
    user: {}
  };
  
  u.getAll = function() {
	return $http.get('/users').success(function(data){
		angular.copy(data, u.users);
	});
  };
  
  u.create = function(user) {
    console.log("create User" + user);
	return $http.post('/users', user).success(function(data){
		u.users.push(data);
	});
  };

  u.upmatch = function(user) {
	return $http.put('/users/' + user._id + '/upmatch')
	  	.success(function(data){
	    		user.matches += 1;
	  	});
  };

  u.upwins = function(user) {
        return $http.put('/users/' + user._id + '/upwins')
                .success(function(data){
                        user.wins += 1;
                });
  };

  u.uplosses = function(user) {
        return $http.put('/users/' + user._id + '/uplosses')
                .success(function(data){
                        user.losses += 1;
                });
  };

  u.moneymanip = function(amount, user) {
        return $http.put('/users/' + user._id + '/upmatch'+ amount)
                .success(function(data){
                        user.matches += amount;
                });
  };

  u.getUser = function(id) {
	return $http.get('/users/' + id).success(function(data){
		angular.copy(data, u.user);
	});
  };

  return u;
}])

routerApp.config([
  '$stateProvider',
  '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/login.html'
  }).state('securityQ', {
    url: '/securityQ',
    templateUrl: '/securityQ.html',
    controller: 'SecureCtrl'
  });
}])
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
  'postFactory', 
  function($scope, $stateParams, postFactory){
	postFactory.u.getAll();
	$scope.users = postFactory.u.users;
	$scope.addUser = function() {
    console.log("add user");
		if($scope.username === '' || $scope.password === '') { return; }
		postFactory.u.create({
		username: $scope.username,
		password: $scope.password,
		});
		$scope.formContent='';
	};
  }
]);
