var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = "https://rotl.firebaseio.com/";
var playerDB = new Firebase(rootUrl + 'players/');

var Header = require('./modules/header');
var Game = require('./modules/game');
var LoginForm = require('./modules/loginForm');

var gameUtil = require('./util/game');
var diceCup = require('./util/dice');
var fbUtil = require('./util/firebase');

var guid = gameUtil.getGuid();
console.log('I have a guid', guid);

var App = React.createClass({
  mixins: [ ReactFire ],
  getInitialState: function(){
    // start like this
    return {
      playerList: {}
    }
  },
  componentWillMount: function(){
    // do this when you load
    this.playerDB = playerDB;
    this.bindAsObject(this.playerDB, 'playerList');
  },
  render: function() {
    console.log('playerlist', this.state);
    var playerList = (this.state && this.state.playerList) ? this.state.playerList : {};
    //console.log(diceCup.roll(diceCup.trackDie, 5));
    //console.log(diceCup.roll(diceCup.crashDie));
    if(fbUtil.playerLoggedIn(this.state.playerList, guid)){
      return <div className="container-fluid">
        <Header />
        <Game playerList={playerList} />
      </div>
    }else{
      return <div className="container-fluid">
        <Header />
        <LoginForm />
      </div>
    }
  }
});

var element = React.createElement(App, {});
React.render(element, document.body);

/*
var gun = Gun('https://gunjs.herokuapp.com/gun');

console.log('1');
gun.put({hello: "world"}).key('random/kZ5Ugcm9t');

var ref = gun.get('random/kZ5Ugcm9t');
ref.on(function(data){
  console.log('data',data);
});


console.log('2');
ref.path('hello').put("My Baby");
console.log('3');
ref.path('hello').put("My Honey");
console.log('4');
ref.path('hello').put("My Ragtime Gal");

ref.val(function(data){
  console.log('more data', data);
});
*/

/*console.log('Adding Player 1');
fbUtil.AddPlayer( playerDB, {
  id: 1,
  name: 'Player 1',
  score: 31} );
console.log('Adding Player 2');
fbUtil.AddPlayer( playerDB, {
  id: 2,
  name: 'Player 2',
  score: 42} );
console.log('Adding Player 3');
fbUtil.AddPlayer( playerDB, {
  id: 3,
  name: 'Player 3',
  score: 98} );
*/