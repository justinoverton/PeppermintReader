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
    console.log('init storage');
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
        p = angular.extend(new peppermintReader.model.profile(), p);
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

.service('ttsService', [function() {
    
    meSpeak.loadConfig("lib/mespeak/mespeak_config.json");
    meSpeak.loadVoice("lib/mespeak/voices/en/en-us.json");
      
    this.play = function(phrases) {
      
      var arr = phrases.slice(0, phrases.length);
      
      function callback() {
        if(arr.length > 0) {
          var p = arr.shift();
          if(p.audio) {
            //TODO: Play sound file
          }
          //else
          if(p.word) {
            //TODO: Attempt to use IPA (phonetic alphabet) based voice
            meSpeak.speak(p.word, {}, callback);
          } else {
            meSpeak.speak(p, {}, callback);
          }
        }
      }
      
      callback();
    };
}])

.service('lessonService', ['$http', '$q', function($http, $q) {
    
    var data = {
      words: {},
      lessons: []
    };
    
    var promise = $http.get('lessons/index.json').then(function(resp){
        
      for(var i=0; i<resp.data.lessons.length; i++){
        data.lessons.push(resp.data.lessons[i]);
      }
      data.words = resp.data.words;
      
      return data;
    }, function(err){
        $q.reject(err.data);
    });
    
    this.list = function() {
        return data.lessons;
    };
    
    this.get = function(id) {
      return promise.then(function(data){
        for(var i=0; i<data.lessons.length; i++){
          if(data.lessons[i].id == id) {
            return data.lessons[i];
          }
        }
        return null;
      });
    };
    
    function getAnswer(words, blacklist) {
      var ans = null;
      do {
        ans = words[parseInt(Math.random() * words.length)];
      } while(blacklist[ans] === true);
      
      return ans;
    }
  
    function shuffle(arr) {
      for(i = arr.length-1; i > 0; i--) {
        var idx = parseInt(Math.random() * i);
        var tmp = arr[i];
        arr[i] = arr[idx];
        arr[idx] = tmp;
      }
      return arr;
    }
    
    this.planLesson = function(story, profile) {
      
      var plan = [];
      for(var i=0; i < story.wordSet.length; i++) {
        var w = story.wordSet[i];
        var prof = profile.words[w];
        if(!prof) {
          prof = new peppermintReader.model.wordProfeciency();
          prof.word = w;
          profile.words[w] = prof;
        }
        
        var bl = {};
        bl[w] = true;
        var a = getAnswer(story.wordSet, bl);
        bl[a] = true;
        var b = getAnswer(story.wordSet, bl);
        
        var answers = shuffle([data.words[w],data.words[a],data.words[b]]);
        var types = ['sight']; //['phonic', 'sight'];
        if(data.words[w].image) {
          types.push('picture');
        }
        for(var j=0; j<types.length; j++) {
          var stat = prof[types[j] + 'Stats'].getAccuracy();
          var inc = (1 - stat) * 4;
          for(var k=0; k<inc; k++){
            plan.push({
              activity: types[j], 
              word: data.words[w],
              rand: Math.random(),
              a: answers[0],
              b: answers[1],
              c: answers[2]});
          }
        }
      }
      
      shuffle(plan);
      
      return plan;
    };
}]);
