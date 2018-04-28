var GameOver = function(game) {};

GameOver.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '25pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 370, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0)";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
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
    game.stage.backgroundColor = "#C1666B";
    //game.add.sprite(0, 0, 'gameover-bg');
    var titleStyle = { font: 'bold 30pt TheMinion', fill: '#FDFFB5', align: 'center'};
    var scoreStyle = { font: '18pt TheMinion', fill: '#FDFFB5', align: 'center'};
    var totalStyle = { font: '18pt TheMinion', fill: '#FDFFB5', align: 'center'};
    var title = game.add.text(game.world.centerX, 100, "Game Over", titleStyle);
    var scoreTitle = game.add.text(game.world.centerX, 190, "Game Score: " + finalScore, scoreStyle);
    //var nets = game.add.text(game.world.centerX, 250, finalNets, scoreStyle);

    // Add individual totals and sprites for each
    var netSprite = game.add.sprite(-25, -80, 'net');
    netSprite.scale.setTo(0.2,0.2);
    var netTotal = game.add.text(60, 320, finalNets, totalStyle);
    netTotal.addChild(netSprite);
   
    var bottleSprite = game.add.sprite(-25, -80, 'bottle');
    bottleSprite.scale.setTo(0.2,0.2);
    var bottleTotal = game.add.text(140, 320, finalBottles, totalStyle);
    bottleTotal.addChild(bottleSprite);

    var canSprite = game.add.sprite(-25, -80, 'can');
    canSprite.scale.setTo(0.2,0.2);
    var canTotal = game.add.text(220, 320, finalCans, totalStyle);
    canTotal.addChild(canSprite);

    var bucketSprite = game.add.sprite(-25, -80, 'bucket');
    bucketSprite.scale.setTo(0.2,0.2);
    var bucketTotal = game.add.text(300, 320, finalBuckets, totalStyle);
    bucketTotal.addChild(bucketSprite);

    title.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    title.anchor.set(0.5);
    scoreTitle.anchor.set(0.5);
    //score.anchor.set(0.5);

    this.addMenuOption('Play Again', function (e) {
      this.game.state.start("Game");
    });
    this.addMenuOption('Main Menu', function (e) {
      this.game.state.start("GameMenu");
    })
  },
};