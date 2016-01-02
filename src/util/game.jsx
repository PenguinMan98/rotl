var DiceCup = require('../util/dice');

module.exports = {
  player: {},

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

  // score
  turnScore: 0,

  // throw (needed?)
  throwNumber: 0,

  // turn
  myTurn: true,
  turnOver: false,

  // shortcuts
  allDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag', 'pit', 'crash'],
  commonDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag'],

  // configuration
  messagesInChat: 10,
  gameDB: null,
  firebaseURL: "https://rotl.firebaseio.com/",
  dbGamePath: 'game/',

  /*
  * initialize the game
  * */
  init: function( db ){
    // fire off an event to get data from the server
    this.gameDB = new Firebase( this.firebaseURL + this.dbGamePath);

    // listen for changes to the gsme
    this.gameDB.on('value', this.setGameState.bind(this));
  },


  /*
  * set up the new game turn
  * */
  newTurn: function( player ){
    if( typeof this.player == "object" && this.player.updateScore ){
      this.player.updateScore(this.thisTurn);
    }
    this.player = player;
    this.turnScore = 0;
    this.turnOver = false;

    var die;
    for(var id in this.allDieArray){
      die = this[this.allDieArray[id]];
      die.value = '--';
      die.locked = (id === "crash" || id === "pit");
      die.thrownYet = false;
    }
  },


  /*
  * Throw the dice!
  * */
  newThrow(){
    if(this.turnOver){
      console.log("Can't throw! Turn over.");
      return false;
    }
    this.throwNumber += 1;

    var die;
    for(var id in this.commonDieArray){
      die = this[this.commonDieArray[id]];
      if(!die.locked && !die.disabled){
        die.value = DiceCup.roll(die.type);
      }
    }
    if(this['flag'].value != 'green'){
      this.turnOver = true;
      if(this['flag'].value == 'black'){
        console.log("Tripped!");
      }else if(this['flag'].value == 'red'){
        console.log("Got in a fight!");
        this.crash.value = DiceCup.roll('crash');
      }else if(this['flag'].value == 'yellow'){
        console.log("Slowed by debris!");
        this.pit.value = DiceCup.roll('pit');
      }
    }

    if(this.power.value == 'flat') {
      this.power.disabled = true;
    }

    this.calculateTurnScore();
    return this.getGameState();
  },


  /*
   * Returns the details of this game for serialization and sync
   * */
  getGameState: function(){
    if(!this.myTurn){
      console.log( "We don't send sync data unless it's our turn.");
      return false;
    }
    var gameState = {};

    var die, dieName;
    for(var dieId in this.allDieArray){
      dieName = this.allDieArray[dieId];
      die = this[dieName];
      gameState[dieName] = die;
    }
    gameState.turnScore = this.turnScore;
    gameState.throwNumber = this.throwNumber;
    gameState.myTurn = this.myTurn;
    gameState.turnOver = this.turnOver;

    // push the gameState
    this.gameDB.update(gameState);

    return gameState;
  },


  /*
   * Receives the details of this game for serialization and sync
   * */
  setGameState: function( gameState ){
    if(typeof gameState != "object"){
      console.log('cannot sync. gameState invalid.(', gameState, ')');
      return false;
    }
    if(this.myTurn){
      console.log('unable to receive sync data during my own turn');
      return false;
    }
    Console.log('setting game state', gameState);

    var die, dieName;
    for(var dieId in this.allDieArray){
      dieName = this.allDieArray[dieId];
      die = gsmeState[dieName];
    }
    this.turnScore = gameState.turnScore;
    this.throwNumber = gameState.throwNumber;
    this.myTurn = gameState.myTurn;
    this.turnOver = gameState.turnOver;
  },


  /*
  * lock a die
  * */
  toggleLock: function( die ){
    if(this[die]){
      this[die].locked = !this[die].locked;
    }
    return this[die].locked;
  },
  endTurn: function(){
    this.turnOver = true;
    return this.getGameState();
  },


  /*
  * get the throw total
  * */
  calculateTurnScore: function(){
    // first, sum the common dice
    var sum = this.sumCommonDice();
    switch(this.flag.value){
      case 'yellow':
        // pit (debris)
        if(this.pit.value == 'caution'){
          alert('CAUTION LIGHT');
        }else{
          sum += parseInt(this.pit.value);
        }
        break;
      case 'red':
        // crash (fighting)
        if(this.crash.value == 'crash'){
          alert('CRASH');
        }else if(this.crash.value == 'crashOut'){
          alert('CRASH OUT');
        }else{
          sum += parseInt(this.crash.value);
        }
        break;
      case 'black':
        // penalty
        sum = 0;
        break;
    }
    if(sum < 0) {
      // stall rule
      console.log('stall');
      sum = 0;
    }
    this.turnScore = sum;
  },


  /*
  * Sum the common dice
  * */
  sumCommonDice: function(){
    var die;
    var sum = 0;
    for(var dieId in this.commonDieArray){
      die = this[this.commonDieArray[dieId]];
      if(!die.disabled && !(die.type == 'flag')){ // skip disabled dice (flat tires) and the flag die
        sum += parseInt(die.value);
      }
    }
    return sum;
  },


  /*
  * query a die
  * */
  getDie( die ){
    if(this[die]){
      return this[die];
    }
    return false;
  }
};
