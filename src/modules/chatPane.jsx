var React = require('react');

module.exports = React.createClass({
  render: function(){
    return <div className="col-md-9 chat-pane">
      <ul>
        {this.content(this.props.chatLog)}
      </ul>
    </div>
  },
  content: function( chatLog ){
    var children = [];
    var chatLine;
    var date;
    var dateInterval;

    for(var key in chatLog ){
      if(typeof chatLog[key] === 'object'){
        chatLine = chatLog[key];
        date = new Date(chatLine.when);
        dateInterval = parseInt((Date.now() - chatLine.when)/1000);
        children.push(
          <li>
            <span className="chatline-date">{date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()} </span>
            <span className="chatline-player">{chatLine.who} </span>
            <span className="chatline-message">{chatLine.what}</span>
          </li>
        );
      }
    }
    return children;
  }
});

