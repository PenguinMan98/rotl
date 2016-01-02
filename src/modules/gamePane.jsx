var React = require('react');
var Die = require('./die');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      score: 0
    }
  },
  componentWillMount: function(){
    // do this when you load

    // TESTING THE GAME CORE!
    var game = this.props.gameUtil;
    game.newTurn(this.props.myPlayer);
    /*game.newThrow();
    game.toggleLock('power');
    game.toggleLock('track2');
    game.toggleLock('track4');
    game.newThrow();*/
  },
  render: function(){
    return <div className="row">
      <div id="roll-btn" className="col-md-1">
        <div id="player-turn">Player _</div>
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
        Current Turn Score: {(this.state && this.state.score)? this.state.score : 0}
      </div>
    </div>
  },
  handleRoll: function(){
    console.log('roll the dice!');
    var gameState = this.props.gameUtil.newThrow();
    console.log('state after this throw', gameState);
    this.setState({
      turnScore: gameState.turnScore
    });
  },
  handleEndTurn: function(){
    console.log('End my turn');
    var gameState = this.props.gameUtil.endTurn();
    this.setState({
      turnScore: gameState.turnScore
    });
  },
  dice(){
    var children = [];
    var dieName;
    for(var id in this.props.gameUtil.allDieArray){
      dieName = this.props.gameUtil.allDieArray[id];
      children.push(
        <Die id={dieName} gameUtil={this.props.gameUtil} />
      )
    }
    return children;
  }
});
