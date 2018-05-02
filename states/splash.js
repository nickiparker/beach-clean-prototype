var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/gameMenu.js');
    game.load.script('game', 'states/game.js');
    game.load.script('gameover','states/gameOver.js');
    game.load.script('mission', 'states/mission.js');
    game.load.script('options', 'states/options.js');
  },

  loadMusic: function () {
    game.load.audio('mainSoundTrack', 'assets/sound effects/background-wave-seagull-sounds.wav');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['ubuntu'],
        urls: ['assets/styles/ubuntu.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(300/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#0080ff';
  },

  preload: function () {
    game.stage.backgroundColor = "#F7CA6A";

    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadFonts();
    this.loadMusic();
  },

  addGameStates: function () {
    game.state.add("GameMenu", GameMenu);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
    game.state.add("Mission", Mission);
    game.state.add("Options", Options);
  },

  addGameMusic: function () {
    music = game.add.audio('mainSoundTrack');
    music.volume = 0.3;
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};