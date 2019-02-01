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
const tsCompiledOrder = [
  'canner-graphql-utils',
  'canner-graphql-interface',
  'server-common',
  'auth-server',
  'cms-server',
  'graphql-server',
  'canner-server'
]
const jsPkgs = listPkg.filter(pkg => !isTs(pkg));
const tsPkgs = listPkg.filter(pkg => isTs(pkg))
  .map(pkg => {
    return {
      pkg,
      order: tsCompiledOrder.indexOf(getPkgName(pkg))
    }
  })
  .sort((a, b) => a.order - b.order)
  .map(({pkg}) => pkg);
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

gulp.task("cms-server:copy-files", gulp.parallel(
  () => gulp
    .src(['packages/cms-server/src/public/**/*'])
    .pipe(gulp.dest(['packages/cms-server/lib/public'])),
  () => gulp
    .src(['packages/cms-server/src/server/views/**/*'])
    .pipe(gulp.dest(['packages/cms-server/lib/server/views']))
));

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
    .watch(`${pkg}/src/**/*.ts`, gulp.parallel(pkgName, "cms-server:copy-files"))
  );
});

gulp.task("js", gulp.parallel(...jsPkgs.map(getPkgName)));
gulp.task("ts", gulp.series(...tsPkgs.map(getPkgName), "cms-server:copy-files"));
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