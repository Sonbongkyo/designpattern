var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var fs = require('fs');

router.get('/', function(request, response) {
    fs.readFile(`index`,'utf8',function(err,description){
      var title = 'Welcome';
      var html = template.HTML(title,
        `<h2>${title}</h2>${description}`
      );
    response.send(html);
  });
});

module.exports = router;
