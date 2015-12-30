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
    this.props.gameUtil.newTurn(this.props.myPlayer);
    this.props.gameUtil.newThrow();
  },
  render: function(){
    return <div className="row">
      <div id="roll-btn" className="col-md-1">
        <div id="player-turn">Player _</div>
        <input
          type="button"
          value="Roll"
          onClick={this.handleRoll}
        />
      </div>
      {this.dice()}
      <div id="turn-stats" className="col-md-2">
        Current Turn Score: ___
      </div>
    </div>
  },
  handleRoll: function(){
    console.log('roll the dice!');
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
