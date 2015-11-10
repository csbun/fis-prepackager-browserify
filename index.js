'use strict';

var packLayoutHtml = require('./src/pack-layout-html');
var browserify = require('./src/browserify');

module.exports = function (ret, conf, settings, opt) {
    fis.util.map(ret.src, function (subpath, file) {
        // 只处理入口文件
        if (file.isLayout) {
            if (file.isHtmlLike) {
                // 处理入口 html
                packLayoutHtml(file, ret, settings, opt);
            } else if (file.isJsLike) {
                // 处理入口 js
                browserify(file, ret, settings, opt);
            }
        }

        // 如果 -p 打包且指定了 packRelease，则替换 release 路径
        if (opt.pack && file.hasOwnProperty('packRelease')) {
            file.release = file.packRelease;
            if (typeof file.release === 'string') {
                file.release = file.release.replace(/\.(less|scss|sass)$/, '.css');
            }
        }
    });
};
