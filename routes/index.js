const express = require('express');

const router = express.Router();
const usersRouter = require('./user');
const postsRouter = require('./post');


router.use('/users', usersRouter);
router.use('/posts', postsRouter);


router.get('/', function(req, res, next) {
  res.send('colorfull api');
});


module.exports = router;
