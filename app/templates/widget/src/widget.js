mxw().onready(function() {

    // The widget model
    mxw().module('widget').model('widgetModel', function() {
        return {};
    });

    // The widget view
    mxw().module('widget').view('widgetView', function() {

        return {
            container: '#widget',
            template: ''
        }

    });

    // The widget controller
    mxw().module('widget').controller('widgetController', function() {

        return {
        };

    });

});