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


/* This route will preload a post object if it contains an ID */
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function (err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error('can\'t find post')); }

		req.post = post;
		return next();
	});
});

/* Route for getting a single post */
// NOTE: Since the post object was retrieved using the
// middleware function above and attached to the req object,
// the request handler simply has to return the JSON back
// to the client. 

// NOTE: This route will use the populate() function to retrieve all comments
// associated with a specific post. 
router.get('/posts/:post', function(req, res, next){
	req.post.populate('comments', function(err, post){
		if(err){ return next(err); }
		res.json(post);
	});
});

/* Route for upvoting a single post */
router.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});

/* Testing the upvote route 

* 1. Create a post:
*     curl --data 'title=test&link=http://test.com' http://localhost:3000/posts
*     -> {"__v":0,"title":"test","link":"http://test.com","_id":"55648645002f632006801e7f","comments":[],"upvotes":0}
* 2. Make sure it was saved:
*     curl http://localhost:3000/posts
*     -> [{"_id":"556483c4a31a022a037e323d","title":"test","link":"http://test.com","__v":0,"comments":[],"upvotes":0},{"_id":"55648645002f632006801e7f","title":"test","link":"http://test.com","__v":0,"comments":[],"upvotes":0}]
* 3. Upvote it by passing in the _ID 
*     curl -X PUT http://localhost:3000/posts/556483c4a31a022a037e323d/upvote
*     -> {"_id":"556483c4a31a022a037e323d","title":"test","link":"http://test.com","__v":0,"comments":[],"upvotes":1}


/* Comments route for a particular post */
router.post('/posts/:post/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if(err){ return next(err); }
		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err){ return next(err); }

			res.json(comment);
		});	
	});
});

/* Middleware route for pre-loading comments */
router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err){ return next(err); }
		if(!comment){ return next(new Error('Cannot find comment')); }
		
		req.comment = comment;
		return next();
	});
});

/* Route for upvoting a comment */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
	req.comment.upvote(function(err, comment){
		if(err){ return next(err); }

		res.json(comment);
	});
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
