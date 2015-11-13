'use strict';

var deasync = require('deasync');
var browserify = require('browserify');
var debowerify = require('debowerify');
var uglify = require('uglify-js').minify;

var urify = require('./urify');
var stringify = require('./stringify');

module.exports = function (file, fisRet, fisSettings, fisOpt) {
    fisSettings = fisSettings || {};
    var content = '';
    var isDone = false;

    // do browserify
    browserify(file.realpath, fisSettings.browserify || {})
        .transform(stringify(['.tpl', '.html'], fisSettings['html-minifier'], fisRet)) // 支持 require(tpl/html)
        .transform(debowerify) // 支持 bower
        .transform(urify) // 支持 fis 的 __uri() 资源定位
        .on('file', function (depFilePath) {
            // find dependences
            if (depFilePath !== file.realpath) {
                file.cache.addDeps(depFilePath);
            }
        })
        .bundle(function (err, buff) {
            if (err) {
                content = 'console.error(' + JSON.stringify(err.message) + ');' +
                          'console.error(' + JSON.stringify(err) + ');';
            } else {
                content = buff.toString();
            }
            isDone = true;
        });

    // 使用 deasync 让 browserify 同步输出到 content
    deasync.loopWhile(function (){
        return !isDone;
    });

    // 如果 -o 优化，则压缩 js
    if (fisOpt.optimize) {
        content = uglify(content, {
            fromString: true
        }).code;
    }
    file.setContent(content);
    // 文件更新到 release 目录
    fisOpt.beforeCompile(file);
};
