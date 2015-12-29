var React = require('react');
var Die = require('./die');

module.exports = React.createClass({
  getInitialState: function(){
    return{
    }
  },
  componentWillMount: function(){
    // do this when you load
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
      <Die id="power" type="power" locked="false" />
      <Die id="track1" type="track" locked="false" />
      <Die id="track2" type="track" locked="false" />
      <Die id="track3" type="track" locked="false" />
      <Die id="track4" type="track" locked="false" />
      <Die id="track5" type="track" locked="false" />
      <Die id="flag" type="flag" locked="false" />
      <Die id="pit" type="pit" locked="true" />
      <Die id="crash" type="crash" locked="true" />
      <div id="turn-stats" className="col-md-2">
        Current Turn Score: ___
      </div>
    </div>
  },
  handleRoll: function(){
    console.log('roll the dice!');
  }
});
