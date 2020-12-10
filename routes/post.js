const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const postEmpathyController = require('../controllers/postEmpathy');
const commentController = require('../controllers/comment');
const reCommentController = require('../controllers/reComment');

const upload = require('../modules/multer');

router.get('/', postController.getPosts);
router.get('/:pid', postController.getPost);
router.post('/', postController.uploadPost);
router.put('/:pid', postController.updatePost);
router.delete('/:pid', postController.deletePost);

/** EMPATHY */
router.post('/:pid/empathy', postEmpathyController.createEmpathy);
router.delete('/:pid/empathy/:uid', postEmpathyController.deleteEmpathy);

/** COMMENT */
router.get('/:pid/comments', commentController.getCommentsByPid);
router.get('/:pid/comments/:cid', commentController.getComment);
router.post('/:pid/comments', upload.single('picture'), commentController.uploadComment);
router.put('/:pid/comments/:cid', upload.single('picture'), commentController.updateComment);
router.delete('/:pid/comments/:cid/:uid', commentController.deleteComment);

/** RECOMMENT */
router.get('/:pid/comments/:cid/recomments', reCommentController.getReCommentsByCid);
router.get('/:pid/comments/:cid/recomments/:rcid', reCommentController.getReComment);
router.post('/:pid/comments/:cid/recomments', reCommentController.uploadReComment);
router.put('/:pid/comments/:cid/recomments/:rcid', reCommentController.updateReComment);
router.delete('/:pid/comments/:cid/recomments/:rcid/:uid', reCommentController.deleteReComment);

module.exports = router;
