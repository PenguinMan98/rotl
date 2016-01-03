var React = require('react');
var PlayerScoreList = require('./playerScoreList');
var GamePane = require('./gamePane');

module.exports = React.createClass({
  render: function(){
    //console.log( 'game players', this.props.playerList );
    console.log('showGame', this.props.myPlayer.showGame);
    if( Boolean(this.props.myPlayer.showGame) ){  // show: true
      if( Boolean(this.props.myPlayer.joinedGame) ){ // I've joined the game
        console.log('show me the game!');
        return <div className="game-outer">
          <PlayerScoreList playerList={this.props.playerList} />
          <GamePane mode="player" gameUtil={this.props.gameUtil} />
        </div>
      }else{ // I'm a spectator
        console.log('spectator mode');
        return <div className="game-outer">
          <PlayerScoreList playerList={this.props.playerList} />
          <GamePane mode="spectator" gameUtil={this.props.gameUtil} />
        </div>
      }
    }else{ // show: false
      if( Boolean(this.props.myPlayer.joinedGame) ){ // Then I've joined the game but I"m not ready; join: true
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
        if(this.props.gameUtil.gameStarted){ // join: false, show: false, started: true
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
        }else{ // join: false, show: false, started: false
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
    var myPosition = this.getMyPosition();
    this.props.myPlayer.setTurnOrder( myPosition ); // my position is last. (You snooze, you lose)
    this.props.myPlayer.setReady(true);
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
  }
});

