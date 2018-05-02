var Game = function(game) {};

// Global variables
var collectionTypes = [];
var naturalTypes = [];
var finalScore = 0;
var finalCans = 0;
var finalBuckets = 0;
var finalNets = 0;
var finalBottles = 0;

Game.prototype = {
    
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
        game.load.image('bottle', 'assets/images/bottle.png');
        game.load.image('can', 'assets/images/can.png');
        game.load.image('net', 'assets/images/net.png');
        game.load.image('bucket', 'assets/images/bucket.png');
        
        // Collate collection types
        collectionTypes = ['can', 'bottle', 'net', 'bucket'];

        // Load a natural item
        game.load.image('seaweed', 'assets/images/seaweed.png');
        game.load.image('crab', 'assets/images/crab.png');
        game.load.image('fish', 'assets/images/fish.png');

        // Collate natural items
        naturalTypes = ['seaweed', 'crab', 'fish'];
        
        // Load the bird sprite
        game.load.image('bird', 'assets/images/seagull.png');
        
        // Load sounds
        game.load.audio('jump', 'assets/sound effects/seagull-flapping-short-quieter.wav');
        game.load.audio('collision', 'assets/sound effects/seagull-hit-obstacle.wav');
        game.load.audio('collect', 'assets/sound effects/collecting-items.wav');
        game.load.audio('natural', 'assets/sound effects/seagull-swalk-high-pitch.wav');

        // Load background
        game.load.image('bg', 'assets/images/background.png'); 

        // Load collision item
        game.load.image('largeRock', 'assets/images/large-rock.png'); 
        game.load.image('fishingBoat', 'assets/images/fishing-boat.png');
        game.load.image('supMan', 'assets/images/sup-man.png');

        // Collate collision items
        collisionTypes = ['largeRock', 'fishingBoat', 'supMan'];

        this.optionCount = 1;
    },

    create: function() { 
        // Experiment with adding the background
        game.bg = game.add.tileSprite(0, 0, 375, 667, 'bg');

        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        // Change the background color of the game to orange
        game.stage.backgroundColor = '#f49b42';

        // Add sound into game
        if (gameOptions.playSound){
            this.jumpSound = game.add.audio('jump');
            this.collisionSound = game.add.audio('collision');
            this.collectSound = game.add.audio('collect');
            this.naturalSound = game.add.audio('natural');
        }

        // Add individual item totals
        this.cans = 0;
        this.nets = 0;
        this.buckets = 0;
        this.bottles = 0;

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

        // Call the 'jump' function when the user touches the screen
        game.input.onTap.add(this.jump, this);

        // Create an empty group
        this.naturalItems = game.add.group();
        this.collectionItems = game.add.group();
        this.collisionItems = game.add.group();

        // Enable physics on the groups
        game.physics.enable(this.collectionItems, Phaser.Physics.ARCADE);
        game.physics.enable(this.naturalItems, Phaser.Physics.ARCADE);
        game.physics.enable(this.collisionItems, Phaser.Physics.ARCADE);

        this.timer = game.time.events.loop(2500, this.addNaturalItems, this);
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
        if (collectionItem.key == "bottle"){
            this.bottles += 1;
        } else if (collectionItem.key == "bucket"){
            this.buckets += 1;
        } else if (collectionItem.key == "can"){
            this.cans += 1;
        } else {
            this.nets += 1;
        }

        collectionItem.kill();
        this.collectionItems.remove(collectionItem);

        // Make a sound for the collect
        if (gameOptions.playSound){
            this.collectSound.play();
            // without this the volume of music resets itself to max?
            music.volume = 0.3;
        }

        // Update score
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

        // Make a sound for the natural items
        if (gameOptions.playSound){
            this.naturalSound.play();
        }

        // Update score - penalise by 2 points
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

        // if fishing boat or sup boarder we need to position them only in the sea
        if (selectedCollisionItem == "fishingBoat" || selectedCollisionItem == "supMan"){
            var placement = Math.floor(Math.random() * 3) + 1;
            y = placement * 100 + 80;
        }

        // Create a collision item at the position x and y
        var collisionItem = game.add.sprite(x, y, selectedCollisionItem);

        if (selectedCollisionItem == "largeRock")
            {
            var scale = Math.random() * 0.5 + 0.5;
            // Random scale for collision item
            collisionItem.scale.setTo(scale, scale);
        } else {
            collisionItem.scale.setTo(0.4,0.4);
        }

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

        // Make a sound for the collision
        if (gameOptions.playSound){
            this.collisionSound.play();
        }

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
        game.bg.tilePosition.x -= 0.5;

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 667)
            this.restartGame();

        // Each time the bird collides with a collision item fall off screen
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

        // To stop dead bird jump when it's died
        if (this.bird.alive == false)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Adds sound effect on jump if playSound == true
        if (gameOptions.playSound){
            this.jumpSound.play();
        }
    },

    // Restart the game
    restartGame: function() {
        // Start the 'GameOver' state, which brings the gameover page
        finalCans = this.cans;
        finalBuckets = this.buckets;
        finalNets = this.nets;
        finalBottles = this.bottles;
        finalScore = this.score;
        game.state.start('GameOver');
    },
};