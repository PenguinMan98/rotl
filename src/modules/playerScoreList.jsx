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
    return <div className="row">
      {this.content()}
    </div>
  },
  content: function(){
    //console.log('psl playerList', this.props.playerList);
    if(this.props.playerList && Object.keys(this.props.playerList).length === 0){
      return <h4>Loading Game... Please wait.</h4>;
    }else{
      var children = [];
      var player;
      for(var key in this.props.playerList){
        player = this.props.playerList[key];
        //console.log('rendering psl', player);
        if( player && typeof player === 'object' && player.name && (player.joinedGame === true || player.joinedGame === "true") ){
          children.push(
            <PlayerScore id={player.id} name={player.name} score={player.score} />
          );
        }
      }
      return children;
    }
  }
});
