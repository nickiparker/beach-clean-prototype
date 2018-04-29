var GameOver = function(game) {};

GameOver.prototype = {

  preload: function () {
    this.optionCount = 1;

    //add background image for pop up
    game.load.image('pop-up',  'assets/images/pop-up-background.png');
    game.load.image('gameOverBg', 'assets/images/game-over-background.png');
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '25pt ubuntu', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 60) + 450, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0)";
    txt.setShadow(2, 2, 'rgba(0,0,0,0.6)', 5);
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
    //game.stage.backgroundColor = "#f78154";
    //add game over background
    game.gameOverBg = game.add.sprite(0, 0, 'gameOverBg');

    //game.add.sprite(0, 0, 'gameover-bg');
    var titleStyle = { font: '30pt ubuntu', fill: '#FDFFB5', align: 'center'};
    var scoreStyle = { font: '18pt ubuntu', fill: '#FDFFB5', align: 'center'};
    var totalStyle = { font: '15pt ubuntu', fill: '#3e4e50', align: 'center'};
    var title = game.add.text(game.world.centerX, 100, "Game Over", titleStyle);
    var scoreTitle = game.add.text(game.world.centerX, 190, "Game Score: " + finalScore, scoreStyle);
    //var nets = game.add.text(game.world.centerX, 250, finalNets, scoreStyle);

    // first row of collection
    // Add individual totals and sprites for each
    // add net shadow
    shadowNet = game.add.sprite(-58, -8, 'net');
    shadowNet.scale.setTo(0.16,0.16);
    shadowNet.tint = 0x000000;
    shadowNet.alpha = 0.5;
    
    // add net
    var netSprite = game.add.sprite(-60, -10, 'net');
    netSprite.scale.setTo(0.16,0.16);
    var netTotal = game.add.text(155, 290, finalNets, totalStyle);
    netTotal.addChild(shadowNet);
    netTotal.addChild(netSprite);
    
    // Add a click event onto net item total 
    netTotal.inputEnabled=true;

    // need to include 0 as 2nd arg in order to pass further params to function
    // workaround for 'closure' (javascript feature)
    netTotal.events.onInputDown.add(this.infoPopup, this, 0, "net");  
   
    // add bottle shadow
    shadowBottle = game.add.sprite(-58, -8, 'bottle');
    shadowBottle.scale.setTo(0.16,0.16);
    shadowBottle.tint = 0x000000;
    shadowBottle.alpha = 0.5;

    // add bottle
    var bottleSprite = game.add.sprite(-60, -10, 'bottle');
    bottleSprite.scale.setTo(0.16,0.16);
    var bottleTotal = game.add.text(265, 290, finalBottles, totalStyle);
    bottleTotal.addChild(shadowBottle);
    bottleTotal.addChild(bottleSprite);
    // Add a click event onto bottle item total 
    bottleTotal.inputEnabled=true;
    bottleTotal.events.onInputDown.add(this.infoPopup, this, 0, "bottle");

    // second row of collections
    // add can
    var canSprite = game.add.sprite(-60, -10, 'can');
    canSprite.scale.setTo(0.16,0.16);
    var canTotal = game.add.text(155, 350, finalCans, totalStyle);
    canTotal.addChild(canSprite);
    // Add a click event onto can item total 
    canTotal.inputEnabled=true;
    canTotal.events.onInputDown.add(this.infoPopup, this, 0, "can");

    // add bucket
    var bucketSprite = game.add.sprite(-60, -10, 'bucket');
    bucketSprite.scale.setTo(0.16,0.16);
    var bucketTotal = game.add.text(265, 350, finalBuckets, totalStyle);
    bucketTotal.addChild(bucketSprite);
    // Add a click event onto bucket item total 
    bucketTotal.inputEnabled=true;
    bucketTotal.events.onInputDown.add(this.infoPopup, this, 0, "bucket");

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
  infoPopup(arg1, arg2, infoType) {
    //call this line of code when you want to show the message box
    //message, width and height

    if (infoType == "can"){
      this.showInfoBox("It is estimated that \n 6.4 million tonnes of \n litter enter the \n sea annually.");
    } else if (infoType == "net"){
      this.showInfoBox("It’s estimated that \n over 100,000 animals \n and birds die every \n year from entanglement or ingestion \n of discarded items such \n as marine debris.");
    } else if (infoType == "bucket"){
      this.showInfoBox("On average there \n are 46,000 pieces of plastic \n floating in every \n square mile of ocean.");
    } else {
      this.showInfoBox("A plastic bottle \n left on the beach can \n last for more than 450 years \n within the marine environment.");
    }
    
  },
  //w=width
  //h=height
  showInfoBox(text, w = 355, h = 647) {

    var messageStyle = {
      font: '18pt ubuntu',
      fill: '#333',
      align: 'center'
    };

    //just in case the message box already exists
    //destroy it
      if (this.msgBox) {
          this.msgBox.destroy();
      }
      //make a group to hold all the elements
      var msgBox = game.add.group();
      //make the back of the message box
      var back = game.add.sprite(0, 0, "pop-up");
      //make the close button
      var closeButton = game.add.text(0, 0, "< Back", messageStyle);
      //make a text field
      var text1 = game.add.text(0, 0, text, messageStyle);
      //set the textfeild to wrap if the text is too long
      text1.wordWrap = true;
      //make the width of the wrap 90% of the width 
      //of the message box
      text1.wordWrapWidth = w * .9;
      //text1.padding.set(60,0);
      //
      //
      //set the width and height passed
      //in the parameters
      back.width = w;
      back.height = h;
      //
      //
      //
      //add the elements to the group
      msgBox.add(back);
      msgBox.add(closeButton);
      msgBox.add(text1);
      //
      //set the close button
      //in the center horizontally
      //and near the bottom of the box vertically
      closeButton.x = back.width / 2 - closeButton.width / 2;
      closeButton.y = 557 - closeButton.height;
      //enable the button for input
      closeButton.inputEnabled = true;
      //add a listener to destroy the box when the button is pressed
      closeButton.events.onInputDown.add(this.hideBox, this);
      //
      //
      //set the message box in the center of the screen
      msgBox.x = game.width / 2 - msgBox.width / 2;
      msgBox.y = game.height / 2 - msgBox.height / 2;
      //
      //set the text in the middle of the message box
      text1.x = back.width / 2 - text1.width / 2;
      text1.y = back.height / 2 - text1.height / 2;
      //make a state reference to the messsage box
      this.msgBox = msgBox;
  },
  hideBox() {
    //destroy the box when the button is pressed
      this.msgBox.destroy();
  },
};