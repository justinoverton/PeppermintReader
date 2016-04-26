/*
PeppermintReader
Copyright (C) 2016 Justin Overton

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
angular.module('app.controllers', [])
     
.controller('loginCtrl', ['$scope', 'profileService', function($scope, profileService) {
    
    $scope.profiles = profileService.list();
    
}])
   
.controller('signupCtrl', ['$scope', 'profileService', '$location', function($scope, profileService, $location) {
    
    $scope.name = '';
    $scope.error = null;
    
    $scope.create = function() {
        if(!this.name || !this.name.trim || !this.name.trim()) {
            return;
        }
        
        var existing = profileService.get(this.name);
        if(existing == null) {
            profileService.add({name: this.name});
            $location.replace();
            $location.path('/lessons/' + this.name);
        } else {
            this.error = 'Name already in use';
        }
    };
}])
   
.controller('lessonsCtrl', ['$scope', '$stateParams', 'profileService', 'lessonService', function($scope, $stateParams, profileService, lessonService) {
    $scope.profile = profileService.get($stateParams.profileName);
    $scope.lessons = lessonService.list();
}])
   
.controller('lessonCtrl', ['$scope', '$stateParams', 'profileService', 'lessonService', function($scope, $stateParams, profileService, lessonService) {
  $scope.profile = profileService.get($stateParams.profileName);
  $scope.lesson = null;
  $scope.plan = null;
  $scope.currentActivity =null;
  $scope.activityTemplate = null;
  
  lessonService.get($stateParams.lessonId).then(function(data){
    $scope.lesson = data;
    $scope.plan = lessonService.planLesson(data, $scope.profile);
    
    $scope.currentActivity = $scope.plan.shift();
    $scope.activityTemplate = '';
    if($scope.currentActivity.activity == 'phonic') {
      $scope.activityTemplate = 'templates/phonic.html';
    } else if($scope.currentActivity.activity == 'sight') {
      $scope.activityTemplate = 'templates/sight.html';
    } else if($scope.currentActivity.activity == 'picture') {
      $scope.activityTemplate = 'templates/picture.html';
    }
  });
  
  $scope.answer = function(w) {
    var stat = $scope.profile.words[w][$scope.currentActivity.activity + 'Stats'];
    if(w == $scope.currentActivity.word.word) {
      //correct!
      //TODO: Some sort of transition animation
      stat.increment(true);
      //TODO: if plan is done show results of lesson
      $scope.currentActivity = $scope.plan.shift();
      profileService.save($scope.profile);
      return true;
    } else {
      stat.increment(false);
      //TODO: hint system
      return false;
    }
  };
  
}]);
 