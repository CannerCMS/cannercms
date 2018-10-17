const gulp = require("gulp");
const babel = require("gulp-babel");
const babelrc = require("./babel.config");
const { execSync } = require("child_process");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const {existsSync} = require('fs');
const chalk = require('chalk');
const listPkg = execSync("lerna ls --p", { encoding: "utf8" })
  .split("\n")
  .filter(d => d.length > 0);
const jsPkgs = listPkg.filter(pkg => !isTs(pkg));
const tsPkgs = listPkg.filter(pkg => isTs(pkg));

// generate js task
jsPkgs.forEach(pkg => {
  gulp.task(pkg, () => gulp
    .src([`${pkg}/src/**/*.js`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelrc))
    // eslint-disable-next-line no-console
    .on("error", console.error.bind(console))
    // eslint-disable-next-line no-console
    .pipe(gulp.dest(`${pkg}/lib`))
  );
  gulp.task(`${pkg}:watch`, () => gulp
    .watch(`${pkg}/src/**/*.js`, gulp.parallel(pkg))
  );
});


// generate ts task
tsPkgs.forEach(pkg => {
  const tsProject = ts.createProject('./tsconfig.json');
  gulp.task(pkg, () => gulp
    .src([`${pkg}/src/**/*.ts`])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    // eslint-disable-next-line no-console
    .on("error", console.error.bind(console))
    // eslint-disable-next-line no-console
    .pipe(gulp.dest(`${pkg}/lib`))
  );
  gulp.task(`${pkg}:watch`, () => gulp
    .watch(`${pkg}/src/**/*.ts`, gulp.parallel(pkg))
  );
});

gulp.task("js", gulp.parallel(...jsPkgs));
// canner-graphql-utils must be compiled before canner-graphql-interface
gulp.task("ts", gulp.series(...tsPkgs));


gulp.task("default", gulp.parallel('js', 'ts'));
gulp.task("js:watch", gulp.parallel(...jsPkgs.map(pkg => `${pkg}:watch`)));
gulp.task("ts:watch", gulp.parallel(...tsPkgs.map(pkg => `${pkg}:watch`)));
gulp.task("watch", gulp.parallel("js:watch", "ts:watch"));

function isTs(pkgPath) {
  try {
    return existsSync(`${pkgPath}/tsconfig.json`);
  } catch (e) {
    return false;
  }
}