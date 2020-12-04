const { util, statusCode, responseMessage } = require('../modules');
const _ = require('lodash');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = {
    getComment: async (req, res) => {
        try {
            const comment = await Comment.getComment(req.params.cid);
            if (comment === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_COMMENT));
            const user = await User.getUser(comment.uid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_COMMENT_SUCCESS, {
                comment: {
                    ...comment,
                    user
                }
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    getCommentsByPid: async (req, res) => {
        try {
            const comments = await Comment.getCommentsByPid(req.params.pid);
            const users = await User.getUsers();
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_COMMENTS_SUCCESS, {
                comments: comments.map(comment => ({
                    ...comment,
                    user: users.filter(user => user.uid === comment.uid)
                }))
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    uploadComment: async (req, res) => {
        const { pid } = req.params;
        const { uid, content, pictureURL } = req.body;
        if (!pid || !uid) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            if (!await Post.checkPost(pid)) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_COMMENT));
            const cid = await Comment.uploadComment(pid, uid, content, pictureURL);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPLOAD_COMMENTS_SUCCESS, { cid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    updateComment: async (req, res) => {
        const { pid, cid } = req.params;
        const { uid, content, pictureURL } = req.body;
        if (!cid || !pid || !uid) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            const comment = await Comment.getComment(cid);
            if (comment === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_COMMENT));
            if (comment.uid !== uid) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_COMMENT));
            await Comment.updateComment(cid, content, pictureURL);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPDATE_COMMENT_SUCCESS, { cid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    deleteComment: async (req, res) => {
        const { pid, cid, uid } = req.params;
        try {
            const comment = await Comment.getComment(cid);
            if (comment === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_COMMENT));
            if (comment.uid !== uid) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_COMMENT));
            await Comment.deleteComment(cid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_COMMENT_SUCCESS));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    }
};
