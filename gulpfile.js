const gulp = require("gulp");
const babel = require("gulp-babel");
const babelrc = require("./babel.config");
const { execSync } = require("child_process");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const {existsSync} = require('fs');
const listPkg = execSync("lerna ls --p", { encoding: "utf8" })
  .split("\n")
  .filter(d => d.length > 0);
const jsPkgs = listPkg.filter(pkg => !isTs(pkg));
const tsPkgs = listPkg.filter(pkg => isTs(pkg)).sort(a => {
  a.match(/canner-graphql-utils/) ? -1 : 1
});
// generate js task
jsPkgs.forEach(pkg => {
  const pkgName = getPkgName(pkg);
  gulp.task(pkgName, () => gulp
    .src([`${pkg}/src/**/*.js`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelrc))
    // eslint-disable-next-line no-console
    .on("error", console.error.bind(console))
    // eslint-disable-next-line no-console
    .pipe(gulp.dest(`${pkg}/lib`))
  );
  gulp.task(`${pkgName}:watch`, () => gulp
    .watch(`${pkg}/src/**/*.js`, gulp.parallel(pkgName))
  );
});


// generate ts task
tsPkgs.forEach(pkg => {
  const pkgName = getPkgName(pkg);
  gulp.task(pkgName, () => {
    const tsProject = ts.createProject(`./packages/${pkgName}/tsconfig.release.json`);
    return gulp
      .src([`${pkg}/src/**/*.ts`])
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      // eslint-disable-next-line no-console
      .on("error", console.error.bind(console))
      // eslint-disable-next-line no-console
      .pipe(gulp.dest(`${pkg}/lib`))
  });
  gulp.task(`${pkgName}:watch`, () => gulp
    .watch(`${pkg}/src/**/*.ts`, gulp.parallel(pkgName))
  );
});

gulp.task("js", gulp.parallel(...jsPkgs.map(getPkgName)));
gulp.task("ts", gulp.series(...tsPkgs.map(getPkgName)));
gulp.task("default", gulp.parallel('js', 'ts'));

gulp.task("js:watch", gulp.parallel(...jsPkgs.map(pkg => `${getPkgName(pkg)}:watch`)));
gulp.task("ts:watch", gulp.parallel(...tsPkgs.map(pkg => `${getPkgName(pkg)}:watch`)));
gulp.task("watch", gulp.series('default', gulp.parallel("js:watch", "ts:watch")));

function isTs(pkgPath) {
  try {
    return existsSync(`${pkgPath}/tsconfig.json`);
  } catch (e) {
    return false;
  }
}

function getPkgName(pkgPath) {
  return pkgPath.split('/').slice(-1)[0];
}