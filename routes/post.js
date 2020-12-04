const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const postEmpathyController = require('../controllers/postEmpathy');
const commentController = require('../controllers/comment');

router.get('/', postController.getPosts);
router.get('/:pid', postController.getPost);
router.post('/', postController.uploadPost);
router.put('/:pid', postController.updatePost);
router.delete('/:pid', postController.deletePost);

router.post('/:pid/empathy', postEmpathyController.createEmpathy);
router.delete('/:pid/empathy/:uid', postEmpathyController.deleteEmpathy);

router.get('/:pid/comments', commentController.getCommentsByPid);
router.get('/:pid/comments/:cid', commentController.getComment);
router.post('/:pid/comments', commentController.uploadComment);
router.put('/:pid/comments/:cid', commentController.updateComment);
router.delete('/:pid/comments/:cid/:uid', commentController.deleteComment);


module.exports = router;
