var DiceCup = require('../util/dice');

module.exports = {
  player: {},

  // dice
  power: {
    thrownYet: false,
    value: "--",
    type: "power",
    locked: false
  },
  track1: {
    thrownYet: false,
    value: "--",
    type: "track",
    locked: false
  },
  track2: {
    thrownYet: false,
    value: "--",
    type: "track",
    locked: false
  },
  track3: {
    thrownYet: false,
    value: "--",
    type: "track",
    locked: false
  },
  track4: {
    thrownYet: false,
    value: "--",
    type: "track",
    locked: false
  },
  track5: {
    thrownYet: false,
    value: "--",
    type: "track",
    locked: false
  },
  flag: {
    thrownYet: false,
    value: "--",
    type: "flag",
    locked: false
  },
  pit: {
    thrownYet: false,
    value: "--",
    type: "pit",
    locked: true
  },
  crash: {
    thrownYet: false,
    value: "--",
    type: "crash",
    locked: true
  },

  // score
  thisThrow: 0,
  thisTurn: 0,

  // throw
  throwNumber: 0,

  allDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag', 'pit', 'crash'],
  commonDieArray: ['power', 'track1', 'track2', 'track3', 'track4', 'track5', 'flag'],

  // configuration
  messagesInChat: 10,

  init: function( ){

  },
  newTurn: function( player ){
    if( typeof this.player == "object" && this.player.updateScore ){
      this.player.updateScore(this.thisTurn);
    }
    this.player = player;
    this.thisThrow = 0;
    this.thisTurn = 0;

    var die;
    for(var id in this.allDieArray){
      die = this[this.allDieArray[id]];
      die.value = '--';
      die.locked = (id === "crash" || id === "pit");
      die.thrownYet = false;
    }
  },
  newThrow(){
    this.thisTurn += this.throw;
    this.thisThrow = 0;
    this.throwNumber += 1;

    var die;
    for(var id in this.commonDieArray){
      die = this[this.commonDieArray[id]];
      if(!die.locked){
        die.value = DiceCup.roll(die.type);
      }
    }

    this.calculateThrowTotal();
  },
  calculateThrowTotal: function(){
    console.log('calculate my throw total');
  },
  getRoll( id ){
    if(this[id]){
      return this[id].value;
    }
    return false;
  },
  getDie( id ){
    if(this[id]){
      return this[id];
    }
    return false;
  }
};
