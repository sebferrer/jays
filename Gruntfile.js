module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
                src: [
                    "src/**/*.ts",
                    "!node_modules/**/*.ts"
                ],
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("dist", [
        "ts"
    ]);

    grunt.registerTask("default", "dist")
}