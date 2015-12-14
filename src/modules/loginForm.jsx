var React = require('react');
var game = require('../util/game');
var gun = require('../util/gun');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      playerName: "player-" + game.guid
    }
  },
  choosePlayerName: function(){
    console.log('name chosen: ', this.state.playerName);
    if(this.state.playerName){
      gun.setPlayerName(this.state.playerName);
    }else{
      console.log('bad player name')
    }
  },
  changePlayerName: function( e ){
    this.setState({
      playerName: e.target.value
    });
  },
  componentWillMount: function(){
    // do this when you load
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
