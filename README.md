# scrat-postprocessor-browserify

A browserify postprocessor for [fis](http://fex-team.github.io/fis-site/) / [Scrat](http://scrat.io) with default transforms:

- [stringify](https://www.npmjs.com/package/stringify)
- [debowerify](https://www.npmjs.com/package/debowerify)

## Usage

You can use all [browserify opts](https://github.com/substack/node-browserify#browserifyfiles--opts): 

```javascript
fis.config.set('settings.postprocessor.browserify', {
    // browserify opts
    opts: {
        debug: true
    }
});
fis.config.set('modules.postprocessor.js', 'browserify');
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
