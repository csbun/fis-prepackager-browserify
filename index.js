'use strict';

var path = require('path');
var through = require('through');
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
    }
    return content;
};


var fisCompileSettings = (fis.compile || '').settings || {};
var URI_REG = /\b__uri\(\s*('|")([^'"]+)\1\s*\)/g;
/**
 * Browserify transform
 * change `__uri('xxx')` to real path
 * @param  {string} file [description]
 */
function urify(inputFileRealPath) {
    var chunks = [];

    var onwrite = function (buffer) {
      chunks.push(buffer);
    };

    var onend = function () {
        var contents = Buffer.concat(chunks)
            .toString('utf8')
            .replace(URI_REG, function (match, quotmark, depFileName) {
                var depFile = fis.uri(depFileName, path.dirname(inputFileRealPath));
                if (depFile && depFile.file) {
                    var url = depFile.file.getUrl(fisCompileSettings.hash, fisCompileSettings.domain);
                    return quotmark + url + quotmark;
                } else {
                    console.error('\n' + depFileName + ' NOT found from ' + inputFileRealPath);
                    return match;
                }
            });
      this.queue(contents);
      this.queue(null);
    };

    return through(onwrite, onend);
}
