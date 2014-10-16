module.exports = function(grunt) {
  grunt.initConfig({
    mochacli: {
      options: {
        require: ['should'],
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    }
  });

  grunt.registerTask('test', ['mochacli']);
  grunt.loadNpmTasks('grunt-mocha-cli');
}