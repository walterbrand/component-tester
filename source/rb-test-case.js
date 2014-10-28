angular.module('rbtest').directive('rbTestCase',[function(){
    return {
        restrict: 'E',
        scope : {
            name : '@',
            action : '&'
        },
        template : function(elem){
            return '<div><button ng-click="handleClick()">{{name}}</button> <br />'+ elem.html()+' </div>';
        },
        link : function(scope){
            scope.handleClick = function(){
                scope.action()
            }
        }

    }
}]);