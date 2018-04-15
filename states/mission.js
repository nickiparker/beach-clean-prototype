var Mission = function(game) {};

Mission.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.creditCount = 0;
  },

  addMission: function(task, author) {
    var authorStyle = { font: '20pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var taskStyle = { font: '13.5pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    if (author == "Beach Clean Mission") {
      var authorText = game.add.text(game.world.centerX, 400, author, authorStyle);
      var taskText = game.add.text(game.world.centerX, 500, task, taskStyle);
    } else {
      var authorText = game.add.text(game.world.centerX, 700, author, authorStyle);
      var taskText = game.add.text(game.world.centerX, 750, task, taskStyle);
    }
    
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
    game.add.tween(taskText).to( { y: -200 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
    this.creditCount ++;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '20pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 500, text, optionStyle);

    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    txt.anchor.setTo(0.5);
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
    this.stage.disableVisibilityChange = true;
    // if (gameOptions.playMusic) {
    //   music.stop();
    //   music = game.add.audio('exit');
    //   music.play();
    // }
    //var bg = game.add.sprite(0, 0, 'gameover-bg');
    this.addMission('Clean up our coast by \n collecting litter \n from the sea and beach. \n Remember to miss the obstacles \n and leave marine items untouched!', 'Beach Clean Mission');
    this.addMission('Exit the Premises \n by Kevin Macleod', 'Music Credits');
    this.addMission('by Nicki Parker', 'Developer Credits');
    this.addMenuOption('< Back', function (e) {
      game.state.start("GameMenu");
    });
    //game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
  }

};