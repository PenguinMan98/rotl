var DiceCup = require('../util/dice');

module.exports = {
  myGuid: 0, // my guid
  gameDB: null,
  gameState: {},

  // dice
  power: {
    disabled: false,
    value: "--",
    type: "power",
    locked: false,
    lockable: true
  },
  track1: {
    disabled: false,
    value: "--",
    type: "track",
    locked: false,
    lockable: true
  },
  track2: {
    disabled: false,
    value: "--",
    type: "track",
    locked: false,
    lockable: true
  },
  track3: {
    disabled: false,
    value: "--",
    type: "track",
    locked: false,
    lockable: true
  },
  track4: {
    disabled: false,
    value: "--",
    type: "track",
    locked: false,
    lockable: true
  },
  track5: {
    disabled: false,
    value: "--",
    type: "track",
    locked: false,
    lockable: true
  },
  flag: {
    disabled: false,
    value: "--",
    type: "flag",
    locked: false,
    lockable: false
  },
  pit: {
    disabled: false,
    value: "--",
    type: "pit",
    locked: false,
    lockable: false
  },
  crash: {
    disabled: false,
    value: "--",
    type: "crash",
    locked: true,
    lockable: false
  },

  // shortcuts
  allDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag', 'pit', 'crash'],
  commonDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag'],

  // configuration
  messagesInChat: 10,


  /*
   * initialize the game
   * */
  init: function (gameDB, myGuid) {
    this.gameDB = gameDB;
    this.myGuid = myGuid;
  },


  /*
   * set up the new game turn
   * */
  newTurn: function ( guid ) {
    this.gameState.turnScore = 0;
    this.gameState.turnOver = false;
    this.gameState.throwNumber = 1;
    this.gameState.currentPlayerGuid = guid;

    var die;
    for (var id in this.allDieArray) {
      die = this.gameState[this.allDieArray[id]];
      die.value = '--';
      die.locked = (id === "crash" || id === "pit");
      die.thrownYet = false;
    }
    this.gameDB.update(this.gameState);
  },


  /*
   * start the game
   * */
  startGame: function () {
    this.gameState.gameStarted = true;
    this.gameState.turnScore = 0;
    this.gameState.throwNumber = 1;
    this.gameState.turnOver = false;

    var die;
    for (var id in this.allDieArray) {
      die = this.gameState[this.allDieArray[id]];
      die.value = '--';
      die.locked = (id === "crash" || id === "pit");
      die.thrownYet = false;
    }
    this.gameDB.update(this.gameState);
  },


  /*
   * Throw the dice!
   * */
  newThrow(){
    if (this.gameState.turnOver) {
      console.log("Can't throw! Turn over.");
      return false;
    }
    this.gameState.throwNumber += 1;

    var die;
    for (var id in this.commonDieArray) {
      die = this.gameState[this.commonDieArray[id]];
      if (!die.locked && !die.disabled) {
        die.value = DiceCup.roll(die.type);
      }
    }
    if (this.gameState['flag'].value != 'green') {
      this.gameState.turnOver = true;
      if (this.gameState['flag'].value == 'black') {
        console.log("Tripped!");
      } else if (this.gameState['flag'].value == 'red') {
        console.log("Got in a fight!");
        this.gameState.crash.value = DiceCup.roll('crash');
      } else if (this.gameState['flag'].value == 'yellow') {
        console.log("Slowed by debris!");
        this.gameState.pit.value = DiceCup.roll('pit');
      }
    }

    if (this.gameState.power.value == 'flat') {
      this.gameState.power.disabled = true;
    }

    this.calculateTurnScore();
    this.dbUpdate();
    //return this.getGameState();
  },


  /*
   * Returns a default game for initialization
   * */
  getDefaultGameState: function () {
    /*if (!this.myTurn) {
      console.log("We don't send sync data unless it's our turn.");
      return false;
    }*/
    var gameState = {};

    var die, dieName;
    for (var dieId in this.allDieArray) {
      dieName = this.allDieArray[dieId];
      die = this[dieName];
      gameState[dieName] = die;
    }
    gameState.turnScore = 0;
    gameState.throwNumber = 1;
    //gameState.myTurn = this.myTurn; // can't sync this.  It's not the same for all players.
    gameState.currentPlayerGuid = 0;
    gameState.turnOver = false;
    gameState.gameStarted = false;

    // push the gameState
    //this.gameDB.update(gameState);

    return gameState;
  },


  /*
   * Receives the details of this game for serialization and sync
   * */
  setGameState: function (gameState) {
    this.gameState = gameState;
  },


  /*
   * lock a die
   * */
  toggleLock: function (dieId, state) {
    if (this.gameState[dieId]) {
      this.gameState[dieId].locked = state;
      this.dbUpdate();
    }
  },


  /*
   * get the throw total
   * */
  calculateTurnScore: function () {
    // first, sum the common dice
    var sum = this.sumCommonDice();
    switch (this.gameState.flag.value) {
      case 'yellow':
        // pit (debris)
        if (this.gameState.pit.value == 'caution') {
          alert('CAUTION LIGHT');
        } else {
          sum += parseInt(this.gameState.pit.value);
        }
        break;
      case 'red':
        // crash (fighting)
        if (this.gameState.crash.value == 'crash') {
          alert('CRASH');
        } else if (this.gameState.crash.value == 'crashOut') {
          alert('CRASH OUT');
        } else {
          sum += parseInt(this.gameState.crash.value);
        }
        break;
      case 'black':
        // penalty
        sum = 0;
        break;
    }
    if (sum < 0) {
      // stall rule
      console.log('stall');
      sum = 0;
    }
    this.gameState.turnScore = sum;
  },


  /*
   * Sum the common dice
   * */
  sumCommonDice: function () {
    var die;
    var sum = 0;
    var value;
    for (var dieId in this.commonDieArray) {
      die = this.gameState[this.commonDieArray[dieId]];
      value = parseInt(die.value);
      if (!die.disabled && !isNaN(value)) { // skip disabled dice (flat tires) and the flag die
        sum += parseInt(die.value);
      }
    }
    return sum;
  },


  /*
   * query a die
   * */
  getDie(die){
    if (this[die]) {
      return this[die];
    }
    return false;
  },


  /*
   * Send the changes to the db!
   * */
  dbUpdate: function(){
    if( !this.gameDB ){ return false; }

    //delete this.gameDB['.key'];  // not sure what this is or how it gets here but it screws everything up
    this.gameDB.update( this.gameState );
  }

};
