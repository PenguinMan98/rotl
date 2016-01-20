var React = require('react');
var ReactFire = require('reactfire');

var PlayerScore = require('./playerScore');

/*
* Player Score List
*
* Props Received:
* playerList
* DB
* */

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function(){
    // start like this
    return {
      playerList: {}
    }
  },
  componentWillMount: function(){
    // do this when you load
    this.bindAsObject(this.props.DB.player, 'playerList');
    var self = this;

    this.props.DB.player.on("value", function(snapshot) {
      self.setState({
        playerList: snapshot.val()
      });
    });
  },
  render: function(){
    return <div className="row">
      {this.content()}
    </div>
  },
  content: function(){
    //console.log('psl rendering playerList', this.state.playerList);
    if(!this.state || ( this.state.playerList && Object.keys(this.state.playerList).length === 0 ) ){
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
