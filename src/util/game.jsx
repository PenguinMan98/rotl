var gunUtil = require('./gun');
console.log('loading game util. Gun: ', gun);

module.exports = {
  guid: '',
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
  setGuid: function() {
    gun.get(gunUtil.rootPath).value(function(data,field){
      this.guid = data.guid ? data.guid : this.makeGuid();
      console.log('I have a guid', this.guid);
    })
  }
};
