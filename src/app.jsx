// set up my game stuff
var gameUtil = require('./util/game');
gameUtil.init();

// start the app
var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = "https://rotl.firebaseio.com/";
var playerDB = new Firebase(rootUrl + 'players/');

// set up the browser player
var player = require('./util/player');
var myPlayer = Object.create(player);
myPlayer.init( Firebase );

console.log('loading complete');

// get display modules
var Header = require('./modules/header');
var Game = require('./modules/game');
var PlayerNameForm = require('./modules/playerNameForm');

// get game utilities
var diceCup = require('./util/dice');
var fbUtil = require('./util/firebase');

// rock n roll
var App = React.createClass({
  mixins: [ReactFire],
  getInitialState: function () {
    // start like this
    return {
      playerList: {}
    }
  },
  componentWillMount: function () {
    // do this when you load
    this.playerDB = playerDB;
    this.bindAsObject(this.playerDB, 'playerList');
  },
  updatePlayers(data){
    console.log('updating players', data);
  },
  render: function () {
    console.log('app playerlist', this.state.playerList);
    var playerList = (this.state && this.state.playerList) ? this.state.playerList : {};

    //console.log(diceCup.roll(diceCup.trackDie, 5));
    //console.log(diceCup.roll(diceCup.crashDie));
    if (myPlayer.name.indexOf('Player-') !== 0) {
      return <div className="container-fluid">
        <Header />
        <Game playerList={playerList}/>
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

