var firebaseURL = "https://rotl.firebaseio.com/";

module.exports = {
  myTurn: false, // true if it's my turn
  turnOrder: 0, // my position in the turn order
  playerList: [],

  // votes
  voteToStart: false,
  voteToSkip: false,
  voteToRestart: false,
  voteToEnd: false,

  // db's
  playerDB: null,
  playerListDB: null,

  /*
   * Initialize the player
   * sync with local data
   * query and sync with server
   * */
  init: function( db ){
    // set up my database connections
    this.playerListDB = new db( firebaseURL + "players/");
    //this.playerDB = new db( firebaseURL + "players/" + this.guid + "/");

    // listen for changes to the player list
    this.playerListDB.on('value', this.receivePlayerList.bind(this));

    // push my player
    //this.playerDB.update(this.props());
  },


  /*
   * Receives player list data from the server
   * */
  receivePlayerList: function( snapshot ){
    var playerList = snapshot.val();

    this.playerList = playerList;
    /*for(var guid in playerList){
      this.playerList.push(playerList[guid]);
    }*/
    console.log('playerList', this.playerList);

  },


  /*
  * return the number of players
  * */
  getPlayerCount: function(){
    var playerCount = 0;
    for(var guid in this.playerList){
      console.log('I got a player', this.playerList[guid]);
      playerCount += 1;
    }
    return playerCount;
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
   * Receive Votes
   * */
  syncVote: function( vote ){

  }
};