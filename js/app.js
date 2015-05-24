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

        /* if level 8 or above, increase the range on the next to the last lane
        (we want lots of collisions here in the upper levels) */

        if(gameIsPlaying) {
            if (this.level > 7 && this.y === 143) {
                // randomize new speed, but using a range
                this.speed = getRandomInt((speed1+this.level),(speed2+(this.level*3)));
            } else {
                // randomize new speed, but using a range
                this.speed = getRandomInt(speed1,speed2);
            }
        } else {
            //if (this.speed != 100 && this.speed != 200 && this.speed != 400) {
                this.speed = 0;
                this.x = -101;
            //}
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

/* ---------------------------- */
/*  Player Class                */
/* ---------------------------- */

var Player = function (x, y) {
    this.x = x;
    this.y = y;
    // image to use
    this.sprite = 'images/char-boy.png';
    // set level, beginning lives, and score
    this.level = 1;
    this.lives = 5;
    this.score = 0;
};

Player.prototype.update = function () {
    playerIsPlaying = true;// signal that the player is now playing
    // set for collision detections (next 4 lines)
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    this.left = this.x;
    this.top = this.y;
    this.right = this.x + 70;
    this.bottom = this.y + 70;
};

Player.prototype.render = function() {
    // Draw the same as the enemy render
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyCode) {// Uses Parameter 'keycode' from document.addEventListener
    if (keyCode === 'up') {

        /* if the game has not ended
            then we allow up to work */

        if (gameHasEnded === false) {

            /* we now look and see if the player is
            NOT on the top row (has not won yet) */

            if (this.y > 1) {
                if (debugPage === true) {
                console.log("up="+this.y);
                }

            // increment score if step lands on stone square
                if (this.y >= 28.5 && this.y <= 360.5) {
                    player.score += 1;              // increment up
                    ctx.clearRect(40,700,100,50);
                    ctx.fillText(player.score,70,720); // draw new lives
                }

                if (this.y <= 526.5) {
                    ctx.clearRect(200,600,400,180);
                    ctx.fillText("Use Arrow Keys",353,710);
                }

                this.y -= 41.5; // 83 is defined in 'engine.js'
                if (this.y < 0) {
                    // set large text at top announcing a win
                    ctx.clearRect(0,0,707,200);
                    ctx.font = "bold 48px serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle="black";
                    ctx.fillText("Level " + this.level + " WINNER!",353,35);

                    // set instructions at bottom to continue
                    ctx.clearRect(200,600,400,200);
                    ctx.font = "bold 20px serif";
                    ctx.fillText("Press UP to continue",353,710);
                }

            /* but if not, then reset to the beginning */
            } else {
                // else, the player HAS won
                this.level += 1;
                player.resetPosition(); // reset player

                /* After a Win, we set new bug enemies when they reach different levels
                these are done on one of the four rows used by the enemy bugs */

                // first row of enemies (from top down)
                if (this.level === 3 || this.level === 5) {
                    // add enemy at level 3 and 5
                    allEnemies.push(new Enemy(0, 60, getRandomInt(speed1,speed2)));
                }
                // second row of enemies (from top down)
                if (this.level === 2 || this.level === 3) {
                    // add enemy at level 2 and 3
                    allEnemies.push(new Enemy(0, 143, getRandomInt(speed1,speed2)));
                }
                // third row of enemies (from top down)
                if (this.level === 4 || this.level === 6) {
                    // add enemy at level 4 and 6
                    allEnemies.push(new Enemy(0, 230, getRandomInt(speed1,speed2)));
                }
                // fourth row of enemies (from top down)
                if (this.level === 7) {
                    // add enemy at level 7
                    allEnemies.push(new Enemy(0, 310, getRandomInt(speed1,speed2)));
                }

                if (this.level >= 7) {
                    // at level 7, add additional speed to both the lower (speed1) and upper (speed2) ranges of speed
                    window.speed1 = window.speed1 + 5;
                    window.speed2 = window.speed2 + 2;
                }

                /* increment 'up' the ranges for variable speed
                (gap will slowly grow, and range will slowly increment up on each win) */

                window.speed2 = window.speed2 + 5;

                ctx.clearRect(0,0,707,200);
                ctx.clearRect(200,600,400,200);
                ctx.font = "bold 20px serif";
                ctx.textAlign = "center";
                ctx.fillStyle="black";

                // use up certain amt of lives, then game is over
                if (this.lives === 0) {
                    // end game
                    ctx.fillText("Game Over",353,710);
                } else {
                    // set new level message + basic instructions
                    ctx.fillText("Level " + this.level,353,35);
                    ctx.fillText("Press UP for Level " + this.level,353,710);

                }

            } // end of 'gamepiece has not reached top row'
        }

    } // End of 'up'

    if (keyCode === 'down') {
        if (this.y < 450) {
            if (debugPage === true) {
                console.log("down="+this.y);
            }
            // increment score if step lands on stone square
            if (this.y >= 28.5 && this.y <= 277.5) {
                player.score += 1; // increment up
                ctx.clearRect(40,700,100,50);
                ctx.fillText(player.score,70,720); // draw new lives
            }
            if (this.y < 0) {
                /* if less than 0 (if now in top row),
                disallow going down, because they have already won the level */
            } else {
                this.y += 41.5;
            }
        }
    } // End of 'down'

    if (keyCode === 'left') {
        if (this.x > 20 && this.y < 526.5) {
            if (debugPage === true) {
                console.log("left="+this.y);
            }
            // increment score if step lands on stone square
            if (this.y >= 28.5 && this.y <= 319) {
                player.score += 5; // increment up
                ctx.clearRect(40,700,100,50);
                ctx.fillText(player.score,70,720); // draw new lives
            }
            if (this.y < 0) {
                /* if less than 0 (if now in top row),
                disallow going down, because they have already won the level */
            } else {
                this.x -= 101
            }
        }
    } // End of 'left'

    if (keyCode === 'right') {
        if (this.x < 606 && this.y < 526.5) {
            if (debugPage === true) {
                console.log("right="+this.y);
            }
            // increment score if step lands on stone square
            if (this.y >= 28.5 && this.y <= 319) {
                player.score += 5; // increment up
                ctx.clearRect(40,700,100,50);
                ctx.fillText(player.score,70,720); // draw new lives
            }
            if (this.y < 0) {
                /* if less than 0 (if now in top row),
                disallow going down, because they have already won the level */
            } else {
                this.x += 101
            }
        }
    } // end of 'right'

    if (gameHasEnded === true) {

        /* Game has ended, so we allow a press of 'space' to reset everything if they want to play again
            this involves resetting alot, and clearing spaces and redrawing several things */

        if (keyCode === 'space') {
            window.speed1 = 100;
            window.speed2 = 350;
            // push initial enemy bugs again
            allEnemies.push(new Enemy(0, 60,  getRandomInt(speed1,speed2)));
            allEnemies.push(new Enemy(0, 143,  getRandomInt(speed1,speed2)));
            allEnemies.push(new Enemy(0, 230,  getRandomInt(speed1,speed2)));
            allEnemies.push(new Enemy(0, 310,  getRandomInt(speed1,50)));
            // game flow variables
            window.gameHasEnded = false;
            window.gameIsPlaying = true;
            // reset game values
            this.level = 1;
            this.lives = 5;
            this.score = 0;

            ctx.clearRect(40,700,100,50);
            ctx.clearRect(0,0,707,200);
            ctx.clearRect(600,700,50,50);
            ctx.clearRect(200,600,400,200);
            ctx.font = "bold 20px serif";
            ctx.fillStyle="black";

            ctx.fillText(0,70,720); // reset score display
            ctx.fillText(5,625,720); // reset lives display

            ctx.textAlign = "center";
            ctx.fillText("Press UP to start",353,710);
            ctx.fillText("Level 1",353,35);
        }
    }
};

/* ---------------------------- */
/*  Player Reset                */
/* ---------------------------- */

Player.prototype.resetPosition = function() {
    this.x = 303;
    this.y = 526.5;

    /* If 0 lives, draw special messages on canvas
    and start a 'bug parade' ;) */
    if (this.lives <= 0) {
        // signal that game is no longer playing ('window' is the holder for global vars)
        window.gameIsPlaying = false;
        window.gameHasEnded = true;
        ctx.clearRect(0,0,707,200);
        ctx.font = "bold 48px serif";
        ctx.textAlign = "center";
        ctx.fillStyle="black";
        ctx.fillText("Game Over",353,35);

        ctx.clearRect(200,600,400,200);
        ctx.font = "bold 20px serif";
        ctx.textAlign = "center";
        ctx.fillStyle="black";
        ctx.fillText("Press SPACE to Start Over",353,730);
        ctx.fillText("You reached Level " + this.level + "!",353,710);
    }
};

/* ---------------------------- */
/*  Generate Random Integer     */
/* ---------------------------- */

/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
Returns a random integer between min (included) and max (excluded)
*/

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/* ---------------------------- */
/*  Instantiate Classes         */
/* ---------------------------- */

/* my thinking is to start out with 1 bug on each row
except the 2nd from the top, and to have the row closest to the player start off slower
*/

// set variables for my startout enemies (bugs)
var   Enemy1 = new Enemy(0, 60,  getRandomInt(speed1,speed2))
    , Enemy2 = new Enemy(0, 143, getRandomInt(speed1,speed2))
    , Enemy3 = new Enemy(0, 230, getRandomInt(speed1,speed2)
      // last enemy has slower range (100,50)
    , Enemy4 = new Enemy(0, 310, getRandomInt(speed1,50)));

// Create (instantiate) allEnemies
var allEnemies = [Enemy1,Enemy2,Enemy3,Enemy4];
// Create (Instantiate) the player
var player = new Player(303,526.5);

/* ---------------------------- */
/*  Listen for Key Presses      */
/* ---------------------------- */

/* This listens for key presses and sends the keys to your
Player.handleInput() method. You don't need to modify this */

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* Brian Zuehlke (zell-key), 2015 */


