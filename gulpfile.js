var gulp = require("gulp");
var del = require("del");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");

/* Clean */
gulp.task("clean", function () {
	del("./dist");
});

/* Copy tasks */
gulp.task("copy-html", function () {
	return gulp.src("src/*.html")
		.pipe(gulp.dest("dist"));
});
gulp.task("copy-css", function () {
	return gulp.src("./css/**/*.css")
		.pipe(gulp.dest("./dist/css"));
});
gulp.task("copy-assets", function () {
	return gulp.src("./assets/**/*.*")
		.pipe(gulp.dest("./dist/assets"));
});

gulp.task("default",
	[
		"clean",
		"copy-html",
		"copy-css",
		"copy-assets"
	],
	function () {
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
	});