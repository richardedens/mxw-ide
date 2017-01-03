/*global logger*/
/*
    mxw
    ========================

    @file      : mxw.js
    @version   : 1.0
    @author    : Gerhard Richard Edens
    @date      : Mon, 21 Nov 2016 16:21:02 GMT
    @copyright : mxw.com
    @license   : MIT

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxw/lib/mxw.core.min",
    "dojo/dom-class"
], function (declare, _WidgetBase, _ml, domClass) {
    "use strict";
    
    // Creating controller, module and view for this widget
    mxw().debug(true);
    mxw().config({
    });

    mxw().module('core').model('coreModel', function() {

        return {
            numberToUse: 0
        };

    });

    mxw().module('core').view('coreView', function() {

        return {
            container: '.mx-mxw-container',
            template: '<div data-mxw-module="core">This is a mxw view, introducing two-way databinding with Mendix: <span data-mxw-model="coreModel.numberToUse"></span></div>'
        };

    });

    mxw().module('core').controller('coreController', function() {

        var chk = false,
            widgetId = '',
            currentVersion = 0,
            js = '',
            css = '';
        
        return {
            stopChecking: function() {
                clearInterval(chk);  
            },
            init: function(id) {
                
                // Set the widgetId to the id givin from Mendix.
                widgetId = id;
                
                // Get the default mxw view and render it at the widget location.
                var view = mxw().getView('core', 'coreView');
                view.setContainer(id);
                view.render(function(){
                    
                    var model = mxw().getModel('core', 'coreModel');
                    model.init();
                    
                });
                
                // Check for a new version from the MXW application.
                chk = setInterval(this.checkNewVersion, 3000);
                
                if (mxw('.mxw-toast').length === 0) {
                    mxw('body').append('<div class="mxw-toast mxw-hidden"></div>')
                }
                
                
            },
            checkNewVersion: function() {
                mxw().doGET({
                    url: 'http://localhost:3001/mxw.json'
                }, function(data){
                   if (currentVersion < data.version) {
                       currentVersion = data.version;
                       mxw('.mxw-toast').removeClass('mxw-hidden');
                       mxw('.mxw-toast').addClass('mxw-visible');
                       mxw('.mxw-toast').html('Version: ' + data.version);
                       
                       // Autoload new version of the widget!
                       mxw().doGET({
                            url: 'http://localhost:3001/widget.js'
                       }, function(data){
                           js = data;
                           js = js.split('#widget').join(widgetId + ' .widgetContent');
                           js = js.split('\'widget\'').join('\'' + widgetId.replace('#','') + '\'');
                           js = js.split('"widget"').join('"' + widgetId.replace('#','') + '"');
                           js = js.split('"widget').join('"' + widgetId.replace('#',''));
                           js = js.split('\'widget').join('\'' + widgetId.replace('#',''));
                           console.log("MXW - transformed javasript to:");
                           console.log(js);
                           mxw().doGET({
                                url: 'http://localhost:3001/widget.css'
                           }, function(data){
                               css = data;
                               css = css.split('#widget').join(widgetId + ' .widgetContent');
                               // Load new version!
                               mxw(widgetId).html('<div class="widgetContent"></div><style>' + css + '</style>' + '<script type="text/javascript">' + js + '</script>');
                           });
                       });
                   } 
                }, function(err){});
            }
        }

    });
    
    // Declare widget's prototype.
    return declare("mxw.widget.mxw", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        module: "",
        controller: "",
        method: "",
        
        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            if (this.readOnly || this.get("disabled") || this.readonly) {
              this._readOnly = true;
            }
            
            var controller = mxw().getController('core', 'coreController');
            controller.init("#" + this.id);
           
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            mendix.lang.nullExec(callback);
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
            logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
            logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }

        
    });
});

require(["mxw/widget/mxw"]);
