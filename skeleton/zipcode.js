angular.module('app').directive('zipcode', ['$templateCache', '$timeout', function ($templateCache, $timeout) {

    function NgModelHandler(scope, ngModelController, _messages) {
        var timeout = null;
        function mask(input){
            if (input.length > 4) {
                input= input.substr(0,4);
            }
            return input;
        }

        function validate(){
            ngModelController.$setValidity('required', scope.data.numbers !== '');
        }

        function onChange() {
            validate();
            scope.data.numbers = mask(scope.data.numbers);
            ngModelController.$setViewValue(scope.data.numbers + ' ' + scope.data.letters);
        }

        function $render() {
            var zip = ngModelController.$viewValue.split(' ');
            scope.data.numbers = zip[0];
            scope.data.letters = zip[1];
            validate();
        }

        function onFocus() {
            $timeout.cancel(timeout);
        }

        function onBlur() {
            timeout = $timeout(function(){onChange()});
        }

        function messages(){
            var messagesOut =[];
            if (ngModelController.$pristine) {
                return[];
            }
            for (var errorKey in ngModelController.$error) {
                if (ngModelController.$error[errorKey]) {
                    messagesOut.push(_messages[errorKey]);
                }
            }
            return messagesOut;
        }
        return {
            onChange: onChange,
            $render:$render,
            onBlur : onBlur,
            onFocus : onFocus,
            messages : messages
        }
    }

    function compile(tElem, tAttr) {
        var ngModelHandler, messages = {
            "required" : "I am required!"
        },messagesBody = tElem.find('rb-message');

        tAttr.placeholder = tAttr.placeholder || 'Default placeholder';

        tElem.append($templateCache.get('/validationmessages.html'));

        [].forEach.call(messagesBody, function(message){
            var $message = angular.element(message);
            messages[$message.attr('when')] = $message.html();
        });

        messagesBody.remove();

        return function (scope, elem, attr, ngModelController) {
            ngModelHandler = new NgModelHandler(scope, ngModelController, messages);

            scope.data = {};
            ngModelController.$render = ngModelHandler.$render;
            scope.onChange = ngModelHandler.onChange;
            scope.onBlur = ngModelHandler.onBlur;
            scope.onFocus = ngModelHandler.onFocus;
            scope.messages = ngModelHandler.messages;
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