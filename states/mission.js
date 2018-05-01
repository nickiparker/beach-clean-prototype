var Mission = function(game) {};

Mission.prototype = {

  preload: function () {
    game.load.image('mission-bg', 'assets/images/mission-screen.png');
    game.load.image('block1', 'assets/images/mission-slide.png');
    game.load.image('block2', 'assets/images/rubbish-slide.png');
    game.load.image('block3', 'assets/images/natural-slide.png');
    game.load.image('block4', 'assets/images/large-object-slide.png');
    game.load.image('block5', 'assets/images/goal-slide.png');
    this.optionCount = 1;
    this.creditCount = 0;
    slider = new phaseSlider(game);
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '25pt ubuntu', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 60) + 420, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
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

    //adding background image to main menu
    game.missionBg = game.add.sprite(0, 0, 'mission-bg');

    // add first slide
    var block1 = game.add.image(0,0,"block1");
    var block2 = game.add.image(0,0,"block2");
    var block3 = game.add.image(0,0,"block3");
    var block4 = game.add.image(0,0,"block4");
    var block5 = game.add.image(0,0,"block5");

    //adding slider function
    slider.createSlider({
      customSliderBG: false,
      mode: "horizontal",
      sliderBGAlpha: 0.01,
      width: 332,
      height: 340,
      x: game.width / 2 - 332 / 2,
      y: game.height / 2 - 340 / 1.1,
      objects:[block1, block2, block3, block4, block5]
    });

    this.stage.disableVisibilityChange = true;
    // if (gameOptions.playMusic) {
    //   music.stop();
    //   music = game.add.audio('exit');
    //   music.play();
    // }

    this.addMenuOption('Play', function (e) {
      game.state.start("Game");
    });
    this.addMenuOption('< Back', function (e) {
      this.game.state.start("GameMenu");
    });
  }
};