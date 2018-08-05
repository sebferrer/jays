module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            options: {
                sourceMap: true,
                module: "system"
            },
            default: {
                src: [
                    "src/main.ts",
                    "!node_modules/**/*.ts"
                ],
                dest: "dist/main.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("dist", [
        "ts"
    ]);

    grunt.registerTask("default", "dist")
}