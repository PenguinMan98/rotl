//var gun = Gun('https://gunjs.herokuapp.com/gun');
//var localGun = Gun();
var gunUtil = require('./util/gun');
var gameUtil = require('./util/game');
console.log('calling init');
if(!gunUtil.init( Gun )){
  console.log('ERROR! Gun failed to initialize!');
}else {
  gameUtil.init(gunUtil);

  console.log('loading complete');

  var React = require('react');
  var ReactFire = require('reactfire');
  var Firebase = require('firebase');
  var rootUrl = "https://rotl.firebaseio.com/";
  //var playerDB = new Firebase(rootUrl + 'players/');

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
      //this.playerDB = playerDB;
      //this.bindAsObject(this.playerDB, 'playerList');

      // set up a listener
      gunUtil.server.get(gunUtil.playerPath) // subscribe to the server playerList
        .live(this.updatePlayers.bind(this)); // call updatePlayers on change

      gunUtil.server.get(gunUtil.playerPath) // get the playerList
        .value(this.updatePlayers.bind(this)); // send it to the updater
    },
    updatePlayers(data){
      console.log('updating players', data);
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

/*localStorage.clear();

//var gun = Gun('https://gunjs.herokuapp.com/gun');
var gun = Gun('http://www.mlpnwrp.org:1244/gun').get('rotl/');
// this should get a pointer to the rotl/playerNames bucket in gun
var gunPlayersKey = 'rotl/playerNames';
var playerNamesDB = gun.get(gunPlayersKey);
var game = {};
game.playerNames = {};
game.guid = guid;

// subscribe to changes to my player bucket
playerNamesDB.on(function(data){
  var playerNames = {};
  for(var key in data){
    //console.log('for loop', key, data[key]);
    if( key == '_' || key == '__'){continue;}
    playerNames[key] = data[key];
  }
  game.playerNames = playerNames;
  console.log( 'playerNames changed', game.playerNames);
});

function setPlayerName( playerName ,game, gun ){
  console.log( 'setPlayerName called', playerName, game );
  var nameCollision = false;
  for( var key in game.playerNames ){
    console.log('player', game.playerNames[key]);
    if(game.playerNames[key] == playerName){
      nameCollision = true;
    }
  }

  if(!nameCollision){
    console.log('no name collision');
    game.playerNames[game.guid] = playerName;
    console.log('playerNames', game.playerNames);
    gun.put(game.playerNames).key(gunPlayersKey);
  }else{
    console.log('name collision');
  }

}

setPlayerName( 'Doofus', game, gun );

game.playerNames['guid2'] = 'blahman';
gun.put(game.playerNames).key(gunPlayersKey);

setPlayerName( 'blahman', game, gun);*/

/*
 //var gun = Gun('https://gunjs.herokuapp.com/gun');
 var gun = Gun('http://www.mlpnwrp.org:1244/gun').get('rotl/');
 // this should get a pointer to the rotl/players bucket in gun
 var playerDB = gun.get('rotl/players');

 // subscribe to changes to my player bucket
 playerDB.on(function(data){ console.log("players changed", data) });

 // create my player
 var player1 = {
 id: 'guid1',
 name: 'Player1',
 score: 0
 };

 // store my player into my playerDB bucket with a key of guid
 playerDB.put({'guid1': player1});

 // I should get an event giving me my player that changed.
 // I get the player.

 // create my player2
 var player2 = {
 id: 'guid2',
 name: 'Player2',
 score: 0
 };

 // store my player into my playerDB bucket with a key of guid
 playerDB.put({'guid2': player2});

 // I should get an event giving me the player that changed

 // create my player2
 var player3 = {
 id: 'guid3',
 name: 'Player3',
 score: 0
 };

 // store my player into my playerDB bucket indexed by guid
 playerDB.put({'guid3':player3});

 // I should get an event giving me the player that changed

 console.log('arr?',playerDB.path(''));
 playerDB.map(function(player, guid){
 console.log('final val', player, guid);
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