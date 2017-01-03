/* MOONLIGHT UI */
moonlightui('document').ready(function() {

    /* MOONLIGHT UI - Tree's */
    moonlightui().energize('.moonlightui-main');

    /* MOONLIGHT UI - Register a module and a controller on the module. */
    moonlightui().module('devices').controller('devicesController', function(){

        var mainController = {

            selectDevice: function(element) {
                var img = moonlightui(element).data('device');
                moonlightui('#deviceSelected').attr('src', img);
            }

        };

        return mainController;

    });

    /* MOONLIGHT UI - Register a module and a controller on the module. */
    moonlightui().module('demo').controller('mainController', function(){

        var jsEditor = ace.edit('jsEditor');
        var cssEditor = ace.edit('cssEditor');
        var htmlEditor = ace.edit('htmlEditor');
        
        var updateJSEditor = false;
        var updateHTMLEditor = false;
        var updateCSSEditor = false;
        
        var mainController = {

            createProject: function() {

                var electron = require('electron');
                var mainProcess = electron.remote.require('./index');
                var fs = electron.remote.require('fs');

                var model = moonlightui().getModel('core', 'projectModel');
                var projectPath = model.get('projectPath');

                var html = '<!DOCTYPE><html><head><title>example</title>';
                    html += '<style>body{background: white;}</style><style>' + cssEditor.getValue() + '</style></head>';
                    html += '<body>' + htmlEditor.getValue();
                    html += '<script type="text/javascript" src="lib/mxw.core.js"></script><script type="text/javascript">' + jsEditor.getValue() + '</script>';
                    html += '</body></html>';

                fs.readFile(projectPath + ((mainProcess.isWin) ? '\\' : '/') + 'mxw.json', 'utf8', function(err, data) {
                    if(err) {
                        return console.log(err);
                    }
                    var versionJson = JSON.parse(data);
                    versionJson.version = (versionJson.version + 1);
                    fs.writeFile(projectPath + ((mainProcess.isWin) ? '\\' : '/') + 'index.html', html, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        fs.writeFile(projectPath + ((mainProcess.isWin) ? '\\' : '/') + 'widget.js', jsEditor.getValue(), function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            fs.writeFile(projectPath + ((mainProcess.isWin) ? '\\' : '/') + 'widget.css', cssEditor.getValue(), function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                                fs.writeFile(projectPath + ((mainProcess.isWin) ? '\\' : '/') + 'widget.html', htmlEditor.getValue(), function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    fs.writeFile(projectPath + ((mainProcess.isWin) ? '\\' : '/') + 'mxw.json', JSON.stringify(versionJson), function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                        moonlightui('#resultWidget').html('<iframe src="http://localhost:3001/?rnd=' + +(new Date()) + '" width="90%" height="90%" style="position:absolute;left:20px;top:20px;bottom:20px;right:20px;border:1px solid gray;" frameborder=no></iframe>');
                                    });
                                });
                            });
                        });
                    });
                });

            },

            init: function() {

                var self = this;
                jsEditor.setTheme("ace/theme/monokai");
                jsEditor.getSession().setMode("ace/mode/javascript");
                jsEditor.on("change", function() {
                    if (updateJSEditor !== false) {
                        clearTimeout(updateJSEditor);
                    }
                    updateJSEditor = setTimeout(self.createProject,500);
                });
                htmlEditor.setTheme("ace/theme/monokai");
                htmlEditor.getSession().setMode("ace/mode/html");
                htmlEditor.on("change", function() {
                    if (updateHTMLEditor !== false) {
                        clearTimeout(updateJSEditor);
                    }
                    updateJSEditor = setTimeout(self.createProject,500);
                });
                cssEditor.setTheme("ace/theme/monokai");
                cssEditor.getSession().setMode("ace/mode/css");
                cssEditor.on("change", function() {
                    if (updateCSSEditor !== false) {
                        clearTimeout(updateJSEditor);
                    }
                    updateJSEditor = setTimeout(self.createProject,500);
                });


                // Click away intro.
                moonlightui('.intro').on('click', function() {
                   moonlightui(this).css('display','none');
                });
                setTimeout(function() {
                    moonlightui('.intro').css('display', 'none');
                }, 5000);

            },

            selectProject: function() {

                let electron = require('electron');
                let mainProcess = electron.remote.require('./index');
                mainProcess.selectDirectory(function(dest){

                    let src = __dirname + ((mainProcess.isWin) ? '\\templates\\widget' : '/templates/widget');
                    let ncp = electron.remote.require('ncp').ncp;
                    let fs = electron.remote.require('fs');

                    if (fs.existsSync(dest[0] + ((mainProcess.isWin) ? '\\src\\index.html' : '/src/index.html'))) {
                        let model = moonlightui().getModel('core', 'projectModel');
                        model.set('projectPath', dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/'));
                        fs.readFile(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/') + 'widget.js', 'utf8', function(err, data) {
                            if(err) {
                                return console.log(err);
                            }
                            jsEditor.setValue(data, 1);
                            fs.readFile(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/') + 'widget.css', 'utf8', function(err, data) {
                                if(err) {
                                    return console.log(err);
                                }
                                cssEditor.setValue(data, 1);
                                fs.readFile(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/') + 'widget.html', 'utf8', function(err, data) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    htmlEditor.setValue(data, 1);

                                    mainProcess.restartServer(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/'), function () {
                                        moonlightui('#resultWidget').html('<iframe src="http://localhost:3001/" width="90%" height="90%" style="position:absolute;left:20px;top:20px;bottom:20px;right:20px;border:1px solid gray;" frameborder=no></iframe>');
                                    });
                                });
                            });
                        });

                    } else {
                        ncp.limit = 16;
                        console.log('Copying files...');
                        ncp(src, dest[0], function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            let model = moonlightui().getModel('core', 'projectModel');
                            model.set('projectPath', dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/'));
                            fs.readFile(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/') + 'widget.js', 'utf8', function(err, data) {
                                if(err) {
                                    return console.log(err);
                                }
                                jsEditor.setValue(data, 1);
                                fs.readFile(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/') + 'widget.css', 'utf8', function(err, data) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    cssEditor.setValue(data, 1);
                                    fs.readFile(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/') + 'widget.html', 'utf8', function(err, data) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                        htmlEditor.setValue(data, 1);

                                        mainProcess.restartServer(dest[0] + ((mainProcess.isWin) ? '\\src\\' : '/src/'), function () {
                                            moonlightui('#resultWidget').html('<iframe src="http://localhost:3001/" width="90%" height="90%" style="position:absolute;left:20px;top:20px;bottom:20px;right:20px;border:1px solid gray;" frameborder=no></iframe>');
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            },

            demoShowDialog: function(element) {
                moonlightui('#demoDialog').css('top', (moonlightui(element).offset().top) + 'px');
                moonlightui('#demoDialog').css('left', (moonlightui(element).offset().left) + 'px');
                moonlightui('#demoDialog').css('margin-left', '0px');
                moonlightui('#demoDialog').removeClass('hidden');
            }

        };
        mainController.init();

        return mainController;

    });

    /* MOONLIGHT UI - Demo view one */
    moonlightui().module('demo').view('viewOne', function(){
        var viewOne = {
            container: '#demoView',
            templateURL: 'demoView.html'
        };
        return viewOne;
    });

    /* MOONLIGHT UI - Demo view two */
    moonlightui().module('demo').view('viewTwo', function(){
        var viewTwo = {
            container: '#demoView',
            template: 'This is a template from a string.'
        };
        return viewTwo;
    });

    /* MOONLIGHTUI - Demo model */
    moonlightui().module('demo').model('demoModel', function() {

        var demoModel = {
            greeting: ''
        };

        return demoModel;

    });

    /* MOONLIGHT UI - Register a module and a controller on the module. */
    moonlightui().module('demo').controller('demoController', function(){

        /*
         * Using a model can be achieved by using the method getModel.
         * Notice that you can also easily grab a model from a different module?
         * The first parameter is the module.
         * So you can use this model in every controller of every module if you wish.
         */
        var demoModel = moonlightui().getModel('demo','demoModel');

        var demoController = {

            demoShowViewOne: function() {
                var viewOne = moonlightui().getView('demo', 'viewOne');
                viewOne.render(function(template, container){
                    console.log('Altered view to view one.');
                });
            },

            demoShowViewTwo: function() {
                var viewTwo = moonlightui().getView('demo', 'viewTwo');
                viewTwo.render(function(template, container){
                    console.log('Altered view to view one.');
                });
            },

            init: function() {

                demoModel.receive(function(name){
                    console.log('Got new value from "' + name + '": ' + demoModel.get(name));
                });

            }

        };
        demoController.init();

        return demoController;

    });
});