'use strict';

var deasync = require('deasync');
var browserify = require('browserify');
var stringify = require('stringify');
var debowerify = require('debowerify');

module.exports = function (content, file, conf) {
    if (file.isLayout && file.isJsLike) {
        var isDone = false;
        // do browserify
        browserify(file.realpath, conf.opts || {})
        .transform(stringify(['.tpl', '.html'])) // 支持 require(tpl/html)
        .transform(debowerify) // 支持 bower
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
    }
    return content;
};
