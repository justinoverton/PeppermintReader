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
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
.config(["$httpProvider", function ($httpProvider) {
    
    function initClasses(input) {
      if (!input)
          return input;

      if (typeof input !== "object") return;
      if(input.hasOwnProperty('_t')) {
        var ret = new (goog.getObjectByName(input._t))();
        input = angular.extend(ret, input);
      }

      for (var key in input) {
          if (!input.hasOwnProperty(key)) continue;

          var value = input[key];
          if (typeof value === "object") {
              // Recurse into object
              input[key] = initClasses(value);
          }
      }
      
      return input;
    }

    $httpProvider.defaults.transformResponse.push(function (responseData, headersGetter) {
      if (!headersGetter)
          return responseData;

      var headers = headersGetter();
      if (headers && headers['content-type'] && headers['content-type'].indexOf('application/json') > -1) {
          return initClasses(responseData);
      }
      return responseData;
    });
}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})