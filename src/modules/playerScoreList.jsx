var React = require('react');

var PlayerScore = require('./playerScore');


module.exports = React.createClass({
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
    this.props.playerStore;
    if(this.props.playerList && Object.keys(this.props.playerList).length === 0){
      return <h4>Loading Game... Please wait.</h4>;
    }else{
      var children = [];
      var player = null;
      for(var key in this.props.playerList){
        player = this.props.playerList[key];
        children.push(
          <PlayerScore id={player.id} name={player.name} score={player.score} />
        );
      }
      return children;
    }
  }
});
