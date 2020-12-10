const { util, statusCode, responseMessage } = require('../modules');
const _ = require('lodash');
const Post = require('../models/post');
const User = require('../models/user');
const Empathy = require('../models/postEmpathy');
const Comment = require('../models/comment');
const ReComment = require('../models/reComment');

module.exports = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post.getPosts();
            const users = await User.getUsers();
            const empathys = await Empathy.getPostEmpathys();
            const comments = _.flatten(await Promise.all(posts.map(post => Comment.getCommentsByPid(post.pid))));
            const reComments = _.flatten(await Promise.all(comments.map(comment => ReComment.getReCommentsByCid(comment.cid))));
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_POSTS_SUCCESS, {
                posts: posts.map(post => ({
                    ...post,
                    user: users.filter(u => u.uid === post.uid)[0],
                    empathys: _(empathys).filter(empathy => empathy.pid === post.pid).map(empathy => ({
                        ...empathy,
                        user: users.filter(u => u.uid === empathy.uid)[0]
                    })).value(),
                    comments: comments.map(comment => ({
                        ...comment,
                        reComments: reComments.filter(reComment => reComment.cid === comment.cid)
                    }))
                }))
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.getPost(req.params.pid);
            if (post === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_POST));
            const users = await User.getUsers();
            const empathys = await Empathy.getPostEmpathysByPid(req.params.pid);
            const comments = await Comment.getCommentsByPid(req.params.pid);
            const reComments = _.flatten(await Promise.all(comments.map(comment => ReComment.getReCommentsByCid(comment.cid))));

            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_POST_SUCCESS, {
                post: {
                    ...post,
                    user: users.filter(u => u.uid === req.params.pid)[0],
                    empathys: empathys.map(empathy => ({
                        ...empathy,
                        user: users.filter(u => u.uid === empathy.uid)[0]
                    })),
                    comments: comments.map(comment => ({
                        ...comment,
                        reComments: reComments.filter(reComment => reComment.cid === comment.cid)
                    }))
                }
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    uploadPost: async (req, res) => {
        const { uid, title, content } = req.body;
        if (!uid || !title || !content) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            const pid = await Post.uploadPost(uid, title, content);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPLOAD_POST_SUCCESS, { pid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    updatePost: async (req, res) => {
        const pid = req.params.pid;
        const { uid, title, content } = req.body;
        if (!pid || !uid || !title || !content) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            const post = await Post.getPost(pid);
            if (post === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_POST));
            if (post.uid !== uid) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_POST));
            await Post.updatePost(pid, uid, title, content);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPDATE_POST_SUCCESS, { pid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    deletePost: async (req, res) => {
        const { pid, uid } = req.parmas;
        try {
            const post = await Post.getPost(req.params.pid);
            if (post === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_POST));
            if (post.uid !== uid) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_POST));
            const pid = await Post.deletePost(req.params.pid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_POST_SUCCESS, { pid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    }
};
