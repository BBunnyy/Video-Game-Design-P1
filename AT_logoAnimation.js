//Documentation Header:
/*
  The intent behind this logo animation is to simulate a tetris game, that spells out my initials.
  My inititals are A.T., so the "logo" is an A and T made out of tetrominoes (aka Tetris Blocks).
  The animation starts with a board set up for a Tetris to be made. The initials of my name (AT) will be created out of tetrominoes.
  The final peice will slide in to clear the bottom three rows, and the initials will fall to be alone.
  
  To accomplish this I created a class of "Blocks" and subclasses to define individual block types (I,S,Z,O,J,L).
  These blocks are moved using class methods and timed based on the frames. These action are programmed based on number of frames
*/

//Base class for a block object
//Allows for construction of block as well as for rotation, position, and movement to be controlled
class Block {
  //initialize block essential parameters
  constructor(x, y, box_size, state) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.state = state; //current rotation
    this.box_size = box_size; //size of "pixel" or cube
  }

  //set next state of block (used with rotation);
  nextState() {
    this.state++;
    if (this.state == 4) {
      this.state = 0;
    }
  }

  //move block left 1 unit (Box size)
  left() {
    this.x = this.x - this.box_size;
  }

  //move block right 1 unit (Box size)
  right() {
    this.x = this.x + this.box_size;
  }

  //moves block down 1 unit (Box size)
  drop() {
    this.y = this.y + this.box_size;
  }

  //not used for anything here at the moment (I.E. no default block), overwritten by subclasses
  draw_shape() {
    return 0;
  }

  //draw a block, rotated based on its state
  draw() {
    translate(this.x, this.y); //shift center to where block will be drawn

    if (this.state == 0) {
      //draw base shape orientation
      this.draw_shape();
    } else if (this.state == 1) {
      //draw, rotated 90 Deg
      rotate(PI / 2);
      this.draw_shape();
      rotate(-PI / 2);
    } else if (this.state == 2) {
      //draw, rotated 180 Deg
      rotate(PI);
      this.draw_shape();
      rotate(-PI);
    } else {
      //draw, rotated 270 Deg
      rotate((3 * PI) / 2);
      this.draw_shape();
      rotate((-3 * PI) / 2);
    }

    translate(-this.x, -this.y); //reset canvas origin
  }
}

//Sub-classes of Blocks object
//specifies how each block is constructed around an origin point:
//A cyan I-shaped block
class IBlock extends Block {
  draw_shape() {
    fill(0, 255, 255);
    rect(-this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, 0, this.box_size, this.box_size);
    rect(-this.box_size, this.box_size, this.box_size, this.box_size);
    fill(255);
  }
}

//A red S-shaped block
class SBlock extends Block {
  draw_shape() {
    fill(255, 0, 0);
    rect(-2 * this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-2 * this.box_size, -this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, 0, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    fill(255);
  }
}

//A green Z-shaped block
class ZBlock extends Block {
  draw_shape() {
    fill(0, 255, 0);
    rect(-this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-2 * this.box_size, -this.box_size, this.box_size, this.box_size);
    rect(-2 * this.box_size, 0, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    fill(255);
  }
}

//A purple T-shaped block
class TBlock extends Block {
  draw_shape() {
    fill(160, 0, 255);
    rect(-this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-2 * this.box_size, -this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, 0, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    fill(255);
  }
}

//A yellow square-shaped block
class OBlock extends Block {
  draw_shape() {
    fill(255, 255, 0);
    rect(0, -this.box_size, this.box_size, this.box_size);
    rect(0, 0, this.box_size, this.box_size);
    rect(-this.box_size, 0, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    fill(255);
  }
}

//A blue J-shaped block
class JBlock extends Block {
  draw_shape() {
    fill(0, 0, 255);
    rect(0, -2 * this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, 0, this.box_size, this.box_size);
    fill(255);
  }
}

//An orange L-shaped block
class LBlock extends Block {
  draw_shape() {
    fill(255, 160, 0);
    rect(-2 * this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, -2 * this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, -this.box_size, this.box_size, this.box_size);
    rect(-this.box_size, 0, this.box_size, this.box_size);
    fill(255);
  }
}
//END OF OBJECT CLASSES

//BEGIN INITIALIZATION OF GLOBAL VARIABLES
//Background Block images
var Back = [];

//Arrays to store Block to animate:
var Blocks = []; //Block Queue
var Done = []; //Completed Blocks

//Array to store timings of Block animations
var Rotate = []; //Timing of rotations
var moveLeft = []; //Timing of left movements
var moveRight = []; //Timing of right movements
var moveDown = []; //Timing of down movements
var Stop = []; //Timing of block movement

//Controls the speed of the animation (Scales the animation frame counts, > 1 to slow down, < 1 to speed up)
var scale_speed = 4;

//Counters for animation
var i = 0;
var k = 0;
var m = 0;
var n = 0;
var p = 0;
var clear_count = 20;

//Boolean to mark animation as complete
var completed = false;

//Center X coordinate for blocks to spawn from
X_start = 140;
//Y coordinate for block to spawn from
Y_start = 0;
//END INITIALIZATION OF GLOBAL VARIABLES

//BEGIN SETUP
function setup() {
  //Canvas and FrameRate setting
  createCanvas(280, 280);
  frameRate(60);

  //Background blocks that do not move & are cleared at end:
  Back.push(new JBlock(X_start - 80, Y_start + 220, 20, 3));
  Back.push(new JBlock(X_start - 80, Y_start + 220, 20, 1));
  Back.push(new IBlock(X_start - 80, Y_start + 240, 20, 3));
  Back.push(new TBlock(X_start, Y_start + 200, 20, 3));
  Back.push(new TBlock(X_start + 60, Y_start + 200, 20, 3));
  Back.push(new JBlock(X_start, Y_start + 240, 20, 3));
  Back.push(new ZBlock(X_start + 40, Y_start + 220, 20, 3));
  Back.push(new OBlock(X_start + 80, Y_start + 240, 20, 3));

  //Blocks creation and Movement Timing:
  //First T-Block movements:
  Blocks.push(new TBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveDown.push(2 * scale_speed); //Move Block down
  moveDown.push(4 * scale_speed); //Move Block down
  moveLeft.push(8 * scale_speed); //Move Block left
  Rotate.push(14 * scale_speed); //Rotate Block
  moveLeft.push(15 * scale_speed); //Move Block left
  moveLeft.push(16 * scale_speed); //Move Block left
  Rotate.push(20 * scale_speed); //Rotate Block
  moveLeft.push(22 * scale_speed); //Move Block left
  Stop.push(24 * scale_speed);

  //Second T-Block Movements
  Blocks.push(new TBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveDown.push(28 * scale_speed); //Move Block down
  moveDown.push(32 * scale_speed); //Move Block down
  moveDown.push(34 * scale_speed); //Move Block down
  moveDown.push(38 * scale_speed); //Move Block down
  Stop.push(42 * scale_speed);

  //Z-Block Movements
  Blocks.push(new ZBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveLeft.push(44 * scale_speed); //Move Block left
  moveLeft.push(46 * scale_speed); //Move Block left
  moveDown.push(50 * scale_speed); //Move Block down
  moveDown.push(52 * scale_speed); //Move Block down
  Stop.push(54 * scale_speed);

  //S-Block Movements
  Blocks.push(new SBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveDown.push(57 * scale_speed); //Move Block down
  moveDown.push(63 * scale_speed); //Move Block down
  Stop.push(66 * scale_speed);

  //First I-Block Movements
  Blocks.push(new IBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveRight.push(70 * scale_speed); //Move Block right
  moveRight.push(74 * scale_speed); //Move Block right
  moveDown.push(76 * scale_speed); //Move Block down
  moveDown.push(80 * scale_speed); //Move Block down
  moveDown.push(82 * scale_speed); //Move Block down
  Stop.push(84 * scale_speed);

  //Second I-Block Movements
  Blocks.push(new IBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveRight.push(86 * scale_speed); //Move Block right
  moveDown.push(88 * scale_speed); //Move Block down
  moveRight.push(92 * scale_speed); //Move Block right
  moveRight.push(94 * scale_speed); //Move Block right
  moveDown.push(98 * scale_speed); //Move Block down
  moveDown.push(100 * scale_speed); //Move Block down
  Stop.push(102 * scale_speed);

  //First O-Block Movements
  Blocks.push(new OBlock(X_start, Y_start + 20, 20, 0)); //Create new Block
  moveRight.push(106 * scale_speed); //Move Block right
  moveDown.push(110 * scale_speed); //Move Block down
  moveDown.push(112 * scale_speed); //Move Block down
  Stop.push(114 * scale_speed);

  //Second O-Block Movements
  Blocks.push(new OBlock(X_start, Y_start + 20, 20, 0)); //Create new Block
  moveRight.push(118 * scale_speed); //Move Block right
  moveRight.push(122 * scale_speed); //Move Block right
  moveRight.push(124 * scale_speed); //Move Block right
  moveDown.push(130 * scale_speed); //Move Block down
  Stop.push(132 * scale_speed);

  //Final Block: L-Block Movements
  Blocks.push(new LBlock(X_start, Y_start + 40, 20, 0)); //Create new Block
  moveRight.push(134 * scale_speed); //Move Block right
  moveRight.push(135 * scale_speed); //Move Block right
  moveRight.push(137 * scale_speed); //Move Block right
  moveRight.push(140 * scale_speed); //Move Block right
  moveRight.push(142 * scale_speed); //Move Block right
  moveRight.push(146 * scale_speed); //Move Block right
  moveDown.push(148 * scale_speed); //Move Block down
  moveDown.push(152 * scale_speed); //Move Block down
  moveDown.push(154 * scale_speed); //Move Block down
  moveDown.push(158 * scale_speed); //Move Block down
  moveDown.push(160 * scale_speed); //Move Block down
  Stop.push(162 * scale_speed);
}
//END SET UP

//BEGIN DRAW LOOP
function draw() {
  background(0);

  //"UI" (TETRIS BORDER OF GRAY BLOCK WALLS)
  fill(200); //Light Gray fill
  for (offset = 0; offset < 14; offset++) {
    //Create left wall
    rect(X_start - 140, Y_start + 20 * offset, 20, 20);
  }
  for (offset = 0; offset < 14; offset++) {
    //Create right wall
    rect(X_start + 120, Y_start + 20 * offset, 20, 20);
  }
  for (offset = 0; offset < 12; offset++) {
    //Create bottom wall
    rect(X_start + 20 * offset - 120, Y_start + 260, 20, 20);
  }

  //Continue animating new blocks if there are still blocks left to animate
  if (i < Blocks.length) {
    //Blocks move down automatically every 6*scale_speed Frames
    if (frameCount % (6 * scale_speed) == 0) {
      Blocks[i].drop();
    }

    //Check if a block needs to be rotated
    if (frameCount >= Rotate[k]) {
      Blocks[i].nextState();
      k++;
    }

    //Check if a block needs to be moved left
    if (frameCount >= moveLeft[m]) {
      Blocks[i].left();
      m++;
    }

    //Check if a block needs to be moved left
    if (frameCount >= moveRight[n]) {
      Blocks[i].right();
      n++;
    }

    //Check if a block needs to be moved down
    if (frameCount >= moveDown[p]) {
      Blocks[i].drop();
      p++;
    }

    //Check if a block is done being animated
    if (frameCount >= Stop[i]) {
      if (i != Blocks.length - 1) {
        //If not the alst block to animate
        Done[i] = Blocks[i]; //Add the Previously animated Blocks to list of blocks to be continuosly drawn
      } else {
        //Last block to be animated will cleared with background, add to background blocks
        Back.push(Blocks[i]);
      }

      i++; //iterate to next Block in queue
    } else {
      //if block is not done being animated, continue to draw it animating
      Blocks[i].draw();
    }
  }

  //Draw all blocks that have finished animating continuosly
  for (j = 0; j < Done.length; j++) {
    Done[j].draw();
  }

  if (frameCount < 176 * scale_speed) {
    //Untill Blocks are still animating:
    //Draw background blocks
    for (q = 0; q < Back.length; q++) {
      Back[q].draw();
    }
    //Once all "Blocks" are done animating, initiate the background block clearing animation:
    if (frameCount > 164 * scale_speed) {
      fill(0);
      rect(X_start - clear_count, 200, 2 * clear_count, 60);
      if (frameCount % (2 * scale_speed) == 0 && frameCount) {
        //"Clearing" animation grows every 20 frames
        clear_count = clear_count + 20;
      }
    }
  } else if (completed == false && frameCount > 176 * scale_speed) {
    //Move the letters to "fall" to the bottom once animation is done.
    for (temp = 0; temp < Done.length; temp++) {
      Done[temp].y = Done[temp].y + 60;
      completed = true; //mark end of animation
    }
  }
}
//END DRAW LOOP
