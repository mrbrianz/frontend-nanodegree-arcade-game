/* ---------------------------- */
/*  Global Variables            */
/* ---------------------------- */

// global speed variables
var speed1 = 100;
var speed2 = 350;

var playerIsPlaying = false;    // Is the Player active?
var gameIsPlaying = true;       // Is the Game active?
var gameHasEnded = false;       // Has the Game ended?
var debugPage = false;          // used to debug the page

/* ---------------------------- */
/*  Enemy Class                 */
/* ---------------------------- */

var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    // how fast?
    this.speed = speed;
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {

    /* Update the enemy's position, required method for game
    Parameter: dt, a time delta between ticks
    You should multiply any movement by the dt parameter
    which will ensure the game runs at the same speed for all computers.
    takes this.x coordinate plus itself plus this speed times the dt param */

    this.x += this.speed*dt;
    // set for collision detections (next 4 lines)
    this.left = this.x;
    this.top = this.y;
    this.right = this.x + 70;
    this.bottom = this.y + 70;

    if (this.x > ctx.canvas.clientWidth) {
        // once passes too far to the right, reset to left of the canvas
        this.x = -101;

        /* if level 12 or above, increase the range on the next to the last lane
        (we want lots of collisions here in the upper levels) */

        if(gameIsPlaying) {
            if (this.level > 11 && this.y === 143) {
                // randomize new speed, but using a range
                this.speed = getRandomInt((speed1+this.level),(speed2+(this.level*3)));
            } else {
                // randomize new speed, but using a range
                this.speed = getRandomInt(speed1,speed2);
            }
        } else {
            if (this.speed != 100 && this.speed != 200 && this.speed != 400) {
                this.speed = 0;
                this.x = -101;
            }
        }
    }

    /* if the player is active, we check for collisions against the player */

    if(playerIsPlaying) {
        this.isEnemyColliding(this, player);
    }
};

/* Is the Enemy colliding against the player?  if so, subtract a life - and if too many
lives have been lost, then set the variable for gameHasEnded.  Then clear out the
past lives, and draw in the new number of lives.  Also let the player know they
ran into an enemy (a bug), then reset the player */

Enemy.prototype.isEnemyColliding = function(enemy, player) {
    if(this.isColliding(enemy, player)) {
        player.lives -= 1; // Subtract a Life
        if (player.lives === 0) {
            gameHasEnded = true;
        }
        ctx.clearRect(600,700,50,50);
        ctx.fillText(player.lives,625,720);
        ctx.clearRect(200,600,400,200);
        ctx.fillText("A Bug got you!  Life Lost!  :(",353,710);
        ctx.fillText("Press UP to continue",353,730);
        player.resetPosition(); // Reset Player
    }
};

Enemy.prototype.isColliding = function(enemy, player) {
        return !(enemy.top > player.bottom
               || enemy.left > player.right
               || enemy.right < player.left
               || enemy.bottom < player.top);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// ===== PLAYER =====

// Player Class
var Player = function (x, y) {
    // coordinates to use
    this.x = x;
    this.y = y;
    // image to use
    this.sprite = 'images/char-boy.png';

    this.level = 1;
    this.lives = 3;
    this.score = 0;
    // Maybe set number of lives here?
    // Maybe set score/menu here?
};

// Player update method
Player.prototype.update = function () {
    // ? not sure yet
};

// Player render method
Player.prototype.render = function() {
    // Draw the same as the enemy render
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player handleInput method
// grid is 707 X 707 (101 per square)
Player.prototype.handleInput = function(keyCode) { // Uses Parameter 'keycode' from document.addEventListener
    // up
    // gotta go 'up' to win
    if (keyCode === 'up') {
        /* if y coord (up/down axis) is still greater than 100 (101 is the cutoff),
            take itself minus 101 when clicking 'up' because each rows is 101
        */
        if (this.y > 1) {
            this.y -= 83; // 83 is defined in 'engine.js'
            if (this.y < 0) {
                // set large text at top announcing a win
                ctx.clearRect(0,0,707,200);
                ctx.font = "bold 48px serif";
                ctx.textAlign = "center";
                ctx.fillStyle="black";
                ctx.fillText("WINNER! Level " + this.level + " Complete",353,35);

                // set instructions at bottom to continue
                ctx.clearRect(200,600,400,200);
                ctx.font = "bold 20px serif";
                ctx.fillText("Press UP to continue",353,700);
            }
        /* but if not, then reset to the beginning
        */
        } else {
            this.level += 1;
            console.log(this.level);
            console.log(this.x,this.y);

            ctx.clearRect(0,0,707,200);
            ctx.clearRect(200,600,400,200);

            // reset player to starting point
            this.x = 303;
            this.y = 485;

            // first row of enemies (from top down)
            if (this.level === 3 || this.level === 9) {
                // add enemy at level 3 and 9
                allEnemies.push(new Enemy(0, 60, getRandomInt(speed1,speed2)));
            }
            // second row of enemies (from top down)
            if (this.level === 2 || this.level === 3) {
                // add enemy at level 2 and 3
                allEnemies.push(new Enemy(0, 143, getRandomInt(speed1,speed2)));
            }
            // third row of enemies (from top down)
            if (this.level === 5 || this.level === 7) {
                // add enemy at level 5 and 7
                allEnemies.push(new Enemy(0, 230, getRandomInt(speed1,speed2)));
            }
            // fourth row of enemies (from top down)
            if (this.level === 10) {
                // add enemy at level 10
                allEnemies.push(new Enemy(0, 310, getRandomInt(speed1,speed2)));
            }

            if (this.level > 7) {
                // at level 8, add additional speed to both the lower (speed1) and upper (speed2) ranges of speed
                window.speed1 = window.speed1 + 5;
                window.speed2 = window.speed2 + 2;
            }

            // increment 'up' the ranges for variable speed (gap will slowly grow, and range will slowly increment up on each win)
            //window.speed1 = window.speed1 + 1;
            window.speed2 = window.speed2 + 5;

            // use up certain amt of lives, then game is over
                ctx.font = "bold 20px serif";
                ctx.textAlign = "center";
                ctx.fillStyle="black";

            if (this.lives === 0) {
                // end game
                ctx.fillText("Game Over",353,700);
            } else {
                // set new level message + basic instructions
                ctx.fillText("Level " + this.level,353,35);
                ctx.fillText("Use Arrow Keys to Navigate",353,700);

            }

        }
    }

    // down
    if (keyCode === 'down') {
        /* if y coord (up/down axis) is still less than 607 (6 rows X 101),
            take itself plus 101 when clicking 'down' because each row is 101
        */
        if (this.y < 450) {
            if (this.y < 0) {
                // if less than 0 (if now in top row), disallow going down, because they have already won the level
            } else {
                this.y += 83;
            }
        }
    }

    // left
    if (keyCode === 'left') {
        /* if x coord (left/right axis) is still more than 101 (1 column x 101),
            take itself minus 101 when clicking 'left' because each row is 101
        */
        if (this.x > 80) {
            if (this.y < 0) {
                // if less than 0 (if now in top row), disallow going down, because they have already won the level
            } else {
                this.x -= 101
            }
        }
    }

    // right
    if (keyCode === 'right') {
        /* if x coord (left/right axis) is still less than 606 (6 columns x 101),
            take itself plus 101 when clicking 'right' because each row is 101
        */
        if (this.x < 606) {
            if (this.y < 0) {
                // if less than 0 (if now in top row), disallow going down, because they have already won the level
            } else {
                this.x += 101
            }
        }
    }
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space',  // add space (commonly used)
        13: 'enter',  // add enter (commonly used)
        80: 'p' // add p (maybe for 'pause' or 'player selection')
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Create (Instantiate) the enemy bugs using the 'allEnemies' array
// my thinkings is 3 bugs on top row, 2 bugs on the next, 3 on the next, and 2 on the first row that the player will encounter (and start the first one at a slower speed range)
var Bug1 = new Enemy(0, 60, getRandomInt(speed1,speed2)), Bug3 = new Enemy(0, 230, getRandomInt(speed1,speed2), Bug4 = new Enemy(0, 310, getRandomInt(speed1,150)));
var allEnemies = [Bug1,Bug3,Bug4];
// Create (Instantiate) the player
var player = new Player(303,485); // 303 makes sense, but I do not yet grasp the y axis amounts

/* Brian Zuehlke (zell-key), 2015 */


