// global variables
var collectionTypes = [];

// Create our 'main' state that will contain the game
var mainState = {
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#0080ff';
    },
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds
        // Load items of rubbish
        game.load.image('bottle', 'assets/bottle.png');
        game.load.image('can', 'assets/can.png');
        
        // collate collection types
        collectionTypes = ['can', 'bottle'];

        // Load a protected item
        game.load.image('protected', 'assets/protected.png');
        
        // Load the bird sprite
        game.load.image('bird', 'assets/seagull.png');
        game.load.audio('jump', 'assets/jump.wav');

        // Load background
        game.load.image('bg', 'assets/background.png');  
    },

    create: function() { 
        // Experiment with adding the background
        //game.add.sprite(-52, -108, 'bg');
        //game.bg = game.add.sprite(-52, -108, 'bg');
        game.bg = game.add.tileSprite(0, 0, 375, 667, 'bg');

        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        // Change the background color of the game to orange
        game.stage.backgroundColor = '#f49b42';

        //Add sound into game
        this.jumpSound = game.add.audio('jump');

        // Add in score to display top left
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "Score: 0", 
            { font: "20px Arial", fill: "#ffffff" });

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');
        this.bird.scale.setTo(0.1,0.1);

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;  

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        // Create an empty group
        this.protectedItems = game.add.group();
        this.collectionItems = game.add.group();

        // enable physics on the groups
        game.physics.enable(this.collectionItems, Phaser.Physics.ARCADE);
        game.physics.enable(this.protectedItems, Phaser.Physics.ARCADE);

        this.timer = game.time.events.loop(1500, this.addProtectedItems, this);
        this.timer = game.time.events.loop(1500, this.addCollectionItems, this);

        // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Ensure bird does not move on collision with collection items
        this.bird.body.immovable = true;
    },

    // Clean up collection items (score incremented!)
    addOneCollectionItem: function(x, y) {

        // Get random collection type item
        var selectedCollectionItem = collectionTypes[Math.floor(Math.random()*collectionTypes.length)];

        // Create a pipe at the position x and y
        var collectionItem = game.add.sprite(x, y, selectedCollectionItem);
        collectionItem.scale.setTo(0.2,0.2);

        // Add the collection item to our previously created group
        this.collectionItems.add(collectionItem);

        // Enable physics on the collection item 
        game.physics.arcade.enable(collectionItem);

        // Add velocity to the protected item to make it move left
        collectionItem.body.velocity.x = -350; 

        // Automatically kill the protected item when it's no longer visible 
        collectionItem.checkWorldBounds = true;
        collectionItem.outOfBoundsKill = true;
    },

    addCollectionItems: function() {
        var placement = Math.floor(Math.random() * 6) + 1;
        this.addOneCollectionItem(375, placement * 120 + 100);    
    },

    collectItem: function(bird, collectionItem) {
        collectionItem.kill();
        this.collectionItems.remove(collectionItem);
        // update score
        this.score += 1;
        this.labelScore.text = "Score: " + this.score;
    },


    // Avoid protected items (seaweed and fish etc)
    // -- score penalised
    addOneProtectedItem: function(x, y) {
        // Create a pipe at the position x and y
        var protectedItem = game.add.sprite(x, y, 'protected');

        // Add the protected item to our previously created group
        this.protectedItems.add(protectedItem);

        // Enable physics on the protected item 
        game.physics.arcade.enable(protectedItem);

        // Add velocity to the protected item to make it move left
        protectedItem.body.velocity.x = -300; 

        // Automatically kill the protected item when it's no longer visible 
        protectedItem.checkWorldBounds = true;
        protectedItem.outOfBoundsKill = true;
    },

    addProtectedItems: function() {
        // 
        var placement = Math.floor(Math.random() * 5) + 1;
        // (width, height)
        this.addOneProtectedItem(375, placement * 120 + 10); 
    },

    collectProtectedItem: function(bird, protectedItem) {
        protectedItem.kill();
        this.protectedItems.remove(protectedItem);
        // update score - penalise by 2 points
        if (this.score > 1){
            this.score -= 2;
            this.labelScore.text = "Score: " + this.score;    
        } else if (this.score == 1){
            this.score = 0;
            this.labelScore.text = "Score: " + this.score; 
        }
    },

    // TODO: create scene obstacles (rocks, boats, and surfers etc)
    // --> The below commented code can be used 
    // --> as a starting block for this:
    // Original pipe items (part of original game)
    // addOnePipe: function(x, y) {
    //     // Create a pipe at the position x and y
    //     var pipe = game.add.sprite(x, y, 'pipe');

    //     // Add the pipe to our previously created group
    //     this.pipes.add(pipe);

    //     // Enable physics on the pipe 
    //     game.physics.arcade.enable(pipe);

    //     // Add velocity to the pipe to make it move left
    //     pipe.body.velocity.x = -200; 

    //     // Automatically kill the pipe when it's no longer visible 
    //     pipe.checkWorldBounds = true;
    //     pipe.outOfBoundsKill = true;
    // },

    // addRowOfPipes: function() {
    //     // Randomly pick a number between 1 and 5
    //     // This will be the hole position
    //     var hole = Math.floor(Math.random() * 5) + 1;

    //     // Add the 6 pipes 
    //     // With one big hole at position 'hole' and 'hole + 1'
    //     for (var i = 0; i < 8; i++)
    //         if (i != hole && i != hole + 1) 
    //             this.addOnePipe(400, i * 60 + 10);

    //     // Increases score by 1 each time new pipe is created    
    //     this.score += 1;
    //     this.labelScore.text = this.score;   
    // },

    // hitPipe: function() {
    //     // If the bird has already hit a pipe, do nothing
    //     // It means the bird is already falling off the screen
    //     if (this.bird.alive == false)
    //         return;

    //     // Set the alive property of the bird to false
    //     this.bird.alive = false;

    //     // Prevent new pipes from appearing
    //     game.time.events.remove(this.timer);

    //     // Go through all the pipes, and stop their movement
    //     this.pipes.forEach(function(p){
    //         p.body.velocity.x = 0;
    //     }, this);
    // },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
        // background parallax - makes the background slowly move by 0.5 of a pixel on update 
        game.bg.tilePosition.x += 0.5;

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 667)
            this.restartGame();

        // leaving overlap as well as collide as they appear 
        // to do the same thing - need to research further. 
        // (note: overlap used in call to hitPipe function previously)
        //Each time the bird collides with a pipe fall off screen
        game.physics.arcade.overlap(
            this.bird, this.protectedItems, this.collectProtectedItem, null, this);

        // Each time the bird collects and item
        game.physics.arcade.collide(
            this.bird, this.collectionItems, this.collectItem, null, this);   
    },

    // Make the bird jump 
    jump: function() {

        //To stop dead bird jump when it's died
        if (this.bird.alive == false)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        //Adds sound effect on jump
        this.jumpSound.play();
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};

// Initialize Phaser, and create a 400px by 600px game. The Phaser AUTO means that Phaser will try to use WebGL if available, otherwise will defualt back to canvas
var game = new Phaser.Game(375, 667, Phaser.AUTO);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');