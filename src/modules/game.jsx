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
    console.log( 'game players', this.props.playerList );
    console.log( 'my player', this.props.myPlayer );
    console.log('showGame', this.props.myPlayer.showGame);
    if( Boolean(this.props.myPlayer.showGame) ){  // show: true
      if( Boolean(this.props.myPlayer.joinedGame) ){ // I've joined the game
        //console.log('show me the game!');
        return <div className="game-outer">
          <PlayerScoreList playerList={this.props.playerList} DB={this.props.DB} />
          <GamePane mode="player" gameUtil={this.props.gameUtil} />
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
            /> (Position: {this.getMyPosition()})
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
    var myPosition = this.getMyPosition();

    var myPlayer = this.props.myPlayer;
    myPlayer.setTurnOrder( myPosition ); // my position is last. (You snooze, you lose)
    myPlayer.setReady(true);

    if(this.state && this.state.gameState && this.state.playerList){
      console.log("Ready method has gameState", this.state.gameState);
      var myTurn = this.props.gameUtil.myTurnCheck(this.state.playerList);
      console.log("Is it my turn?", myTurn ? 'yes':'no');

      // should I start the game?
      var startGame = this.props.gameUtil.startGameCheck(this.state.playerList);
      console.log("Should I start the game?", startGame ? 'yes':'no');
    }
    // check to see if I'm first player
    if(myPosition == 1){

      // check to see if the game should start if I am
      //var newGameState = this.props.gameUtil.myTurnCheck();

    }

  },
  getMyPosition: function(){
    var playerCount = 0;
    var player;
    for(var guid in this.props.playerList){
      player = this.props.playerList[guid];
      console.log('getting position', player);
      if( Boolean(player.ready) ){//firebase returns strings
        playerCount += 1; // count up the current players
      }
    }
    return playerCount + 1;
  },
  handleJoinGame: function(){
    this.props.myPlayer.joinGame( true );
    var playerCount = 0;
    var player;
    for(var guid in this.props.playerList){
      player = this.props.playerList[guid];
      if(player.joinedGame === "true"){//firebase returns strings
        playerCount += 1; // count up the current players
      }
    }
    this.props.myPlayer.setTurnOrder( playerCount + 1 ); // my position is last. (You snooze, you lose)
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
  },
  receiveGameState: function( snapshot ){
    console.log('game module got game state', snapshot.val());
    this.setState({
      chatState: snapshot.val()
    });
  }
});

