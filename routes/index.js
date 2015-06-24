var express = require('express');
var router = express.Router();
var models = require('../models/');

/* GET home page. */
router.get('/', function(req, res) {
  models.Page.find(function(err, data) {
    res.render('index', {
      title: 'WIKISTACK',
      docs: data
    });
  })
});

/*

models.Page
.find()
.exec()
.then(function(pages){
  
})
.then(null,next) //error handling

*/

router.get('/about', function(req, res) {
  res.render('about_us', {
    title: "ABOUT US"
  })
})

//if just pass page to html, don't need to write {page:page}, can be just page, then change the html page.title etc to title.

router.get('/wiki/:url_name', function(req, res) {
  var url_name = req.params.url_name
  models.Page.findOne({
    'url_name': url_name
  }, function(err, page) {
    // console.log(page.tags)
    res.render('page', {
      title: page.title,
      page: page,
      date: page.date.toLocaleString(),
    })
  })
})

router.get('/wiki/:url_name/similar', function(req, res) {
  var url_name = req.params.url_name
  models.Page.findOne({
    'url_name': url_name
  }, function(err, page) {
    console.log(page)
    models.Page.find({
      tags: {
        $in: page.tags
      }
    }).exec(function(err, pages) {
      var index = pages.forEach(function(onePage, index) {
        if (onePage.url_name === url_name) {
          return index
        }
      })
      pages.splice(index, 1)
        // pages.url_name.indexOf(url_name)
      res.render('index', {
        title: "Similar pages",
        docs: pages
      })
    })
  })
})

router.get('/wiki/:url_name/edit', function(req, res) {
  var url_name = req.params.url_name
  models.Page.findOne({
    'url_name': url_name
  }, function(err, page) {
    res.render('add_a_page', {
      title: "Editing",
      path: '/wiki/' + url_name + '/edit',
      page: page
    })
  })
})

router.post('/wiki/:url_name/edit', function(req, res) {
  var url_name = req.params.url_name
  console.log(req.body)
  models.Page.update({
    'url_name': url_name
  }, {
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags.replace(/ /g, '').split(',')
  }, function(err, numAffected) {
    if (err) throw err;
    res.redirect('/wiki/' + url_name);
  })
})

router.get('/wiki/:url_name/delete', function(req, res) {
  var url_name = req.params.url_name
  models.Page.remove({
    'url_name': url_name
  }, function(err, page) {
    if (err) throw err;
    res.redirect('/')
  })
})

router.get('/tag/:tag', function(req, res) {
  var tag = req.params.tag
  models.Page.find({
    tags: {
      $in: [tag]
    }
  }).exec(function(err, pages) {
    // console.log(pages)
    res.render('index', {
      title: tag,
      docs: pages
    })
  })
})

module.exports = router;