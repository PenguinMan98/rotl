var React = require('react');
var gameUtil = require('../util/game');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      playerName: ""
    }
  },
  choosePlayerName: function(){
    console.log('name chosen: ', this.state.playerName);
  },
  changePlayerName: function( e ){
    this.setState({
      playerName: e.target.value
    });
  },
  render: function(){
    return <div className="col-md-offset-2 col-md-8">
      <h2>Please choose a Player Name:</h2>
      <input
        value={this.state.playerName}
        onChange={this.changePlayerName}
        type="input"
        className="form-control input-group"
      />
      <button
        onClick={this.choosePlayerName}
        className="btn btn-default"
      >Enter Game</button>
    </div>
  }
});
