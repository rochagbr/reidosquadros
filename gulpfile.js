const gulp = require("gulp");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const browserSync = require("browser-sync");
const server = browserSync.create();

const babelifyConfig = {
  presets: ["@babel/preset-env"]
};

function styles() {
  return gulp
    .src(["src/scss/*.scss"])
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("public"))
    .pipe(server.stream());
}

function copyHtml() {
  return gulp.src(["./*html"]).pipe(gulp.dest("public/"));
}

function scripts(done) {
  return browserify({ debug: true })
    .transform(babelify.configure(babelifyConfig))
    .require("./src/js/rei-dos-quadros-scripts.js", { entry: true })
    .bundle()
    .on("error", swallowError)
    .pipe(source("rei-dos-quadros-scripts.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./public"));

  done();
}

const watch = () => {
  gulp.watch("src/js/**/*.js", gulp.series(scripts, reload));
  gulp.watch("src/scss/**/*.scss", gulp.series(styles));
  gulp.watch("./*.html").on("change", gulp.series(copyHtml, reload));
};

function reload(done) {
  server.reload();
  done();
}

const build = gulp.series(copyHtml, styles, scripts);

function serve(done) {
  server.init({
    server: {
      baseDir: "./public"
    }
  });

  done();
}

const dev = gulp.series(build, serve, watch);

function swallowError(error) {
  console.log(error.toString());
  this.emit("end");
}

exports.default = dev;
