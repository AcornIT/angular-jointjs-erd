module.exports = function(grunt) {

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    banner : '/* \n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - '
      + '<%= grunt.template.today("yyyy-mm-dd") %>\n'
      + '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>'
      + '<%= " * " + pkg.author.name + " <" + pkg.author.email + ">\\n"%>'
      + ' * Copyright (c) <%= grunt.template.today("yyyy") %> Acorn IT;'
      + ' Licensed MIT \n */\n',
    uglify : {
      options : {
        banner : '<%= banner %>'
      },
      dist : {
        src : '<%= pkg.name %>.js',
        dest : '<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', [ 'uglify' ]);

};
