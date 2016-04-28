angular.module('app.directives', [])
.directive('prAvatar', [function(){
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      name: '=',
      size: '='
    },
    link: function(scope, element, attrs) {
      
      var img = angular.element('<img>');
      img.attr('width', scope.size + 'px');
      img.attr('height', scope.size + 'px');
      element.after(img);
      element.detach();
      
      var settings = {
          heads: ['img/avatar/head.png'],
          eyes: [],
          mouths: [],
          noses: []
      };
      
      for(var i=1; i<=6; i++) {
          settings.eyes.push('img/avatar/eye' + i + '.png');
          settings.mouths.push('img/avatar/mouth' + i + '.png');
          settings.noses.push('img/avatar/nose' + i + '.png');
      }

      function generate() {
        if(!scope.name || !scope.size) {
          return;
        }
        
        img.attr('width', scope.size + 'px');
        img.attr('height', scope.size + 'px');
        
        var g = new polymath.avatar.generator(settings);
		    g.generate(scope.name, scope.size).then(function(canvas) {
          img.attr('src', canvas.toDataURL());
        });
		  }
      
      scope.$watch('name', generate);
      scope.$watch('size', generate);
    }
  }
}])
.directive('prPrompt', ['ttsService', function(ttsService) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      say: '='
    },
    link: function (scope) {
      scope.play = function() {
        ttsService.play(scope.say);
      };
      
      scope.$watch('say', function() {
        if(scope.say && scope.say.length > 0) {
          scope.play();
        }
      });
    }
  };
}])
.directive('prListen', [function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      expect: '=',
      success: '&onSuccess',
      failure: '&onFailure',
    },
    link: function (scope, element, attrs) {
      
      var failureCount = 0;
                  
      SpeechKITT.annyang();
      SpeechKITT.setInstructionsText('');
      SpeechKITT.setStylesheet('lib/speechKitt/themes/flat.css');
      SpeechKITT.vroom();
      SpeechKITT.startRecognition();
      SpeechKITT.show();
      
      annyang.addCallback('resultNoMatch', function(phrases) {
				scope.$apply(function(){
					/*
					if(phrases && phrases.length > 0) {
						var w = scope.expect.word.toLowerCase();
						for(var i=0; i<phrases.length; i++) {
							var p = phrases[i].toLowerCase().indexOf(w);
							if(p >= 0) {
								scope.success()(scope.expect);
								SpeechKITT.abortRecognition();
								return;
							}
						}
					}*/
					failureCount++;
					if(scope.failure && scope.failure()) {
						scope.failure()(scope.expect, failureCount);
					}
				});
      });
      
      element.on('$destroy', function() {
        annyang.pause();
        annyang.removeCallback();
        SpeechKITT.hide();
      });
      
      scope.$watch('expect', function() {
        annyang.removeCommands();
        if(!scope.expect){
          return;
        }
        
        var cmd = {};
        cmd[scope.expect.word] = function() { 
					scope.$apply(function(){
						annyang.pause();
						SpeechKITT.hide();
						scope.success()(scope.expect);
					});
        };
        annyang.resume();
				SpeechKITT.show();
        annyang.addCommands(cmd);
      });
    }
  };
}]);

