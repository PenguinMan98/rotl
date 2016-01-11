var DiceCup = require('../util/dice');

module.exports = {
  myPlayer: {},

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
  currentPlayerGuid: null, // stores the guid of the player whose turn it is. CAN be synced
  myTurn: false, // CANNOT be synced.  Use for local reference
  turnOver: false, // CAN be synced.

  // shortcuts
  allDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag', 'pit', 'crash'],
  commonDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag'],

  // configuration
  messagesInChat: 10,
  gameDB: null,
  firebaseURL: "https://rotl.firebaseio.com/",
  dbGamePath: 'game/',
  gameStarted: false,


  /*
   * initialize the game
   * */
  init: function (db, myPlayer) {
    this.gameDB = db.game;
    this.myPlayer = myPlayer;

    // listen for changes to the gsme
    this.gameDB.on('value', this.setGameState.bind(this));

    //db.player.on('value', this.receivePlayerList.bind(this));
  },


  /*
   * set up the new game turn
   * */
  newTurn: function (player) {
    if (typeof this.player == "object" && this.player.updateScore) {
      this.player.updateScore(this.turnScore);
    }
    this.player = player;
    this.turnScore = 0;
    this.turnOver = false;

    var die;
    for (var id in this.allDieArray) {
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
    if (this.turnOver) {
      console.log("Can't throw! Turn over.");
      return false;
    }
    this.throwNumber += 1;

    var die;
    for (var id in this.commonDieArray) {
      die = this[this.commonDieArray[id]];
      if (!die.locked && !die.disabled) {
        die.value = DiceCup.roll(die.type);
      }
    }
    if (this['flag'].value != 'green') {
      this.turnOver = true;
      if (this['flag'].value == 'black') {
        console.log("Tripped!");
      } else if (this['flag'].value == 'red') {
        console.log("Got in a fight!");
        this.crash.value = DiceCup.roll('crash');
      } else if (this['flag'].value == 'yellow') {
        console.log("Slowed by debris!");
        this.pit.value = DiceCup.roll('pit');
      }
    }

    if (this.power.value == 'flat') {
      this.power.disabled = true;
    }

    this.calculateTurnScore();
    return this.getGameState();
  },


  /*
   * Returns the details of this game for serialization and sync
   * */
  getGameState: function () {
    if (!this.myTurn) {
      console.log("We don't send sync data unless it's our turn.");
      return false;
    }
    var gameState = {};

    var die, dieName;
    for (var dieId in this.allDieArray) {
      dieName = this.allDieArray[dieId];
      die = this[dieName];
      gameState[dieName] = die;
    }
    gameState.turnScore = this.turnScore;
    gameState.throwNumber = this.throwNumber;
    //gameState.myTurn = this.myTurn; // can't sync this.  It's not the same for all players.
    gameState.currentPlayerGuid = this.currentPlayerGuid;
    gameState.turnOver = this.turnOver;
    gameState.gameStarted = this.gameStarted;

    // push the gameState
    this.gameDB.update(gameState);

    return gameState;
  },


  /*
   * Receives the details of this game for serialization and sync
   * */
  setGameState: function (gameState) {
    gameState = gameState.val();
    if (typeof gameState != "object") {
      console.log('cannot sync. gameState invalid.(', gameState, ')');
      return false;
    }
    if( !gameState ){ // if the state of the game is null
      console.log('No game state found. Creating one');
      this.gameDB.push(this.getGameState()); // push a default one
      return true;
    }
    /*if (this.myTurn) {
      console.log('unable to receive sync data during my own turn');
      return false;
    }*/
    console.log('setting game state', gameState);

    var die, dieName;
    for (var dieId in this.allDieArray) {
      dieName = this.allDieArray[dieId];
      die = gameState[dieName];
    }
    this.turnScore = parseInt(gameState.turnScore);
    this.throwNumber = parseInt(gameState.throwNumber);
    //this.myTurn = Boolean(gameState.myTurn); // can't sync this.  It's not the same for all players.
    this.currentPlayerGuid = Boolean(gameState.currentPlayerGuid);
    this.turnOver = Boolean(gameState.turnOver);
    this.gameStarted = Boolean(gameState.gameStarted);
  },


  /*
   * lock a die
   * */
  toggleLock: function (die) {
    if (this[die]) {
      this[die].locked = !this[die].locked;
    }
    return this[die].locked;
  },
  endTurn: function () {
    this.turnOver = true;
    return this.getGameState();
  },


  /*
   * get the throw total
   * */
  calculateTurnScore: function () {
    // first, sum the common dice
    var sum = this.sumCommonDice();
    switch (this.flag.value) {
      case 'yellow':
        // pit (debris)
        if (this.pit.value == 'caution') {
          alert('CAUTION LIGHT');
        } else {
          sum += parseInt(this.pit.value);
        }
        break;
      case 'red':
        // crash (fighting)
        if (this.crash.value == 'crash') {
          alert('CRASH');
        } else if (this.crash.value == 'crashOut') {
          alert('CRASH OUT');
        } else {
          sum += parseInt(this.crash.value);
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
    this.turnScore = sum;
  },


  /*
   * Sum the common dice
   * */
  sumCommonDice: function () {
    var die;
    var sum = 0;
    for (var dieId in this.commonDieArray) {
      die = this[this.commonDieArray[dieId]];
      if (!die.disabled && !(die.type == 'flag')) { // skip disabled dice (flat tires) and the flag die
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
   * Listen for changes to the player list so we can react to them
   * */
  receivePlayerList: function (rawData) {
    var playerList = rawData.val();
    console.log('game is listening to player list!', playerList);

    /*if(this.gameStarted) {
      this.myTurnCheck(playerList);
    }else{
      this.startGameCheck(playerList);
    }*/
  },


  /*
  * Check if it's my turn
  * */
  myTurnCheck: function(playerList) {
    var player;
    var playerTurnCount = 0;
    var activePlayer;
    for (var guid in playerList) {
      player = playerList[guid];
      if(player.myTurn && player.guid == this.myPlayer.guid){
        console.log("It's my turn!");
        this.myTurn = true; // It's my turn!
      }
      if(player.myTurn){
        activePlayer = player;
        playerTurnCount += 1;
      }
    }
    // sanity checking
    if(playerTurnCount == 0){
      console.log("Whoa.. it's nobody's turn!");
    }else if(playerTurnCount > 1){
      console.log("Whoa.. more than on player thinks it's their turn!");
    }else{
      this.currentPlayerGuid = activePlayer.guid;
    }

    // all functions should send their changes to the db
    this.gameDB.update(this.getGameState);

    // this one also returns whether it's my turn or not
    return this.myTurn;
  },

  /*
   * Check the player state to see if we should launch the game
   * */
  startGameCheck: function (playerList) {
    console.log('checking to see if we should start the game', playerList);
    // Loop through the players
    var player;
    var playerCount = 0;
    for (var guid in playerList) {
      player = playerList[guid];
      if (player.joinedGame) {
        playerCount += 1;
      }
      if (player.joinedGame && !player.ready) { // if any of them aren't ready,
        console.log('player', player.name, "isn't ready");
        return false; // terminate this function
      }
    }
    if (playerCount == 0 || playerCount == 1) {
      console.log('Game requires at least two players right?');
      return false;
    }

    //this.startGame(playerList);
  },


  /*
   * Check the player state to see if we should launch the game
   * */
  startGame: function (playerList) {
    // Time to set up the game!
    var firstPlayer;
    for (var guid in playerList) {
      player = playerList[guid];


      // reset the scores
      player.score = 0;
      player.turnScore = 0;

      // clear myTurn
      player.myTurn = (player.turnOrder == 1);

      if (player.turnOrder == 1) { // who's on first?
        firstPlayer = player;
        this.currentPlayerGuid = player.guid;
      }
    }

    if (this.myPlayer.guid == firstPlayer.guid) {
      console.log("I'm first!");
      this.myTurn = true;

      // update the new state
      this.myPlayer.playerListDB.update(playerList);

      console.log('start the game already!');
      this.gameStarted = true;
      this.gameDB.update(this.getGameState());
      this.newTurn(firstPlayer); // start the game!
    } else {
      this.myTurn = false;
      console.log("I'm not first!");
    }

  }
};
