module.exports = {
  flagDie: {
    'green': 9,
    'red': 1,
    'yellow': 1,
    'black': 1
  },
  crashDie: {
    'crash': 1,
    'crashOut': 1,
    '-10': 1,
    '-20': 1,
    '-30': 1,
    '-40': 2,
    '-50': 2,
    '-60': 1,
    '-70': 1,
    '-80': 1
  },
  powerDie: {
    'flat': 1,
    '0': 3,
    '5': 1,
    '10': 1,
    '15': 1,
    '20': 1,
    '25': 1,
    '30': 1,
    '40': 1,
    '50': 1
  },
  trackDie: {
    '0': 3,
    '5': 2,
    '10': 2,
    '15': 2,
    '20': 2,
    '25': 1
  },
  pitDie: {
    'caution': 1,
    '0': 4,
    '-10': 4,
    '-20': 2,
    '-30': 1
  },
  roll: function(die, qty){
    if(typeof die != 'object' && typeof die != 'string'){
      return false;
    }
    if(typeof die == 'string' && this[die + "Die"]){
      die = this[die + "Die"];
    }
    if(typeof qty === 'undefined'){
      qty = 1;
    }

    var dieArr = [];
    var resultArr = [];
    for(; qty > 0; qty--){
      for( var face in die ){
        for(var i = 0; i < die[face]; i++){
          dieArr.push(face);
        }
      }
      resultArr.push(dieArr[parseInt(dieArr.length * Math.random())]);
    }
    if(qty > 1)
      return resultArr;
    return resultArr[0];
  },
  validate( type, roll ){
    var dieName = type + 'Die';
    return typeof this[dieName][roll] !== "undefined";
  }
};
