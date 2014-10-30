angular.module('app').directive('myvalidator',[function(){
    function link(_,__,__,ngModelController){
        function validate(value){
            ngModelController.$setValidity('myvalidator', value.charAt(0)==='3')
        }

        function parser(viewValue){
            console.log('parser',viewValue);
            validate(viewValue);
            return viewValue;
        }
        function formatter(modelValue){
            console.log('formatter',modelValue);
            validate(modelValue);
            return modelValue;
        }
        ngModelController.$parsers.push(parser);

        ngModelController.$formatters.push(formatter);

    }
    return {
        restrict : 'A',
        require : 'ngModel',
        link : link
    }
}]);