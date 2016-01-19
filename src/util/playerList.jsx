var firebaseURL = "https://rotl.firebaseio.com/";

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
  * Randomize the turn order
  * */
  randomizeTurnOrder( game ){
    /*if(!game.gameStarted){
      console.log("game isn't started");
    }*/
    var turnOrderArr = [];
    for(var guid in this.playerList){
      turnOrderArr.push(guid);
    }
    console.log('random turn order', this.playerList);
    this.shuffle(turnOrderArr);
    for(var index in turnOrderArr){
      this.playerList[turnOrderArr[index]].turnOrder = index;
    }
    console.log('random turn order', this.playerList);
  },

  shuffle: function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
    //console.log('joining game', this.playerList);
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
  * Players all indicate they are ready for the game to start
  * */
  setReady: function( myGuid ){
    // loop through the players
    console.log('Setting me ready', this.playerList);
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
  * Return the guid of the next player
  * */
  getNextPlayer( guid ){
    var nextPlayer;
    var tempPlayerList = [];
    var guidFound = false;
    var currentPosition;
    var player;
    var sortedPlayerList = {};

    // make a sortable simple list of players
    for(var guid in this.playerList){
      player = this.playerList[guid];
      // check for the current guid
      if(player.guid == guid){
        guidFound = true;
        currentPosition = player.turnOrder;
      }
      tempPlayerList.push({
        guid: player.guid,
        turnOrder: player.turnOrder
      });
    }
    console.log('before sorting playerlist', JSON.stringify(tempPlayerList));
    // sort them in turn order
    tempPlayerList.sort(function(a,b){
      return a.turnOrder - b.turnOrder;
    });

    if(tempPlayerList.length > 0){
      player = tempPlayerList[tempPlayerList.length - 1];
      if(player.guid == guid){
        return tempPlayerList[0].guid;
      }
    }else{
      console.log('Error no players!');
      return false;
    }
    console.log('after sorting playerlist', JSON.stringify(tempPlayerList));
    while(tempPlayerList.length > 0){
      player = tempPlayerList.shift();
      if(player.turnOrder > currentPosition){
        return player.guid;
      }
    }
  },

  /*
  * Send the changes to the db!
  * */
  dbUpdate: function(){
    if( !this.playerListDB ){ return false; }

    console.log('joined game', this.playerList);
    delete this.playerList['.key'];  // not sure what this is or how it gets here but it screws everything up
    this.playerListDB.update(this.playerList);
  }
};