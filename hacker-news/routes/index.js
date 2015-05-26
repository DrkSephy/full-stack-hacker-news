var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/* GET route for retrieving posts */
router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if(err){ return next(err); }

		res.json(posts);
	});
});

/* POST route for creating posts */
router.post('/posts', function(req, res, next){
	// Create new post object in memory before saving
	// it to the database.
	var post = new Post(req.body);

	post.save(function(err, post){
		if(err){ return next(err); }

		res.json(post);
	});
});

/* Testing our GET and POST Routes 

* First create a new post:
* curl --data 'title=test&link=http://test.com' http://localhost:3000/posts

* Second, we query the /posts route to make sure it was saved.
* curl http://localhost:3000/posts

*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
