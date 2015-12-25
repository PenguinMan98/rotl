var firebaseURL = "https://rotl.firebaseio.com/";

module.exports = {
  // synced fields
  guid: '', // unique identifier for this browser/user
  name: '', // player's chosen name
  lastActivity: Date.now(), // last activity the player has taken
  score: 0, // my total score
  turnScore: 0, // my score for this turn
  myTurn: false, // true if it's my turn

  // non-synced fields
  lastUpdate: Date.now(), // last time data was pulled from the server
  localPlayerReady: false,
  remotePlayerReady: false,
  playerDB: null,
  playerListDB: null,

  makeGuid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4();
  },
  init: function( db ){
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
    this.playerDB.update(this.props());
  },
  props: function(){
    return {
      guid: this.guid,
      name: this.name,
      lastActivity: this.lastActivity,
      lastUpdate: this.lastUpdate,
      score: this.score,
      turnScore: this.turnScore,
      myTurn: this.myTurn
    };
  },
  sync: function( snapshot ){
    var player = snapshot.val();
    if(player) {
      for( var key in this.props()){
        if(player[key]){
          this[key] = player[key];
        }
      }
      this.lastUpdate = Date.now();
      this.localSave();
      this.remotePlayerReady = true;
    }
  },
  localSave: function( ){
    for( var key in this.props()){
      localStorage.setItem('player_'+key, this[key]);
    }
  },
  localFetch: function( ){
    for( var key in this.props()){
      if(localStorage.getItem('player_'+key)){
        this[key] = localStorage.getItem('player_'+key);
      }
    }
  },
  setName( name ){
    console.log('Setting my name to ', name);
    this.name = name;
    console.log('sending', this.props());
    this.playerDB.update(this.props());
  }
};