# fis-prepackager-browserify

A browserify prepackager for [fis](http://fex-team.github.io/fis-site/) / [Scrat](http://scrat.io) with default transforms:

- [debowerify](https://www.npmjs.com/package/debowerify)

## Usage

You can use all [browserify opts](https://github.com/substack/node-browserify#browserifyfiles--opts) and [html-minifier options](https://github.com/kangax/html-minifier#options-quick-reference):

```javascript
fis.config.set('settings.prepackager.browserify', {
    // browserify opts
    browserify: {
        debug: true
    },
    // html-minifier Options
    'html-minifier': {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true
    }
});
fis.config.set('modules.prepackager', 'browserify');
fis.config.set('roadmap.path', [
    {
        // source js
        reg: 'src/**/*.js',
        // `isLayout` should be `TRUE`
        isLayout: true
    },
    {
        // other js `isLayout` != `TRUE`
        reg: 'server/**/*.js'
    }
]);
```
