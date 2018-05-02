// Global Variables
var game = new Phaser.Game(375, 667, Phaser.AUTO, 'game'),
Main = function () {},
gameOptions = {
  playSound: true,
  playMusic: true
},
music;

Main.prototype = {

  preload: function () {
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('brand',    'assets/images/seagull-splash-page.png');
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/splash.js');
  },

  create: function () {
    game.state.add('splash', Splash);
    game.state.start('splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');