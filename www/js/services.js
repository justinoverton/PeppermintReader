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

angular.module('app.services', [])

.service('storage', function() {
    
    var storage = window.localStorage;
    var parse = function(s) {
         return JSON.parse(s, function(key, value){
            if(value && value._t) {
                var ret = new (goog.getObjectByName(value._t))();
                angular.extend(ret, value);
                return ret;
            } else {
                return value;
            }
        });
    };
    
    this.read = function(key){
        var val = storage.getItem(key);
        if(val)
            return parse(val);
        return null;
    };
    
    this.write = function(key, value){
        storage.setItem(key, JSON.stringify(value));
    };
    
    this.remove = function(key) {
        storage.removeItem(key);
    };
})

.service('profileService', ['storage', function(storage) {
    
    var profiles = storage.read('profiles') || [];
    var cachedProfile = null;
    
    this.list = function() {
        return profiles;        
    };
    
    this.add = function(p) {
        profiles.push(angular.extend(new peppermintReader.model.profileStub(), {name: p.name, avatar: p.avatar}));
        storage.write('profiles', profiles);
        storage.write('profiles.' + p.name, p);
    };
    
    this.get = function(name) {
        
        if(!cachedProfile || cachedProfile.name !== name) {
            cachedProfile = storage.read('profiles.' + name);
        }
        
        return cachedProfile; 
    };
    
    this.save = function(p) {
        storage.write('profiles.' + p.name, p);
    };
}])

.service('lessonService', ['$http', function($http) {
    
    var lessons = [];
    
    $http.get('lessons/index.json').then(function(resp){
        
        for(var i=0; i<resp.data.length; i++){
            lessons.push(resp.data[i]);
        }
        
    }, function(err){
        console.log(err);
    }); 
       
    this.list = function() {
        return lessons;        
    };
}]);
