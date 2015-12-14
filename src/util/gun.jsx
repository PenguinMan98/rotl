var game = require('./game');
Gun.chain.value = function(cb, opt){ return this.val(function(val, field){ delete val._; cb.call(this, val, field); }, opt); };
Gun.chain.live = function(cb, opt){ return this.on(function(val, field){ delete val._; cb.call(this, val, field); }, opt); };

module.exports = {
  db: function(){
    if(!this.gunDB) {
      this.gunDB = Gun('https://gunjs.herokuapp.com/gun');
    }
    return this.gunDB;
  },
  gunDB: null,
  rootPath: 'rotl/',
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
  }
};
