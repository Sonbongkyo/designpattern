var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth');

var authData = {
  email:'kkk@gmail.com',
  password:'111111',
  nickname:'bonggyo'
}

router.get('/', function(request,response){
  fs.readFile(`about`,'utf8',function(err, description){
    var title = 'About';
    var list = template.list(request.list);
    var html = template.HTML2(title, list, `<a href="/about/create">+</a>`,` `,
      ` `,
     `<h2>About</h2>${description}`,auth.statusUI(request, response)
    );
    response.send(html);
  });
 });

router.get('/login', function(request, response){
     var title = 'Login';
     var html = template.HTML2(title,` `,` `,` `,` `,` `,`
       <form style = "padding:5px;" action = "login_process" method = "post">
       <p><input style = "margin: 0 0 10px 0;" type = "text" name ="email" placeholder="email"></p>
       <p><input style = "margin: 0 0 10px 0;"type = "password" name = "pwd" placeholder = "password"</p>
       <p><input type = "submit" value = "login"></p>
       </form>
       `);
       response.send(html);
 });

router.post('/login_process', function(request, response) {
   var post = request.body;
   var email = post.email;
   var password = post.pwd;
   if(email === authData.email && password === authData.password){
     request.session.is_logined = true;
     request.session.nickname = authData.nickname;
     request.session.save(function(){
      response.redirect(`/about`);
     });
   } else {
     response.send('who?');
   }
 });

router.get('/logout', function(request, response) {
   request.session.destroy(function(err){
     response.redirect('/about');
   });
 });

 router.get('/create', function(request, response){
   if(!auth.isOwner(request, response)){
     response.redirect('/about');
     return false;
   }
     var title = 'WEB - create';
     var list = template.list(request.list);
     var html = template.HTML2(title, list, ` `,` `,` `,`
       <form action="/about/create_process" method="post">
         <p>
         <label>TITLE : <input type="text" name="title" placeholder="title"><label>
         </p>
         <p>
           <label>DESCRIPTION : <textarea name="description" placeholder="description"></textarea><label>
         </p>
         <p>
           <input type="submit">
         </p>
       </form>
     `,auth.statusUI(request, response));
     response.send(html);
 });

 router.post('/create_process', function(request, response){
      if(!auth.isOwner(request, response)){
        response.redirect('/about');
        return false;
      }
       var post = request.body;
       var title = post.title;
       var description = post.description;
       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
         response.redirect(`/about/${title}`);
     });
 });

router.get('/update/:pageId', function(request,response){
  if(!auth.isOwner(request, response)){
    response.redirect('/about');
    return false;
  }
   var filteredId = path.parse(request.params.pageId).base;
   fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
     var title = request.params.pageId;
     var list = template.list(request.list);
     var html = template.HTML2(title, list, ` `,
       ` `,` `,`
       <form action="/about/update_process" method="post">
         <input type="hidden" name="id" value="${title}">
         <p>
          <label>TITLE : <input type="text" name="title" placeholder="title" value="${title}"><label>
         </p>
         <p>
           <label> DESCRIPTION : <textarea name="description" placeholder="description">${description}</textarea><label>
         </p>
         <p>
           <input type="submit">
         </p>
       </form>
       `,auth.statusUI(request, response)
     );
     response.send(html);
   });
});

router.post('/update_process', function(request, response){
  if(!auth.isOwner(request, response)){
    response.redirect('/about');
    return false;
  }
     var post = request.body;
     var id = post.id;
     var title = post.title;
     var description = post.description;
     fs.rename(`data/${id}`, `data/${title}`, function(error){
       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
         response.redirect(`/about/${title}`);
       })
    });
 });


router.post('/delete_process', function(request, response) {
  if(!auth.isOwner(request, response)){
    response.redirect('/about');
    return false;
  }
       var post = request.body;
       var id = post.id;
       var filteredId = path.parse(id).base;
       fs.unlink(`data/${filteredId}`, function(error){
         response.redirect('/about');
   });
});

router.get('/:pageId', function(request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
      if(err){
        next(err);
      } else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML2(sanitizedTitle, list,` `,`
          <a href="/about/update/${title}"> *</a>
          `,
          `<form action="/about/delete_process" method="post">
           <input type="hidden" name="id" value="${title}">
           <input type="submit" value="delete"></br>
           </form>
           `,
           `<h2>${sanitizedTitle}</h2>${sanitizedDescription}<hr />`,auth.statusUI(request, response)
         );
         response.send(html);
      }
  });
});


module.exports = router;
