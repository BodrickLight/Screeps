module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: '<EMAIL>',
                password: '<PASSWORD>',
                branch: 'default'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}