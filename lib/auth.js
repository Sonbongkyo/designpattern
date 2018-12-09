module.exports = {
  isOwner:function(request, response) {
    if(request.session.is_logined){
      return true;
    } else {
      return false;
    }
  },
  statusUI:function(request, response){
    var authStatusUI = '<a href="/about/login">login</a>'
    if(this.isOwner(request, response)){
      authStatusUI = `${request.session.nickname} | <a href="/about/logout">logout</a>`;
    }
    return authStatusUI;
  }
}
