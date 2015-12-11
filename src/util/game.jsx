
module.exports = {
  makeGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },
  getGuid() {
    if( this.getCookie('guid') ){
      // I have been here before
      return this.getCookie('guid');
    }else{
      var newGuid = '';
      newGuid = this.makeGuid();
      this.setCookie('guid', newGuid);
      return newGuid;
    }
  },
  getCookie( cName ) {
    var name = cName + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  },
  setCookie(cName, cValue, exDays) {
    if( !exDays ){
      exDays = 1; // default to 24 hours
    }
    var d = new Date();
    d.setTime(d.getTime() + (exDays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires;
  }
};
