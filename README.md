[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

This is a static site generator for pushred.co, built with JavaScript.


How It Works
------------

Templates located in `/server` are named and organized as desired to appear in URLs — each corresponds to a page. Files named `index` or the same as their parent directory are served as `/` wherever they exist in the hierarchy. Content defined in a YAML file (managed outside of this repo) defines a rendering context. Some properties may be run through a Markdown renderer.

Here’s a diagram of how everything is organized:

```
├── .build
│   └── generated static site, Browsersync root
├── blocks
│   └── JS, CSS, and templates for each UI/design element
├── config
│   └── Configuration for the gulp workflow
├── gulpfile.js, helpers, and tasks
│   └── JavaScript modules that compose the gulp workflow
├── node_modules
│   └── third-party code installed from the npm registry and GitHub
└── server
    └── page templates and any static files
```


Dependencies
------------

 - **[node.js and npm][node]** generate new versions of the site and run a local preview server.<br>
    These can be installed together with easy installers downloadable at nodejs.org.

 - **[Install node.js dependencies][npm]** with `npm install`.<br>
    If this runs into any trouble, please try npm’s recommendations on [fixing permissions][npm-permissions].

### Static Site

 - [gulp][gulp] runs tasks written in JavaScript that generate versions of the site from various files in this repo and the specified content folder

 - [markdown-it][markdown-it] parses text formatted with Markdown (following the CommonMark specification) and renders it to HTML

 - [Handlebars templates][handlebars] and it's (mostly) built-in helpers traverse the rendering context and render markup

### Frontend

 - [autoprefixer][autoprefixer] prefixes newer CSS properties that aren’t quite evenly supported yet with their vendor prefixes as defined by caniuse.com

 - [browserify][browserify] bundles all JavaScript into a single file, traversing all of the files and resolving any required modules defined in the CommonJS style.

 - [gulp-svgstore][gulp-svgstore] bundles SVG assets in the site and content folders for [access as a sprite][svg-sprites]. [gulp-svgmin][gulp-svgmin] cleans the files up with SVGO and replaces fill colors with `currentColor` for [styling][svg-styling].

 - [postcss][postcss] compiles all CSS into a single file. It also implements some features that don’t exist in CSS yet while outputting browser-friendly code.

### Hosting

 - [gulp-s3-upload][gulp-s3-upload] uploads any new assets found in the content folder to the `pushred-files` S3 bucket, accessible via CloudFront at `http://files.pushred.co/*`


Local Editing
-------------

```
$ gulp --content <path to folder>
```

This will:

 - Generate a new version of the site with the specified content
 - Launch a preview server for viewing it
 - Open a browser with the preview URL

`<path to folder>` is an absolute path to the Dropbox content folder.<br>
For example: `~/Dropbox/pushred.co/website`.

The content path can also be defined in `/config/content.json` with the property `path`


[autoprefixer]: https://github.com/postcss/autoprefixer
[browserify]: http://browserify.org
[commonmark]: http://commonmark.org
[gulp]: http://gulpjs.com
[gulp-s3-upload]: https://github.com/clineamb/gulp-s3-upload
[gulp-svgmin]: https://github.com/ben-eb/gulp-svgmin
[gulp-svgstore]: https://github.com/w0rm/gulp-svgstore
[markdown-it]: https://github.com/markdown-it/markdown-it
[handlebars]: http://handlebarsjs.com
[svg-sprites]: https://css-tricks.com/svg-symbol-good-choice-icons/
[svg-styling]: http://tympanus.net/codrops/2015/07/16/styling-svg-use-content-css/
[node]: https://nodejs.org
[npm]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally
[npm-permissions]: https://docs.npmjs.com/getting-started/fixing-npm-permissions
[postcss]: https://github.com/postcss/postcss
[yaml]: https://en.wikipedia.org/wiki/YAML
