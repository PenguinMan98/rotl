var React = require('react');
var PlayerScoreList = require('./playerScoreList');
var GamePane = require('./gamePane');

module.exports = React.createClass({
  render: function(){
    console.log( 'game players', this.props.playerList );
    if( this.props.myPlayer.joinedGame === true || this.props.myPlayer.joinedGame === "true" ){ // If the player has joined the game
      return <div className="game-outer">
        <PlayerScoreList playerList={this.props.playerList} />
        <GamePane />
      </div>
    }else{ // If the player has not joined the game
      return <div className="game-outer">
        <PlayerScoreList playerList={this.props.playerList} />
        <div className="game-inner row">
          <input
            type="button"
            className="col-md-offset-3 col-md-6"
            value="Join Game"
            onClick={this.handleJoinGame}
          />
        </div>
      </div>
    }
  },
  handleJoinGame: function(){
    this.props.myPlayer.joinGame( true );
  }
});

