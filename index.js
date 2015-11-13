'use strict';

var browserify = require('./src/browserify');

module.exports = function (ret, conf, settings, opt) {
    fis.util.map(ret.src, function (subpath, file) {
        if (file.isLayout && file.isJsLike) {
            // 处理入口 js
            browserify(file, ret, settings, opt);
        }
    });
};
