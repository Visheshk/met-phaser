import './hello.html';
import Phaser from 'Phaser';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);

  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
	};

	var game = new Phaser.Game(config);
	var scoreText;

	function preload ()
	{
		this.load.image('sky', '/img/phaser/sky.png');
	    this.load.image('ground', '/img/phaser/platform.png');
	    this.load.image('star', '/img/phaser/star.png');
	    this.load.image('bomb', '/img/phaser/bomb.png');
	    this.load.spritesheet('dude', 
	        '/img/phaser/dude.png',
	        { frameWidth: 32, frameHeight: 48 }
	    );
	}
	var platforms;
	var cursors;
	var score = 0;

	function create ()
	{
		this.add.image(400, 300, 'sky');
	    this.add.image(400, 300, 'star');
	    console.log(this);
	    platforms = this.physics.add.staticGroup();
	    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

	    platforms.create(600, 400, 'ground');
	    platforms.create(50, 250, 'ground');
	    platforms.create(750, 220, 'ground');

	    player = this.physics.add.sprite(100, 450, 'dude');

		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

		this.anims.create({
		    key: 'left',
		    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		    frameRate: 10,
		    repeat: -1
		});

		this.anims.create({
		    key: 'turn',
		    frames: [ { key: 'dude', frame: 4 } ],
		    frameRate: 20
		});

		this.anims.create({
		    key: 'right',
		    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
		    frameRate: 10,
		    repeat: -1
		});

		player.body.setGravityY(300);
		this.physics.add.collider(player, platforms);
		cursors = this.input.keyboard.createCursorKeys();

		stars = this.physics.add.group({
		    key: 'star',
		    repeat: 11,
		    setXY: { x: 12, y: 0, stepX: 70 }
		});

		stars.children.iterate(function (child) {
		    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
		this.physics.add.collider(stars, platforms);
		this.physics.add.overlap(player, stars, collectStar, null, this);

	}

	function update ()
	{
		if (cursors.left.isDown)
		{
		    player.setVelocityX(-190);

		    player.anims.play('left', true);
		}
		else if (cursors.right.isDown)
		{
		    player.setVelocityX(190);

		    player.anims.play('right', true);
		}
		else
		{
		    player.setVelocityX(0);

		    player.anims.play('turn');
		}

		if (cursors.up.isDown && player.body.touching.down)
		{
		    player.setVelocityY(-460);
		}
	}

	function collectStar (player, star)
	{
	    star.disableBody(true, true);
	    upScore(10);
	}

	var upScore = function (inc=1) {
		score += inc;
	    scoreText.setText('Score: ' + score);
	}


});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
  	this.upScore();
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
