var React = require('react');
var ReactFire = require('reactfire');
var PlayerScoreList = require('./playerScoreList');
var GamePane = require('./gamePane');

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function(){
    return {
      playerList: {},
      myPlayer: {},
      loggedIn: false,
      myTurn: false,
      gameState: {}
    };
  },
  componentWillMount: function() {
    this.bindAsObject(this.props.myPlayer.playerDB, 'myPlayer');
    this.props.myPlayer.playerDB.on('value', this.receiveMyPlayer );

    this.bindAsObject(this.props.myPlayer.playerListDB, 'playerList');
    this.props.myPlayer.playerListDB.on('value', this.receivePlayerList );

    this.bindAsObject(this.props.DB.game, 'gameState');
    this.props.DB.game.on('value', this.receiveGameState );
  },
  render: function(){
    //console.log( 'game players', this.props.playerList );
    //console.log( 'my player', this.props.myPlayer );
    //console.log('showGame', this.props.myPlayer.showGame);
    // is it my turn?
    var myTurn = (this.state) ? this.state.myTurn : false;

    if( Boolean(this.props.myPlayer.showGame) ){  // show: true
      if( Boolean(this.props.myPlayer.joinedGame) ){ // I've joined the game
        //console.log('show me the game!');
        return <div className="game-outer">
          <PlayerScoreList playerList={this.props.playerList} DB={this.props.DB} />
          <GamePane mode="player" myTurn={myTurn} gameUtil={this.props.gameUtil} />
        </div>
      }else{ // I'm a spectator
        //console.log('spectator mode');
        return <div className="game-outer">
          <PlayerScoreList playerList={this.props.playerList} DB={this.props.DB} />
          <GamePane mode="spectator" gameUtil={this.props.gameUtil} />
        </div>
      }
    }else{ // show: false
      if( Boolean(this.props.myPlayer.joinedGame) ){ // Then I've joined the game but I'm not ready; join: true
        return <div className="game-outer">
          <div className="game-inner row">
            <input
              type="button"
              className="col-md-offset-4 col-md-4"
              value="Ready to start!"
              onClick={this.handleReady}
            /><span> (Joined in Position: {this.state.myPlayer.turnOrder})</span>
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
  handleReady: function(){
    if(this.props.gameUtil.gameStarted){ // if the game has already started, this is not allowed
      return false;
    }
    var myPlayer = this.props.myPlayer;
    myPlayer.setReady(true);

  },
  getMyPosition: function(){
    var position = this.countGamePlayers() + 1;
    return position;
  },
  handleJoinGame: function(){
    var myPlayer = this.props.myPlayer;
    var myPosition = this.getMyPosition();

    myPlayer.joinGame( true, myPosition );
  },
  handleSpectateGame: function(){
    this.props.myPlayer.joinGame( false );
  },
  receiveMyPlayer: function( snapshot ){
    console.log('game module got my player', snapshot.val());

    // I shouldn't get this event until the player has submitted their own in-game name.
    this.setState({
      loggedIn: true,
      myPlayer: snapshot.val()
    });
  },
  receivePlayerList: function( snapshot ){
    console.log('game module got playerList', snapshot.val());
    this.setState({
      playerList: snapshot.val()
    });

    if(this.state && this.state.gameState){
      console.log("I have a playerlist and a gamestate. Let's see if we are ready to start the game");
      var countPlayers = this.countGamePlayers();

      console.log('count players', countPlayers);
      console.log('ready players', this.countReadyGamePlayers());
      console.log('game state', this.state.gameState);
      if(countPlayers >= 2 && countPlayers == this.countReadyGamePlayers() && this.state.gameState.gameStarted === false){
        console.log("We can start the game!");
        if(this.state.myPlayer.turnOrder == 1){
          console.log("The game is starting and I go first!");
          this.props.gameUtil.startGame( this.state.playerList );
        }
      }else{
        console.log("We can't start the game. :(");
      }
    }
  },
  receiveGameState: function( snapshot ){
    console.log('game module got game state', snapshot.val());
    this.setState({
      chatState: snapshot.val()
    });
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
  }
});

