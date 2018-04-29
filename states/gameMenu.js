var GameMenu = function() {};

GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 30
  },

  preload: function () {
    game.load.image('menu-bg', 'assets/images/main-menu-background.png');
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 113, "Help clean\nthe beach!", {
      font: '30pt ubuntu',
      fill: '#fff',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.3)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '25pt ubuntu', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 60) + 430, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0)";
    txt.setShadow(2, 2, 'rgba(0,0,0,0.6)', 5);
    //txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#fff";
      target.stroke = "rgba(0,0,0,0.1)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "#fff";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {
    if (music.name !== "mainSoundTrack" && playMusic) {
      music.stop();
      music = game.add.audio('mainSoundTrack');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;

    //adding background image to main menu
    game.menuBg = game.add.sprite(0, 0, 'menu-bg');
 
    //game.stage.backgroundColor = "#00b6ba";

    //game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    // start the game when the spacekey is hit
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.startGame, this);

    // start game with a tap
    game.input.onTap.add(this.startGame, this);

    // add menu
    this.addMenuOption('Mission', function (e) {
      game.state.start("Mission");
    });
    this.addMenuOption('Options', function (e) {
      game.state.start("Options");
    });
  },

  startGame: function () {
    game.state.start("Game");
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);