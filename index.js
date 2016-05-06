const CircularJSON = require('circular-json');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const __bundleFuncsCache = {};

const getCachedBundleFunc = (entry, options) => {
  const key = `${entry}#${CircularJSON.stringify(options)}`;

  return __bundleFuncsCache[key];
};

const cacheBundleFunc = (entry, options, bundle) => {
  const key = `${entry}#${CircularJSON.stringify(options)}`;

  __bundleFuncsCache[key] = bundle;
};

const createBundleFunc = (entry, options = {}) => {
  const plugin = Array.isArray(options.plugin) ? options.plugin : [];

  if (plugin.indexOf(watchify) === -1) plugin.push(watchify);

  const b = browserify(Object.assign(watchify.args, options, {
    entries: [entry],
    plugin,
  }));

  b.on('error', err => console.error(err));

  const bundle = () => {
    b.once('log', () => b.close());

    return b
      .bundle()
      .pipe(source(entry))
      .pipe(buffer());
  };

  return bundle;
};

const wrappedBundle = (entry, options) => {
  let bundle = getCachedBundleFunc(entry, options);

  if (bundle === undefined) {
    bundle = createBundleFunc(entry, options);

    cacheBundleFunc(entry, options, bundle);
  }

  return bundle();
};

module.exports = wrappedBundle;
