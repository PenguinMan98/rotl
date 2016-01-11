var firebaseURL = "https://rotl.firebaseio.com/";

module.exports = {
  // synced fields ================================
  guid: '', // unique identifier for this browser/user
  name: '', // player's chosen name
  lastActivity: Date.now(), // last activity the player has taken
  score: 0, // my total score
  turnScore: 0, // my score for this turn
  myTurn: false, // true if it's my turn
  turnOrder: 0, // my position in the turn order
  showGame: false, // true if I chose to join or spectate the game
  joinedGame: false, // true if I chose to join the game
  ready: false, // true if I'm ready for the game to start

  // non-synced fields ================================
  lastUpdate: Date.now(), // last time data was pulled from the server
  localPlayerReady: false,
  remotePlayerReady: false,

  // db's
  playerDB: null,
  playerListDB: null,

  /* ================================
  * Generate a guid for the player/browser combo
  * */
  makeGuid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4();
  },


  /*
  * Initialize the player
  * sync with local data
  * query and sync with server
  * */
  init: function( ){
    this.guid = localStorage.getItem('player_guid');
    if(this.guid && this.guid != ''){ // I'm already registered
      this.localFetch();
    }else{
      this.guid = this.makeGuid();
      this.name = "Player-" + this.guid;
      this.lastActivity = Date.now();
      this.lastUpdate = Date.now();
    }
    this.localSave();
    this.localPlayerReady = true;

    // set up my database connections
    this.playerListDB = new Firebase( firebaseURL + "players/");
    this.playerDB = new Firebase( firebaseURL + "players/" + this.guid + "/");

    // listen for changes to the player
    this.playerDB.on('value', this.sync.bind(this));

    // push my player
    //this.playerDB.update(this.props());
  },


  /*
  * A list of my properties (serialize my player)
  * */
  props: function(){
    return {
      guid: this.guid,
      name: this.name,
      lastActivity: this.lastActivity,
      lastUpdate: this.lastUpdate,
      score: this.score,
      turnScore: this.turnScore,
      turnOrder: this.turnOrder,
      myTurn: this.myTurn,
      showGame: this.showGame,
      joinedGame: this.joinedGame,
      ready: this.ready
    };
  },


  /*
  * Receives player data from the server
  * */
  sync: function( snapshot ){
    var player = snapshot.val();
    if(player) {
      // props
      // I'd love to automate this but firebase only stores strings
      this.guid = player.guid;
      this.name = player.name;
      this.lastActivity = parseInt(player.lastActivity);
      this.lastUpdate = parseInt(player.lastUpdate);
      this.score = parseInt(player.score);
      this.turnScore = parseInt(player.turnScore);
      this.turnOrder = parseInt(player.turnOrder);
      this.myTurn = Boolean(player.myTurn);
      this.showGame = Boolean(player.showGame);
      this.joinedGame = Boolean(player.joinedGame);
      this.ready = Boolean(player.ready);

      // other
      this.lastUpdate = Date.now();
      this.localSave();
      this.remotePlayerReady = true;

      // check if it's time to start the game
      this.checkForGameStart();
    }
  },


  /*
  * Save data to the browser
  * */
  localSave: function( ){
    for( var key in this.props()){
      localStorage.setItem('player_'+key, this[key]);
    }
  },


  /*
  * Retrieve data from the local storage
  * */
  localFetch: function( ){
    for( var key in this.props()){
      if(localStorage.getItem('player_'+key)){
        this[key] = localStorage.getItem('player_'+key);
      }
    }
  },


  /*
   * Set Player Name
   * */
  setName( name ){
    this.name = name;
    this.playerDB.update(this.props());
  },


  /*
   * Set Player Name
   * */
  setTurnOrder( turn ){
    this.turnOrder = turn;
    this.playerDB.update(this.props());
  },


  /*
  * Update the player score
  * */
  updateScore( score ){
    this.score += score;
    this.playerDB.update(this.props());
  },


  /*
   * indicate if I am joining the game
   * */
  joinGame( state ){
    this.joinedGame = (state) ? true : false;
    this.playerDB.update(this.props());
  },


  /*
   * indicate I am ready to start the game
   * */
  setReady(){
    this.ready = true;
    this.showGame = true;
    this.playerDB.update(this.props());
  },


  /*
  * Check to see if I should start a game
  * */
  checkForGameStart: function(){

  }
};