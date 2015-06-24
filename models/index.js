var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title: String,
  url_name: String,
  owner_id: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  status: Number,
  tags: [{
    type: String
  }]
});

var userSchema = new mongoose.Schema({
  name: {
    first: String,
    last: String
  },
  email: String
});

pageSchema.virtual("full_route").get(function() {
  return "/wiki/" + this.url_name;
})

pageSchema.virtual("full_route").set(function(full_route) {
  this.url_name = full_route.replace("/wiki/", "");
})

pageSchema.path('tags').set(function(tagsString) {
  return tagsString.split(',').map(function(tag) {
    return tag.trim()
  })
})

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};