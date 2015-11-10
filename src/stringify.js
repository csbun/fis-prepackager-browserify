'use strict';

var PROJECT_DIR = fis.project.getProjectPath();

var path = require('path');
var through = require('through');
var minify = require('html-minifier').minify;

function hasStringifiableExtension (filename, extensions) {
    var fileExtName = path.extname(filename).toLowerCase();
    return extensions.indexOf(fileExtName) >= 0;
}

function content2string (content) {
  return 'module.exports = ' + JSON.stringify(content) + ';\n';
}

module.exports = function (extensions, htmlMinifierOptions, fisRet) {
    if (!extensions) {
        extensions = [];
    }
    if (!fisRet) {
        fisRet = {};
    }

    return function (inputFileRealPath) {
        if (!hasStringifiableExtension(inputFileRealPath, extensions)) {
            return through();
        }

        var onwrite = function () {};
        var onend = function () {
            var retSrc = '/' + path.relative(PROJECT_DIR, inputFileRealPath).replace(/\\/g, '/');
            var contentFile = fisRet.src[retSrc];
            var content = contentFile ?
                contentFile.getContent() :
                '<div style="color:red">file `' + retSrc + '` NOT found!</div>';
            this.queue(content2string(minify(content, htmlMinifierOptions || {})));
            this.queue(null);
        };
        return through(onwrite, onend);
    };
};
