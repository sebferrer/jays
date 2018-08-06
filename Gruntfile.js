module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        /* Clean */
        clean: ['dist/'],
        /* Copy */
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
                    },
                    /* Require.js */
                    {
                        cwd: '.',
                        src: 'node_modules/requirejs/bin/r.js',
                        dest: 'dist/scripts/r.js'
                    }
                ]
            }
        },
        /* Typescript transpilator */
        ts: {
            default: {
                tsconfig: true
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("dist", [
        "clean",
        "copy:prod",
        "ts"
    ]);

    grunt.registerTask("default", "dist")
}