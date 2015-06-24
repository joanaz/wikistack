var express = require('express');
var router = express.Router();
var models = require('../models/');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('add_a_page', {
    title: "ADD A PAGE",
    path: "/add/submit",
    // page: {}

  })
});

router.post('/submit', function(req, res) {
  var page = new models.Page({
    'title': req.body.title,
    'content': req.body.content,
    'url_name': convertTitleToUrl(req.body.title),
    'tags': req.body.tags.replace(/ /g, '').split(',')
  });
  page.save();
  res.redirect('/');
});

function convertTitleToUrl(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '_');
}

module.exports = router;