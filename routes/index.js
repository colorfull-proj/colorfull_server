const express = require('express');

const router = express.Router();
const usersRouter = require('./users');
const postsRouter = require('./posts');


router.use('/users', usersRouter);
router.use('/posts', postsRouter);


router.get('/', function(req, res, next) {
  res.send('api');
});


module.exports = router;
