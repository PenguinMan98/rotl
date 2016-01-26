var React = require('react');
var ReactFire = require('reactfire');
var PlayerScoreList = require('./playerScoreList');
var GamePane = require('./gamePane');

/*
 *
 * PASSED PROPS
 * gameUtil         the game utility
 * playerListUtil   the player list utility
 * DB               An object containing db references (player, chat, game)
 * myGuid           My Guid!
 * myPlayer         My Player
 *
 * We want the game state to refresh whenever there is a change
 * to the playerList or the gameState
 * */

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function(){
    return {
      playerList: {},
      loggedIn: false,
      myTurn: false,
      gameState: {}
    };
  },
  componentWillMount: function() {
    // subscribe to changes to the playerList
    this.bindAsObject(this.props.DB.player, 'playerList');
    this.props.DB.player.on('value', this.receivePlayerList );

    // subscribe to changes to the gameState
    this.bindAsObject(this.props.DB.game, 'gameState');
    this.props.DB.game.on('value', this.receiveGameState );
  },
  render: function(){
    // is it my turn?
    var myTurn = (this.state) ? this.state.myTurn : this.props.myTurn;
    var playerList = this.state.playerList;
    this.props.playerListUtil.setPlayerList(playerList);
    myPlayer = this.props.playerListUtil.getPlayerByGuid( this.props.myGuid );
    /*if( !myPlayer ){
      console.log("Can't really do anything without a local player");
      return false;
    }*/

    var gameState = this.state.gameState;
    this.props.gameUtil.setGameState(gameState);



    if( myPlayer && myPlayer.showGame ){  // show: true
      if( gameState.winnerGuid ){
        /*
        * Show the winner and a button to restart the game
        */
        var winner = this.props.playerListUtil.getPlayerByGuid( gameState.winnerGuid );
        return <div className="game-outer">
          <PlayerScoreList
            playerList={playerList}
            DB={this.props.DB}
          />
          <div className="row">
            <div className="col-md-offset-3 col-md-6 text-center">
              The winner is: {winner.name}!<br />
              <input
                type="button"
                value="New game!"
                onClick={this.handleReset}
              />
            </div>
          </div>
        </div>

      }else if( myPlayer && myPlayer.joinedGame ){ // I've joined the game
        //console.log('show me the game!');
        return <div className="game-outer">
          <PlayerScoreList
            playerList={playerList}
            DB={this.props.DB}
          />
          <GamePane
            mode="player"
            myTurn={myTurn}
            gameUtil={this.props.gameUtil}
            playerListUtil={this.props.playerListUtil}
            myGuid={this.props.myGuid}
          />
        </div>
      }else{ // I'm a spectator
        //console.log('spectator mode');
        return <div className="game-outer">
          <PlayerScoreList
            playerList={this.props.playerList}
            DB={this.props.DB}
          />
          <GamePane
            mode="spectator"
            myTurn={false}
            gameUtil={this.props.gameUtil}
            playerListUtil={this.props.playerListUtil}
            myGuid={this.props.myGuid}
          />
        </div>
      }
    }else{ // show: false
      if( myPlayer.joinedGame ){ // Then I've joined the game but I'm not ready; join: true
        return <div className="game-outer">
          <div className="game-inner row">
            <input
              type="button"
              className="col-md-offset-4 col-md-4"
              value="Ready to start!"
              onClick={this.handleReady}
            /><span> (Joined in Position: {myPlayer.turnOrder})</span>
          </div>
        </div>
      }else{ // I haven't joined the game; join: false
        if(this.props.gameUtil.gameStarted){ // I can't join, game has already started.  join: false, show: false, started: true
          return <div className="game-outer">
            <div className="game-inner row">
              <input
                type="button"
                className="col-md-4"
                value="Spectate the game in progress"
                onClick={this.handleSpectateGame}
              />
            </div>
          </div>
        }else{ // I'm free to join the game or spectate.  join: false, show: false, started: false
          return <div className="game-outer">
            <div className="game-inner row">
              <input
                type="button"
                className="col-md-offset-2 col-md-4"
                value="Join Game"
                onClick={this.handleJoinGame}
              />
              <input
                type="button"
                className="col-md-4"
                value="Spectate"
                onClick={this.handleSpectateGame}
              />
            </div>
          </div>
        }
      }
    }
  },

  /*
   * Handle player indicating they are ready to start the game
   * */
  handleReset: function(){
    // make sure I'm working with the latest player list and game state
    this.props.playerListUtil.setPlayerList(this.state.playerList);
    this.props.gameUtil.setGameState(this.state.gameState);
    // set me ready
    if( this.state.gameState.winnerGuid ){ // if the game just ended
      this.props.playerListUtil.resetGame();
      this.props.gameUtil.resetGame();
    }
  },

  /*
   * Handle player indicating they are ready to start the game
   * */
  handleReady: function(){
    if(this.state.gameState.gameStarted ){ // if the game has already started, this is not allowed
      return false;
    }

    // make sure I'm working with the latest player list and game state
    this.props.playerListUtil.setPlayerList(this.state.playerList);
    // set me ready
    this.props.playerListUtil.setReady(this.props.myGuid);
  },

  /*
  * Figures out which position the joining player will be in
  * */
  getMyPosition: function(){
    var position = this.countGamePlayers(this.state.playerList) + 1;
    return position;
  },

  /*
  * When the user chooses to join the game
  * */
  handleJoinGame: function(){
    // make sure I'm working with the latest player list
    this.props.playerListUtil.setPlayerList(this.state.playerList);

    // get my position
    var myPosition = this.getMyPosition();
    // join the game and lock in my position
    this.props.playerListUtil.joinGame( this.props.myGuid, myPosition );

    var gameState;
    // try to get the current one from state
    if(this.state && this.state.gameState && Object.keys(this.state.gameState).length > 1){
      gameState = this.state.gameState;
    }else{ // otherwise, generate a default
      gameState = this.props.gameUtil.getDefaultGameState();
    }
    // load the gamestate into the Util.
    this.props.gameUtil.setGameState(gameState);
    // If I'm position 1
    if( myPosition == 1 ) {
      // set me as the current player
      gameState.currentPlayerGuid = this.props.myGuid;
    }
    // save the changes
    this.props.gameUtil.dbUpdate();
  },
  handleSpectateGame: function(){
    this.props.myPlayer.joinGame( false );
  },
  receiveMyPlayer: function( snapshot ){

    // I shouldn't get this event until the player has submitted their own in-game name.
    this.setState({
      loggedIn: true,
      myPlayer: snapshot.val()
    });
  },
  receivePlayerList: function( snapshot ){
    var playerList = snapshot.val();
    if( playerList !== null && typeof playerList === 'object' && Object.keys(playerList).length > 0){
      this.setState({
        playerList: playerList
      });

      // if I'm not in the playerList, then add me.
      var foundMe = false;
      for( var guid in playerList ){
        if( guid == this.props.myGuid ){
          foundMe = true;
        }
      }
      if( !foundMe ){
        myPlayer = {};
        myPlayer[this.props.myGuid] = this.props.myPlayer.props();
        this.props.playerListUtil.playerListDB.update(myPlayer);
      }

      // when I receive player data, this can mean a number of things
      // If the game hasn't started, a new player joined or readied
      // A vote to start the game
      // if the game is started, a vote to skip, restart, etc.
      // Or a player dropping out

      var gameState = this.state.gameState;
      if(this.state && gameState && Object.keys(gameState).length > 1){ // I have a gameState and a playerList
        // check for win conditions
        this.checkWinConditions();
        // check for events that affect all players
      }
    }else if( playerList === null ){
      myPlayer = {};
      myPlayer[this.props.myGuid] = this.props.myPlayer.props();
      this.props.playerListUtil.playerListDB.update(myPlayer);
    }
  },
  receiveGameState: function( snapshot ){
    this.setState({
      gameState: snapshot.val()
    });

    // I should see gameState updates whenever
    // the dice are rolled
    // die lock state is changed
    // turn is ended or begun

    var playerList = this.state.playerList;
    if(this.state && playerList && Object.keys(playerList).length > 1){
      this.checkWinConditions();
    }
  },
  isItMyTurn: function( ){

  },
  countGamePlayers: function( playerList ){
    var gamePlayers = 0;
    if(!this.state || !this.state.playerList){
      return gamePlayers;
    }
    var player;
    for(var guid in this.state.playerList) {
      player = this.state.playerList[guid];
      if(player.joinedGame){
        gamePlayers += 1;
      }
    }
    return gamePlayers;
  },
  countReadyGamePlayers: function( playerList ){
    var gamePlayers = 0;
    if(!this.state || !this.state.playerList){
      return gamePlayers;
    }
    var player;
    for(var guid in this.state.playerList) {
      player = this.state.playerList[guid];
      if(player.joinedGame && player.ready){
        gamePlayers += 1;
      }
    }
    return gamePlayers;
  },
  checkWinConditions: function(){
    if( this.state
        && this.state.playerList && Object.keys(this.state.playerList).length > 1
        && this.state.gameState && Object.keys(this.state.gameState).length > 1) {

      var gameState = this.state.gameState;
      this.props.gameUtil.setGameState(gameState);
      var playerList = this.state.playerList;
      this.props.playerListUtil.setPlayerList(playerList);
      var myPlayer = this.props.playerListUtil.getPlayerByGuid( this.props.myGuid );
      var myTurn = myPlayer.guid == gameState.currentPlayerGuid;

      // If the player's combined score totals over 500 and they have a green light, they win.
      if( myTurn && myPlayer.score + gameState.turnScore >= 500 && !gameState.winnerGuid ){
        if(gameState.flag.value === "green"){
          this.props.gameUtil.iWin(this.props.myGuid);
          this.props.playerListUtil.addScore(this.props.myGuid, gameState.turnScore);
        }
      }
    }
  }
});

