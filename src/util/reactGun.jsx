var gun = require('./gun');

module.exports = {
  bindPlayerList: function( obj ){
    gun.playerList.live(function(data){
      var update = {};
      update[obj] = data;
      this.setState(update);
    });
  }
};