angular.module('app.directives', [])
.directive('prPrompt', ['ttsService', function(ttsService) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      say: '='
    },
    //templateUrl: 'my-dialog.html',
    link: function (scope) {
      scope.play = function() {
        ttsService.play(scope.say);
      };
      
      scope.$watch('say', function() {
        console.log(scope.say);
        if(scope.say && scope.say.length > 0) {
          scope.play();
        }
      });
    }
  };
}]);

