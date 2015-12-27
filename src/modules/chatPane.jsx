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
    var date, hour, minute, second;
    var dateInterval;

    for(var key in chatLog ){
      if(typeof chatLog[key] === 'object'){
        chatLine = chatLog[key];
        date = new Date(chatLine.when);
        hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        hour = hour > 12 ? hour - 12 : hour;
        minute = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        second = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        dateInterval = parseInt((Date.now() - chatLine.when)/1000);
        children.push(
          <li>
            <span className="chatline-date">{hour+":"+minute+":"+second} </span>
            <span className="chatline-player">{chatLine.who}: </span>
            <span className="chatline-message">{chatLine.what}</span>
          </li>
        );
      }
    }
    return children;
  }
});

