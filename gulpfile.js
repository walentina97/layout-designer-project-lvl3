const { src, dest, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const concat = require("gulp-concat");
const svgSprite = require("gulp-svg-sprite");

const browsersync = () => {
  browserSync.init({
    server: { baseDir: "./build/" },
    notify: false,
    online: true,
  });
};

const copy = () => {
  return src(["app/images/*.jpg"]).pipe(dest("./build/images"));
};

const copyjs = () => {
  return src(["node_modules/bootstrap/dist/js/bootstrap.bundle.js"]).pipe(
    dest("./build")
  );
};

const sass2css = () => {
  return src(["app/scss/app.scss"])
    .pipe(sass())
    .pipe(dest("./build/styles"))
    .pipe(browserSync.stream());
};

const pug2html = () => {
  return src(["app/pug/index.pug", "app/pug/chat.pug"])
    .pipe(pug())
    .pipe(dest("./build/"))
    .pipe(browserSync.stream());
};

const svg2sprite = () => {
  const config = {
    mode: {
      stack: {
        sprite: "../sprite.svg",
      },
    },
  };

  return src(["./app/images/icons/*.svg"])
    .pipe(svgSprite(config))
    .pipe(dest("./build/images/icons/"));
};

const startWatch = () => {
  watch(["app/gulpfile.js"], scripts);
  watch(["app/scss/app.scss"], sass2css);
  watch(["app/pug/chat.pug", "app/pug/index.pug"], pug2html);
};
exports.browsersync = browsersync;
exports.default = parallel(pug2html, sass2css, svg2sprite, copy, copyjs);
