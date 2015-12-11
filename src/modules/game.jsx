var React = require('react');
var PlayerScoreList = require('./playerScoreList');

module.exports = React.createClass({
  render: function(){
    return <div className="game-outer">
      <PlayerScoreList playerList={this.props.playerList} />
    </div>
  }
});

