module.exports = {
  HTML:function(title, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <link rel = "stylesheet" type = "text/css" href = "/css/style.css">
      <meta charset="utf-8">
    </head>
    <body>
    <header>
    <div id ='logo'>
      Murakami
    </div>
    <nav id = 'menus'>
      <ul id = 'main_menu'>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    </header>
    <section id = 'main_img'>
      <img src = "/images/background.jpg">
    </section>
    <section id = 'contents'>
      ${body}
    </section>
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/about/${filelist[i]}">${filelist[i]} </a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },HTML2:function(title, list, create, update, control, body,authStatusUI = '<a href="/about/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <link rel = "stylesheet" type = "text/css" href = "/css/style1.css">
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
    <header>
    <div id ='logo'>
      Murakami
    </div>
    <nav id = 'menus'>
      <ul id = 'main_menu'>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    </header>
    <section id = 'main_img'>
      <img src = "/images/background.jpg">
    </section>
    <section id = 'contents'>
    <nav id = 'sub_menu'>
      <h3> favorite List |  ${create}${update}</h3>
      <ul>
      ${list}
      </ul>
      </nav>
      <div id = 'main_contents'>
      <div id = "login">
      ${authStatusUI}
      </div>
      ${body}
      <span style = "float:right">
      ${control}
      </span>
      </div>
      </section>
    </body>
    </html>
    `
  }
}
