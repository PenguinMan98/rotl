var game = require('./game');
Gun.chain.value = function(cb, opt){ return this.val(function(val, field){ delete val._; cb.call(this, val, field); }, opt); };
Gun.chain.live = function(cb, opt){ return this.on(function(val, field){ delete val._; cb.call(this, val, field); }, opt); };

module.exports = {
  server: null,
  local: null,
  rootPath: 'rotl/',
  localRootPath: 'local11/',
  playerPath: 'rotl/playerList/',
  chatPath: 'rotl/chat/',
  updatePlayers: function(){
    gun.get(this.playerPath).value(function(data, field){
      console.log('gun util update players', data, field);
      game.playerNames = data;
    });
  },
  setPlayerName( playerName ){
    console.log( 'setPlayerName called', playerName );
    var nameCollision = false;
    for( var key in game.playerNames ){
      console.log('player', game.playerNames[key]);
      if(game.playerNames[key] == playerName){
        nameCollision = true;
      }
    }

    if(!nameCollision){
      game.playerNames[game.guid] = playerName;
      gun.put(game.playerNames).key(this.playerPath);
    }else{
      console.log('name collision');
    }
  },
  init( Gun ){
    if(typeof Gun != 'function'){
      console.log('Error no gun!');
      return false;
    }

    // set my gun
    this.server = Gun('https://gunjs.herokuapp.com/gun');
    // set the local gun
    this.local = Gun();

    return true;
  }
};
