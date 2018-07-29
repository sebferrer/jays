module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.initConfig({
		/* CLEAN */
		clean: ['dist/'],
		/* CONCAT */
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: ['src/**/**.js'],
				dest: 'dist/main.js',
			}
		},
		/* UGLIFY */
		uglify: {
			prod: {
				options: {
					mangle: true
				},
				files: {
					'dist/main.js': ['dist/main.js']
				}
			}
		},
		/* COPY */
		copy: {
			prod: {
				files: [
					/* Index */
					{
						cwd: '.',
						src: 'index.html',
						dest: 'dist/index.html'
					},
					/* Css */
					{
						cwd: '.',
						flatten: false,
						src: 'css/**/*',
						dest: 'dist/'
					},
					/* Assets */
					{
						cwd: '.',
						flatten: false,
						src: 'assets/**/*',
						dest: 'dist/'
					}
				]
			}
		}
	});

	grunt.registerTask("debug", [
		"clean",
		"concat",
		"uglify:prod",
		"copy:prod"
	]);

	grunt.registerTask("default", ["debug"]);
};