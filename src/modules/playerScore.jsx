var React = require('react');

module.exports = React.createClass({
  render: function(){

    return <div className="player-info col-md-2 text-center">
      <div>{this.props.name}</div>
      <div>{this.props.score}</div>
    </div>
  }
});
