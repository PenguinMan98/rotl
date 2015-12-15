var gunUtil = require('./gun');

module.exports = {
  guid: '',
  name: '',
  lastActivity: 0,
  lastUpdate: 0,
  gun: null,
  self: this,
  makeGuid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      //s4() + '-' + s4() + s4() + s4();
    return s4() + s4() + s4();
  },
  gameUpdate: function( data, field ){
    console.log('game data changed!', data, field, this.guid );

    var player = {};
    if(!data.guid){
      this.guid = this.makeGuid();
      player.guid = this.guid;
    }else{
      this.guid = data.guid;
    }
    console.log('my guid: ', this.guid);
    if(!data.name){
      this.name = 'Player-'+this.guid;
      player.name = this.name;
    }else{
      this.name = data.name;
    }
    this.lastActivity = data.lastActivity;
    this.lastUpdate = Date.now();
    this.gun.put(player).key(gunUtil.rootPath);
  },
  init: function( gun ){
    console.log('init', gun, gunUtil);
    if(!gun){
      console.log('Error no gun!');
    }else{
      this.gun = gun;
      gun.get(gunUtil.rootPath).live(this.gameUpdate.bind(this));
      var obj = {
        lastActivity: Date.now()
      };
      console.log('setting last activity', obj);
      gun.put(obj).key(gunUtil.rootPath);
    }
  }
};
