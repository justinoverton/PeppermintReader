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
   
.controller('phonicsCtrl', function($scope) {
    
})
 