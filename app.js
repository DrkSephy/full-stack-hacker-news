var app = angular.module('hackerNews', []);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello World!';
}]);