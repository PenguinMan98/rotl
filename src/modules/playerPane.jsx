var React = require('react');

module.exports = React.createClass({
  render: function(){
    return <div className="col-md-3 player-pane">
      {this.content(this.props.playerList)}
    </div>
  },
  content: function( playerList ){
    var children = [];
    var player;

    for(var key in playerList ){
      if(typeof playerList[key] === 'object'){
        player = playerList[key];
        children.push(
          <li>
            <span className="playerline">{player.name}</span>
          </li>
        );
      }
    }
    return children;
  }
});

