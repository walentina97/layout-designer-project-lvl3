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
  return src(["app/bootstrap.bundle.js"]).pipe(dest("./build"));
};

// Перенос скриптов из node_modules в директорию dist/js
const scripts = () => {
  return src([
    "./node_modules/jquery/build/jquery.min.js",
    // Здесь остальные скрипты
  ]).pipe(dest("./build/js/"));
};
// Компиляция SASS в единый CSS файл
const sass2css = () => {
  return src([
    "app/scss/app.scss",
    // Путь к главному файлу scss, который будет компилироваться
  ])
    .pipe(sass())
    .pipe(dest("./build/styles"))
    .pipe(browserSync.stream());
  // Обработка через плагин sass, указание конечного файла и его месторасположение
};
// Компиляция Pug. Принцип работы такой же, как и у компиляции SASS
const pug2html = () => {
  return src(["app/index.pug", "app/chats.pug"])
    .pipe(pug())
    .pipe(dest("./build/"))
    .pipe(browserSync.stream());
};

// Создание svg спрайта из иконок
const svg2sprite = () => {
  const config = {
    mode: {
      stack: {
        // Activate the «css» mode
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
  watch(["app/chats.pug", "app/index.pug"], pug2html);
};
exports.browsersync = browsersync;
exports.default = parallel(pug2html, sass2css, svg2sprite, copy, copyjs);
