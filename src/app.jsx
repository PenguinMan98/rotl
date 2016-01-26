// start the app
var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = "https://rotl.firebaseio.com/";
var DB = {
  player: new Firebase(rootUrl + 'players/'),
  chat: new Firebase(rootUrl + 'chat/'),
  game: new Firebase(rootUrl + 'game/')
};

// set up the browser player
var myPlayer = require('./util/player');
myPlayer.init( );

// set up my game stuff
var gameUtil = require('./util/game');
gameUtil.init( DB.game, myPlayer.guid );

// set up the game-player interface
var playerListUtil = require('./util/playerList');
playerListUtil.init( DB.player, myPlayer.guid );

// get display modules
var Header = require('./modules/header');
var Game = require('./modules/game');
var PlayerNameForm = require('./modules/playerNameForm');
var Chat = require('./modules/chat');
var ChatForm = require('./modules/chatForm');

// get game utilities
var diceCup = require('./util/dice');

// rock n roll

/*
* App!
* Holds the whole app together
* Updates when the chat updates currently (todo: fix this)
* */
var App = React.createClass({
  mixins: [ReactFire],
  getInitialState: function () {
    // start like this
    return {
      playerList: {},
      chatLog: []
    }
  },
  componentWillMount: function () {
    // do this when you load
    this.playerDB = DB.player;
    this.bindAsObject(DB.player, 'playerList');

    // holds a copy of the chatlog from the state
    var chatLog = (this.state && this.state.chatLog) ? this.state.chatLog : [];

    //this.chatDB = chatDB;
    // query the database for records ordered by timestamp (when)
    var query = DB.chat.orderByChild("when").limitToLast(gameUtil.messagesInChat);
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

    if(playerList['.key']){ // this is a nuisance. I wonder if this is my fault.
      delete playerList['.key'];
      delete playerList['.value'];
    }

    //console.log('app players', playerList);

    //console.log(diceCup.roll(diceCup.trackDie, 5));
    //console.log(diceCup.roll(diceCup.crashDie));
    if (myPlayer.name.indexOf('Player-') !== 0) {
      return <div className="container-fluid">
        <Header />
        <Game
          gameUtil={gameUtil}
          playerListUtil={playerListUtil}
          DB={DB}
          myGuid={myPlayer.guid}
          myPlayer={myPlayer}
        />
        <hr />
        <Chat chatLog={chatLog} myPlayer={myPlayer} playerList={playerList} />
        <ChatForm myPlayer={myPlayer} chatStore={DB.chat} />
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

