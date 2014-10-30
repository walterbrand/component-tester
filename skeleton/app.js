angular.module('app',[])
    .run(function($templateCache){
        $templateCache.put('/skeleton.html','<div>' +
            '<input ng-model="data.numbers"  ng-change="onChange()" ng-blur="onBlur()" ng-focus="onFocus()" mask="0000 LL"/>' +
            '<input ng-model="data.letters" ng-disabled="{{rbDisabled}}" ng-change="onChange()" ng-blur="onBlur()" ng-focus="onFocus()"/>' +
            '{{placeholder}}' +
            '</div>')

        $templateCache.put('/validationmessages.html','<ul><li ng-repeat="message in messages()">{{message}}</li></ul>')
    })