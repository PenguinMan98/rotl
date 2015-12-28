// set up my game stuff
var gameUtil = require('./util/game');
gameUtil.init();

// start the app
var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = "https://rotl.firebaseio.com/";
var playerDB = new Firebase(rootUrl + 'players/');
var chatDB = new Firebase(rootUrl + 'chat/');

// set up the browser player
var player = require('./util/player');
var myPlayer = Object.create(player);
myPlayer.init( Firebase );

// get display modules
var Header = require('./modules/header');
var Game = require('./modules/game');
var PlayerNameForm = require('./modules/playerNameForm');
var Chat = require('./modules/chat');
var ChatForm = require('./modules/chatForm');

// get game utilities
var diceCup = require('./util/dice');

// rock n roll
var App = React.createClass({
  mixins: [ReactFire],
  getInitialState: function () {
    // start like this
    return {
      playerList: {},
      chatLog: {}
    }
  },
  componentWillMount: function () {
    // do this when you load
    this.playerDB = playerDB;
    this.bindAsObject(this.playerDB, 'playerList');

    this.chatDB = chatDB;
    //this.bindAsObject(this.chatDB, 'chatLog');

    var chatLog = (this.chatLog) ? this.chatLog : [];

    // query the database for records ordered by timestamp (when)
    var query = chatDB.orderByChild("when").limitToLast(gameUtil.messagesInChat);
    query.on("child_added", function(messageSnapshot) {
      // This will be called as messages get added
      chatLog.push(messageSnapshot.val());
      this.setState({
        chatLog: chatLog
      });
    }.bind(this));
    query.on("child_removed", function(messageSnapshot) {
      // This will be called as messages get removed
      chatLog.shift();
      this.setState({
        chatLog: chatLog
      });
    }.bind(this));
  },
  render: function () {
    var playerList = (this.state && this.state.playerList) ? this.state.playerList : {};
    var chatLog = (this.state && this.state.chatLog) ? this.state.chatLog : {};

    //console.log(diceCup.roll(diceCup.trackDie, 5));
    //console.log(diceCup.roll(diceCup.crashDie));
    if (myPlayer.name.indexOf('Player-') !== 0) {
      return <div className="container-fluid">
        <Header />
        <Game playerList={playerList} myPlayer={myPlayer} />
        <hr />
        <Chat chatLog={chatLog} myPlayer={myPlayer} playerList={playerList} />
        <ChatForm myPlayer={myPlayer} chatStore={this.chatDB} />
      </div>
    } else {
      return <div className="container-fluid">
        <Header />
        <PlayerNameForm player={myPlayer} />
      </div>
    }
  }
});

var element = React.createElement(App, {});
React.render(element, document.body);

