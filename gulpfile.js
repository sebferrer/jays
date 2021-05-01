/* Dependencies */
var gulp = require("gulp"),
	runSequence = require('gulp4-run-sequence'),
	del = require("del"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	tsify = require("tsify");

/* Clean */
gulp.task("clean", () => del(["./dist"]));

/* Copy tasks */
gulp.task("copy-html", () => gulp.src("src/*.html").pipe(gulp.dest("dist")));
gulp.task("copy-css", () => gulp.src("./css/**/*.css").pipe(gulp.dest("./dist/css")));
gulp.task("copy-assets", () => gulp.src("./assets/**/*.*").pipe(gulp.dest("./dist/assets")));
gulp.task("copy-things", gulp.series("copy-html", "copy-css", "copy-assets"));

/* TS */
gulp.task("ts", gulp.series(() => {
	return browserify({
		basedir: ".",
		debug: true,
		entries: ["src/main.ts"],
		cache: {},
		packageCache: {}
	})
		.plugin(tsify)
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("dist"));
}));

gulp.task('default', function () {
	return new Promise(function (resolve, reject) {
		runSequence(
			"clean",
			"copy-things",
			"ts"
		);
		resolve();
	});
});