module.exports = function(grunt) {
  grunt.initConfig({
    'create-windows-installer': {
      x64: {
        appDirectory: './builds/Dofucks-win32-x64',
        outputDirectory: './builds',
        name: 'Dofucks',
        description: 'Dofucks',
        authors: 'SwiTool',
        exe: 'Dofucks.exe'
      }
    }
  });

  grunt.loadNpmTasks('grunt-electron-installer');
};
