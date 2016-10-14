module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    src: 'src',
    build: 'build',
    dist: 'dist',
    ts: {
      main: {
        options : { sourceMap: false },
        src: ['<%= src %>/**/*.ts'],
        outDir: '<%= build %>'
      }
    },
    nodeunit: {
      all: [ '<%= build %>/*_test.js' ],
      options: {
        reporter: 'default',
        reporterOptions: {
          output: 'dist'
        }
      }
    },
    clean: {
      build : { src: ['<%= build %>', '.tscache'] },
      dist : { src: ['<%= dist %>'] }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask('default', ['ts']);

};
