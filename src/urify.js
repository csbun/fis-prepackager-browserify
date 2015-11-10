'use strict';

var fisCompileSettings = (fis.compile || '').settings || {};
var URI_REG = /\b__uri\(\s*('|")([^'"]+)\1\s*\)/g;


var path = require('path');
var through = require('through');


/**
 * Browserify transform
 * change `__uri('xxx')` to real path
 * @param  {string} file [description]
 */
module.exports = function (inputFileRealPath) {
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
};
