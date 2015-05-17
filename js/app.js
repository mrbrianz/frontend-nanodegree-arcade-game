


// ===== ENEMY =====

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    // how fast?
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    /// takes this.x coordinate plus itself plus this speed times the dt param
    this.x += this.speed*dt;

    // once passes too far to the right, reset to off the left of the screen at some random point
    // so, if x value (right/left axis) is greater than the canvas width, put it back to the leftside
    if (this.x > ctx.canvas.clientWidth) {
        this.x = -101; // set off to left of canvas
        this.speed = getRandomInt(50,200); // randomize new speed, but using a range
    }
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
        if (this.y > 100) {
            this.y -= 83; // why 83?  not sure
        /* but if not, then reset to the beginning
        */
        } else {
            this.x = 303;
            this.y = 485; // now sure on these numbers
            alert('You Win');
            // use up certain amt of lives, then game is over
            if (this.lives === 0) {
                alert('Game Over');
            }
        }
    }

    // down
    if (keyCode === 'down') {
        /* if y coord (up/down axis) is still less than 607 (6 rows X 101),
            take itself plus 101 when clicking 'down' because each row is 101
        */
        if (this.y < 450) { // why 450?  not sure
            this.y += 83;
        }
    }

    // left
    if (keyCode === 'left') {
        /* if x coord (left/right axis) is still more than 101 (1 column x 101),
            take itself minus 101 when clicking 'left' because each row is 101
        */
        if (this.x > 80) {
            this.x -= 101
        }
    }

    // right
    if (keyCode === 'right') {
        /* if x coord (left/right axis) is still less than 606 (6 columns x 101),
            take itself plus 101 when clicking 'right' because each row is 101
        */
        if (this.x < 606) {
            this.x += 101
        }
    }
};



// Now instantiate your objects.
// TODO: create allEnemies array
// TODO: put player object in player variable
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

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
// my thinkings is 2 bugs on top row, 1 bug on the next, 2 on the next, and only 1 on the first row that the player will encounter (and start the first one at a slower speed range)
var Bug1 = new Enemy(0, 60, getRandomInt(50,200)), Bug1b = new Enemy(303, 60, getRandomInt(50,200)), Bug2 = new Enemy(0, 143, getRandomInt(50,200)), Bug3 = new Enemy(0, 230, getRandomInt(50,200), Bug3b = new Enemy(0, 230, getRandomInt(50,200)), Bug4 = new Enemy(0, 310, getRandomInt(50,100)));
var allEnemies = [Bug1,Bug1b,Bug2,Bug3,Bug3b,Bug4];
// Create (Instantiate) the player
var player = new Player(303,485); // 303 makes sense, but I do not yet grasp the y axis amounts

/* Brian Zuehlke (zell-key), 2015 */


