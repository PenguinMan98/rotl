var React = require('react');
var PlayerScore = require('./playerScore');

module.exports = React.createClass({
  mixins: [],
  getInitialState: function(){
    // start like this
    return {
      playerList: {}
    }
  },
  componentWillMount: function(){
    // do this when you load
  },
  componentWillReceiveProps: function(nextProps){
    // do this when something changes
  },
  render: function(){
    console.log('this.props in playerScoreList', this.props);
    console.log('this.state in playerScoreList', this.state);

    return <div className="row">
      {this.content()}
    </div>
  },
  content: function(){
    if(this.props.playerList && Object.keys(this.props.playerList).length === 0){
      return <h4>Loading Game... Please wait.</h4>;
    }else{
      var children = [];
      var player;
      for(var key in this.props.playerList){
        player = this.props.playerList[key];
        console.log('psl player type', typeof player, player);
        if( player && typeof player === 'object' && player.name){
          children.push(
            <PlayerScore id={player.id} name={player.name} score={player.score} />
          );
        }
      }
      return children;
    }
  }
});
