const { util, statusCode, responseMessage } = require('../modules');
const _ = require('lodash');
const User = require('../models/user');
const Comment = require('../models/comment');
const ReComment = require('../models/reComment');

module.exports = {
    getReComment: async (req, res) => {
        try {
            const reComment = await ReComment.getReComment(req.params.rcid);
            if (reComment === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_RECOMMENT));
            const user = await User.getUser(reComment.uid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_RECOMMENT_SUCCESS, {
                reComment: {
                    ...reComment,
                    user
                }
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    getReCommentsByCid: async (req, res) => {
        try {
            const reComments = await ReComment.getReCommentsByCid(req.params.cid);
            const users = await User.getUsers();
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_RECOMMENTS_SUCCESS, {
                reComments: reComments.map(reComment => ({
                    ...reComment,
                    user: users.filter(user => user.uid === reComment.uid)
                }))
            }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    uploadReComment: async (req, res) => {
        const { cid } = req.params;
        const { uid, content } = req.body;
        if (!cid || !uid || !content) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            if (!await Comment.checkComment(cid)) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_COMMENT));
            const rcid = await ReComment.uploadReComment(cid, uid, content);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPLOAD_RECOMMENTS_SUCCESS, { rcid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    updateReComment: async (req, res) => {
        const { cid, rcid } = req.params;
        const { uid, content } = req.body;
        if (!cid || !rcid || !uid) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        try {
            const reComment = await ReComment.getReComment(rcid);
            if (reComment === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_RECOMMENT));
            if (reComment.uid !== uid) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_RECOMMENT));
            await ReComment.updateReComment(rcid, content);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPDATE_RECOMMENT_SUCCESS, { rcid }));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    },
    deleteReComment: async (req, res) => {
        const { cid, rcid, uid } = req.params;
        try {
            const reComment = await ReComment.getReComment(rcid);
            if (reComment === -1) return res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, responseMessage.NO_RECOMMENT));
            if (reComment.uid !== uid) return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_RECOMMENT));
            await ReComment.deleteReComment(rcid);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_RECOMMENT_SUCCESS));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));
        }
    }
};
