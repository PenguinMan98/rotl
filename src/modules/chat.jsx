var React = require('react');
var ChatPane = require('./chatPane');
var PlayerPane = require('./playerPane');

module.exports = React.createClass({
  render: function(){
    return <div className="chat-outer row">
      <ChatPane chatLog={this.props.chatLog} />
      <PlayerPane playerList={this.props.playerList} />
    </div>
  }
});

