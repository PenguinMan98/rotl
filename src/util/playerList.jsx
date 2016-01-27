
module.exports = {
  myGuid: 0, // my guid
  myTurn: false, // true if it's my turn
  turnOrder: 0, // my position in the turn order
  playerList: {}, // I can store a playerList (But not get it from the server)

  // votes
  voteToStart: false,
  voteToSkip: false,
  voteToRestart: false,
  voteToEnd: false,

  // db
  playerListDB: null,


  /*
  * Init
  * Get the db connection so I can send updates.
  * */
  init: function( playerListDB, myGuid ){
    this.playerListDB = playerListDB;
    this.myGuid = myGuid;
  },


  /*
  * I can set this before running the other commands
  * */
  setPlayerList( playerList ){
    this.playerList = playerList;
  },

  /*
   * return the number of players
   * */
  getPlayerCount: function( playerList ){
    playerList = (typeof playerList == "undefined") ? this.playerList : playerList;
    var playerCount = 0;
    for(var guid in playerList){
      console.log('I got a player', playerList[guid]);
      playerCount += 1;
    }
    return playerCount;
  },


  /*
   * return my player
   * */
  getPlayerByGuid: function( searchGuid ){
    if(typeof searchGuid == "undefined" || !searchGuid){
      return false; // without a guid, I dunno
    }
    for(var guid in this.playerList){
      if( guid == searchGuid ){
        return this.playerList[guid];
      }
    }
    return false; // I didn't find anybody
  },


  /*
   * Votes
   * */
  castVote: function(vote, type){
    var voteTypes = ['start', 'skip', 'restart', 'end'];
    // only allow a valid vote
    if(voteTypes.indexOf(vote) === false){
      return false;
    }

    if(vote == 'start'){

    }
  },

  /*
   * Tell the player at this guid to join the game
   * */
  joinGame( myGuid, position ){
    // loop through the players
    var player;
    for( var guid in this.playerList ){
      player = this.playerList[guid];
      if( guid == myGuid ){ // find me
        player.joinedGame = true; // set me joined
        player.turnOrder = position; // set my position
      }
    }
    // send the updates to the db
    this.dbUpdate();
  },


  /*
   * Tell the player at this guid to spectate the game
   * */
  spectateGame( myGuid ){
    // loop through the players
    var player;
    for( var guid in this.playerList ){
      player = this.playerList[guid];
      if( guid == myGuid ){ // find me
        player.showGame = true; // show the game
      }
    }
    // send the updates to the db
    this.dbUpdate();
  },


  /*
   * Players all indicate they are ready for the game to start
   * */
  setReady: function( myGuid ){
    // loop through the players
    var player;
    for( var guid in this.playerList ){
      player = this.playerList[guid];
      if( guid == myGuid ){ // find me
        player.ready = true; // I'm ready!
        player.showGame = true; // show me the game
      }
    }
    // send the updates to the db
    this.dbUpdate();
  },


  /*
   * Players all indicate they are ready for the game to start
   * */
  addScore: function( myGuid, score ){
    // loop through the players
    var player;
    for( var guid in this.playerList ){
      player = this.playerList[guid];
      if( guid == myGuid ){ // find me
        // update my score
        player.score = parseInt(player.score) + score;
      }
    }
    // send the updates to the db
    this.dbUpdate();
  },


  /*
  * Return the guid of the next player
  * */
  getNextPlayer( currentPlayerGuid ){
    var tempPlayerList = [];
    var guidFound = false;
    var currentPosition = 0;
    var player;

    // make a sortable simple list of players
    for(var guid in this.playerList){
      player = this.playerList[guid];
      // check for the current guid
      if(player.guid == currentPlayerGuid){
        guidFound = true;
        currentPosition = player.turnOrder;
      }
      if(player.guid && player.joinedGame){ // only if the player exists and is in the game,
        tempPlayerList.push({
          guid: player.guid,
          turnOrder: player.turnOrder
        });
      }
    }

    // sort them in turn order
    tempPlayerList.sort(function(a,b){
      return a.turnOrder - b.turnOrder;
    });

    if(tempPlayerList.length > 0){
      player = tempPlayerList[tempPlayerList.length - 1];
      if(player.guid == currentPlayerGuid){ // if the last player is the current player
        console.log("I'm the last player");
        return tempPlayerList[0].guid; // then the first player is next
      }
    }else{// no players??
      return false;
    }
    while(tempPlayerList.length > 0){
      player = tempPlayerList.shift();
      console.log('checking player', player);
      if(player.turnOrder > currentPosition){
        console.log('This guy is next');
        return player.guid;
      }
    }
  },

  /*
  * Send the changes to the db!
  * */
  dbUpdate: function(){
    if( !this.playerListDB ){ return false; }

    delete this.playerList['.key'];  // not sure what this is or how it gets here but it screws everything up
    delete this.playerList['.value'];  // not sure what this is or how it gets here but it screws everything up
    this.playerListDB.update(this.playerList);
  },

  /*
  * RESET the game
  * */
  resetGame: function(){
    var player;
    for( var guid in this.playerList ){
      player = this.playerList[guid];
      player.joinedGame = false;
      player.myTurn = false;
      player.score = 0;
      player.showGame = false;
      player.ready = false;
      player.turnOrder = 0;
      player.turnScore = 0;
    }
    this.dbUpdate();
  },

  /*
  * Am I ready to start the game?
  * */
  readyToStart: function(){
    var player;
    var ready = true;
    var playerCount = 0;
    for( var guid in this.playerList ) {
      player = this.playerList[guid];
      if(player.joinedGame) {
        playerCount += 1;
        if (!player.ready) {
          ready = false;
        }
      }
    }
    if( playerCount < 2 ){
      return false;
    }
    return ready;
  }
};