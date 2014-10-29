angular.module('app').directive('zipcode', ['$templateCache', '$timeout', function ($templateCache, $timeout) {

    function NgModelHandler(scope, ngModelController) {
        var timeout = null;
        function mask(input){
            if (input.length > 4) {
                input= input.substr(0,4);
            }
            return input;
        }

        function onChange() {
            console.log('onchange')
            scope.data.numbers = mask(scope.data.numbers);
            ngModelController.$setViewValue(scope.data.numbers + ' ' + scope.data.letters);
        }

        function $render() {
            var zip = ngModelController.$viewValue.split(' ');
            scope.data.numbers = zip[0];
            scope.data.letters = zip[1];
        }

        function onFocus() {
            console.log('onfocus')
            $timeout.cancel(timeout);
        }

        function onBlur() {
            console.log('onblur')
            timeout = $timeout(function(){onChange()});
        }

        return {
            onChange: onChange,
            $render:$render,
            onBlur : onBlur,
            onFocus : onFocus
        }
    }

    function compile(tElem, tAttr) {
        var ngModelHandler;

        tAttr.placeholder = tAttr.placeholder || 'Default placeholder';

        return function (scope, elem, attr, ngModelController) {
            ngModelHandler = new NgModelHandler(scope, ngModelController);

            scope.data = {};
            ngModelController.$render = ngModelHandler.$render;
            scope.onChange = ngModelHandler.onChange;
            scope.onBlur = ngModelHandler.onBlur;
            scope.onFocus = ngModelHandler.onFocus;
        }
    }

    function template(tElem, tAttr) {
        var template = $templateCache.get('/skeleton.html')
        var messages = tElem.html();
        return '<div>' + template + messages + '</div>';
    }

    return {
        restrict: 'E',
        template: template,
        compile: compile,
        scope: {
            placeholder : '@',
            rbDisabled : '@',
            mask : '@'
        },
        require: 'ngModel'
    }
}])