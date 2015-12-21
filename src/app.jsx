var gameUtil = require('./util/game');
var db = require('./util/db');
console.log('calling init');
/*if(!gunUtil.init( Gun )){
  console.log('ERROR! Gun failed to initialize!');
}else*/ {
  gameUtil.init(db);

  console.log('loading complete');

  var React = require('react');
  var ReactFire = require('reactfire');
  var Firebase = require('firebase');
  var rootUrl = "https://rotl.firebaseio.com/";
  var playerDB = new Firebase(rootUrl + 'players/');

  var Header = require('./modules/header');
  var Game = require('./modules/game');
  var LoginForm = require('./modules/loginForm');

  var diceCup = require('./util/dice');
  var fbUtil = require('./util/firebase');

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
      this.bindAsObject(this.playerDB, 'players');

    },
    render: function () {
      console.log('playerlist', this.state);
      var playerList = (this.state && this.state.playerList) ? this.state.playerList : {};
      //console.log(diceCup.roll(diceCup.trackDie, 5));
      //console.log(diceCup.roll(diceCup.crashDie));
      if (gameUtil.name) {
        return <div className="container-fluid">
          <Header />
          <Game playerList={playerList}/>
        </div>
      } else {
        return <div className="container-fluid">
          <Header />
          <LoginForm />
        </div>
      }
    }
  });

  var element = React.createElement(App, {});
  React.render(element, document.body);
}
