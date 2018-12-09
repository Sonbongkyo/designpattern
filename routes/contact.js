var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var path = require('path');
var fs = require('fs');
var qs = require('querystring')
var ejs = require('ejs');
var ejsLint = require('ejs-lint');
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1168111',
  database:'Board'
});

db.connect();

router.get('/', function(request,response){
  fs.readFile('list.html','utf8',function(error, data) {
    db.query('SELECT * FROM board1', function (error, results) {
      response.send(ejs.render(data, {
        data: results
      }));
    });
  });
});

router.get('/delete/:id', function(request,response) {
  db.query('DELETE FROM board1 WHERE id = ?', [request.param('id')], function(){
    response.redirect('/contact');
  });
});

router.get('/insert', function(request,response) {
  fs.readFile('insert.html', 'utf8', function(error, data) {
    response.send(data);
  });
});

router.post('/insert', function(request, response) {
  var body = request.body;
  db.query(`INSERT INTO board1 (title, description, profile, created) VALUES (?, ?, ?, NOW())`, [body.title, body.description, body.profile], function() {
    response.redirect('/contact');
  });
});

router.get('/edit/:id', function(request, response) {
  fs.readFile('edit.html', 'utf8', function(error, data) {
    db.query('SELECT * FROM board1 WHERE id = ?', [request.param('id')], function(error, result) {
      response.send(ejs.render(data, {
        data: result[0]
      }));
    });
  });
});

router.post('/edit/:id', function(request, response) {
  var body = request.body
  db.query(`UPDATE board1 SET title=?, description=?, profile=? WHERE id=?`, [body.title,body.description,body.profile,request.param('id')], function() {
    response.redirect('/contact');
  });
});

router.get('/detail/:id', function(request, response) {
  fs.readFile('detail.html', 'utf8', function (error, data) {
    db.query(`SELECT * FROM board1 WHERE id = ?`, [request.param('id')], function (error, result) {
      response.send(ejs.render(data, {
        data: result[0]
      }));
    });
  });
});

module.exports = router;
