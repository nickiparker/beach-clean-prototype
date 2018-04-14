// global variables
var collectionTypes = [];
var naturalTypes = [];

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
        game.load.image('net', 'assets/net.png');
        game.load.image('bucket', 'assets/bucket.png');
        
        // collate collection types
        collectionTypes = ['can', 'bottle', 'net', 'bucket'];

        // Load a natural item
        game.load.image('seaweed', 'assets/seaweed.png');
        game.load.image('crab', 'assets/crab.png');
        game.load.image('fish', 'assets/fish.png');

        // collate natural items
        naturalTypes = ['seaweed', 'crab', 'fish'];
        
        // Load the bird sprite
        game.load.image('bird', 'assets/seagull.png');
        game.load.audio('jump', 'assets/jump.wav');

        // Load background
        game.load.image('bg', 'assets/background.png'); 

        // Load collision item
        game.load.image('largeRock', 'assets/large-rock.png'); 
        game.load.image('fishingBoat', 'assets/fishing-boat.png');
        game.load.image('supMan', 'assets/sup-man.png');

        // collate collision items
        collisionTypes = ['largeRock', 'fishingBoat', 'supMan'];
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

        // Display the bird at the position x=50 and y=245
        this.bird = game.add.sprite(50, 245, 'bird');
        this.bird.scale.setTo(0.35,0.35);

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;  

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        // Create an empty group
        this.naturalItems = game.add.group();
        this.collectionItems = game.add.group();
        this.collisionItems = game.add.group();

        // enable physics on the groups
        game.physics.enable(this.collectionItems, Phaser.Physics.ARCADE);
        game.physics.enable(this.naturalItems, Phaser.Physics.ARCADE);
        game.physics.enable(this.collisionItems, Phaser.Physics.ARCADE);

        this.timer = game.time.events.loop(1500, this.addNaturalItems, this);
        this.timer = game.time.events.loop(1500, this.addCollectionItems, this);
        this.timer = game.time.events.loop(4000, this.addCollisionItems, this);

        // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Ensure bird does not move on collision with collection items
        this.bird.body.immovable = true;
    },

    // Clean up collection items (score incremented!)
    addOneCollectionItem: function(x, y) {

        // Get random collection type item
        var selectedCollectionItem = collectionTypes[Math.floor(Math.random()*collectionTypes.length)];

        // Create the collection item at the position x and y
        var collectionItem = game.add.sprite(x, y, selectedCollectionItem);
        
        // Scale collection item according to type
        if (collectionItem.key == "can") {
            collectionItem.scale.setTo(0.15,0.15); 
        } else {
            collectionItem.scale.setTo(0.2,0.2);
        }

        // Randomise collection type angle according to type 
        // - making sure bottle doesn't go higher than 50
        if (collectionItem.key != "bottle") {
            collectionItem.angle += Math.floor(Math.random()*100);
        }
        else{
            collectionItem.angle += Math.floor(Math.random()*50);
        }

        // Add the collection item to our previously created group
        this.collectionItems.add(collectionItem);

        // Enable physics on the collection item 
        game.physics.arcade.enable(collectionItem);

        // Add velocity to the natural item to make it move left
        collectionItem.body.velocity.x = -350; 

        // Automatically kill the natural item when it's no longer visible 
        collectionItem.checkWorldBounds = true;
        collectionItem.outOfBoundsKill = true;
    },

    addCollectionItems: function() {
        // Item placement - random number 1 to 6       
        var placement = Math.floor(Math.random() * 6) + 1;
        // Use placement to determine y position for item (width, height)
        this.addOneCollectionItem(375, placement * 80 + 120);    
    },

    collectItem: function(bird, collectionItem) {
        collectionItem.kill();
        this.collectionItems.remove(collectionItem);
        // update score
        this.score += 1;
        this.labelScore.text = "Score: " + this.score;
    },


    // Avoid natural items (seaweed and fish etc)
    // -- score penalised
    addOneNaturalItem: function(x, y) {

        // Get random natural type item
        var selectedNaturalItem = naturalTypes[Math.floor(Math.random()*naturalTypes.length)];

        // if fish we need to position it only in the sea
        if (selectedNaturalItem == "fish"){
            var placement = Math.floor(Math.random() * 3) + 1;
            y = placement * 100 + 80;
        }
        // Create a natural item at the position x and y
        var naturalItem = game.add.sprite(x, y, selectedNaturalItem);

        // Scale item to fit screen
        naturalItem.scale.setTo(0.2,0.2);

        // Rotate item 
        naturalItem.angle += Math.floor(Math.random() * 50);

        // Add the natural item to our previously created group
        this.naturalItems.add(naturalItem);

        // Enable physics on the natural item 
        game.physics.arcade.enable(naturalItem);

        // Add velocity to the natural item to make it move left
        naturalItem.body.velocity.x = -300; 

        // Automatically kill the natural item when it's no longer visible 
        naturalItem.checkWorldBounds = true;
        naturalItem.outOfBoundsKill = true;
    },

    addNaturalItems: function() {
        // Item placement - random number 1 to 5        
        var placement = Math.floor(Math.random() * 5) + 1;
        // Use placement to determine y position for item (width, height)
        this.addOneNaturalItem(375, placement * 100 + 100); 
    },

    collectNaturalItem: function(bird, naturalItem) {
        naturalItem.kill();
        this.naturalItems.remove(naturalItem);
        // update score - penalise by 2 points
        if (this.score > 1){
            this.score -= 2;
            this.labelScore.text = "Score: " + this.score;    
        } else if (this.score == 1){
            this.score = 0;
            this.labelScore.text = "Score: " + this.score; 
        }
    },

    // Create scene obstacles (rocks, boats, and surfers etc)
    addOneCollisionItem: function(x, y) {

        // Get random natural type item
        var selectedCollisionItem = collisionTypes[Math.floor(Math.random()*collisionTypes.length)];

        // Create a collision item at the position x and y
        var collisionItem = game.add.sprite(x, y, selectedCollisionItem);

        var scale = Math.random() * 0.5 + 0.5;
        // Random scale for collision item
        collisionItem.scale.setTo(scale, scale);

        // Add the collision item to our previously created group
        this.collisionItems.add(collisionItem);

        // Enable physics on the collision item 
        game.physics.arcade.enable(collisionItem);

        // Add velocity to the collision item to make it move left
        collisionItem.body.velocity.x = -200; 

        // Automatically kill the collision item when it's no longer visible 
        collisionItem.checkWorldBounds = true;
        collisionItem.outOfBoundsKill = true;
    },

    addCollisionItems: function() {
        // Item placement - random number 1 to 2        
        var placement = Math.floor(Math.random() * 2) + 1;
        // Use placement to determine y position for item (width, height)
        // Add the collision item 
        this.addOneCollisionItem(375, placement * 200 + 140);  
    },

    hitCollisionItem: function() {
        // If the bird has already hit a collision item, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new collision items from appearing
        game.time.events.remove(this.timer);

        // Go through all the collision items, and stop their movement
        this.collisionItems.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);

        this.restartGame();
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic
        // background parallax - makes the background slowly move by 0.5 of a pixel on update 
        game.bg.tilePosition.x += 0.5;

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 667)
            this.restartGame();

        //Each time the bird collides with a collision item fall off screen
        game.physics.arcade.overlap(
            this.bird, this.naturalItems, this.collectNaturalItem, null, this);

        // Each time the bird collects an item
        game.physics.arcade.collide(
            this.bird, this.collectionItems, this.collectItem, null, this); 

        // Each time the bird collides with collistion item
        game.physics.arcade.collide(
            this.bird, this.collisionItems, this.hitCollisionItem, null, this);  
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