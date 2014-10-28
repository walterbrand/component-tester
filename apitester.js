angular.module('apitester',[])
    .directive('apiAttribute', ['apiService', function(apiService){
        function link(scope, elem, attrs){
            function getConfig(){
                console.log(scope)
                return scope;
            }
            apiService.register(scope.name, getConfig);
            scope.$watch('value', function(){
                apiService.refresh();
            })
        }
        
        return {
            restrict :'E',
            scope : {
                direction : '@',
                name : '@',
                mode : '@',
                binding : '@',
                value : '@'
            },
            template : '<div name="{{name}}"> ' +
                'omit:<input type="radio" ng-model="mode" value="omit"/> ' +
                'static:<input type="radio" ng-model="mode" value="static"/>'+
                '{{direction}}: <input type="radio" ng-model="mode" value="binding"/>' +
                ' <b>{{name}}</b> ' +
                '<input type="text" ng-model="value" />' +
                '</div>',
            link : link
        }
    }])
    .directive('apiComponentProducer', ['$interpolate', '$compile', 'apiService', function($interpolate, $compile, apiService){
        function link(scope, elem, attr) {
            var template = $interpolate("<{{name}} ></{{name}}>"),
                innerscope;
            
            function produce(){
                if (innerscope) {
                    innerscope.$destroy();
                }
                innerscope = scope.$new();
                elem.html('');
                //elem.append($compile('<b><sample-component do="{{doe.iets}}"></sample-component>{{doe.iets}}</b>')(innerscope));
                template = "<sample-component "+apiService.attributes()+"></sample-component>";
                elem.append($compile("<sample-component "+apiService.attributes()+"></sample-component>")(innerscope))
            }
            
            attr.$observe('controllerscope', function(){
                angular.extend(innerscope, JSON.parse(scope.controllerscope))
            })
            
            apiService.producer(produce);
        }
        return {
            restrict : 'E',
            scope : {
                name : '@',
                config : '@',
                controllerscope : '@'
            },
            link : link
        }
    }])
    .factory('apiService', [function(){
        var producerFn, attrs = {};

        function register(name, config) {
            attrs[name] = config;
        }

        function refresh(){
            producerFn();
        }
        
        function producer(callback){
            producerFn = callback;
            refresh();
        }
      
        function attributes(){
            var attributeString = '', scope;
            for (var attr in attrs) {
                scope = attrs[attr]();
                console.log(scope)
                attributeString = attr + '="{{'+ scope.value +'}}" ' 
            }
            return attributeString;
        }
      
        return {
            register : register,
            producer : producer,
            attributes : attributes,
            refresh : refresh
        }
    }])