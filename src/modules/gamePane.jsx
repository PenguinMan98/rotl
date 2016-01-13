var React = require('react');
var Die = require('./die');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      gameState: {}
    }
  },
  componentWillMount: function(){
    // do this when you load
    var game = this.props.gameUtil;
    game.gameDB.on("value", this.updateGameState);
  },
  render: function(){
    return <div className="row">
      <div id="roll-btn" className="col-md-1">
        <div id="player-turn">Player {this.props.gameUtil.currentPlayerGuid}</div>
        <input
          type="button"
          value="Roll"
          onClick={this.handleRoll}
        /><br />
        <input
          type="button"
          value="Stop"
          onClick={this.handleEndTurn}
        />
      </div>
      {this.dice()}
      <div id="turn-stats" className="col-md-2">
        Current Turn Score: {(this.state && this.state.gameState)? this.state.gameState.turnScore : 0}
      </div>
    </div>
  },
  handleRoll: function(){
    console.log('roll the dice!');
    this.props.gameUtil.newThrow();
  },
  handleEndTurn: function(){
    console.log('End my turn');
    this.props.gameUtil.endTurn();
  },
  dice(){
    var children = [];
    var dieName;
    for(var id in this.props.gameUtil.allDieArray){
      dieName = this.props.gameUtil.allDieArray[id];

      var die = this.props.gameUtil.getDie(dieName);
      if(this.state.gameState && this.state.gameState[dieName]){
        die = this.state.gameState[dieName];
      }

      children.push(
        <Die id={dieName} die={die} gameUtil={this.props.gameUtil} />
      )
    }
    return children;
  },
  updateGameState( gameState ){
    console.log('gamePane got a game update', gameState.val());
    this.setState({
      gameState: gameState.val()
    });
  }
});
